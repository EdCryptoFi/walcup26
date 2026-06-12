import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMemWal, isMemWalConfigured, formatPredictionMemory } from '@/lib/memwal';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { Prediction } from '@/types';
import { loadRealUsers, saveRealUsers } from '@/lib/users-data';
import { logError } from '@/lib/error-logger';

// ── Rate limiting: per-IP (20/min) + per-userId (10/min) ───────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT   = 20;
const USER_RATE_LIMIT = 10;
const RATE_WINDOW_MS  = 60_000;

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// sui-* userId must be exactly "sui-" + 8 lowercase hex chars
const SUI_USER_ID_RE = /^sui-[a-f0-9]{8}$/;

const PredictSchema = z.object({
  userId: z.string().min(1).max(40),
  username: z.string().min(1).max(40),
  matchId: z.string().max(10),
  predictedWinner: z.string().max(10),
  predictedHomeScore: z.number().int().min(0).max(20).optional(),
  predictedAwayScore: z.number().int().min(0).max(20).optional(),
  confidence: z.number().int().min(1).max(5),
  opinion: z.string().max(500).optional(),
  signature: z.string().max(2048).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(`ip:${ip}`, IP_RATE_LIMIT)) {
    return NextResponse.json({ error: 'Too many requests — slow down!' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PredictSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const { userId, signature } = data;

  // Per-userId rate limit (10/min)
  if (!checkRateLimit(`uid:${userId}`, USER_RATE_LIMIT)) {
    return NextResponse.json({ error: 'Too many predictions for this user — wait a moment.' }, { status: 429 });
  }

  // Wallet users (sui-*) must provide a signature from their wallet
  if (userId.startsWith('sui-')) {
    if (!SUI_USER_ID_RE.test(userId)) {
      return NextResponse.json({ error: 'Invalid wallet userId format.' }, { status: 400 });
    }
    if (!signature) {
      return NextResponse.json({ error: 'Wallet users must sign their prediction.' }, { status: 403 });
    }
  }

  const match = MATCH_MAP.get(data.matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  // Block predictions for matches that have already started
  if (new Date(match.date) <= new Date()) {
    return NextResponse.json({ error: 'This match has already started — predictions are closed.' }, { status: 400 });
  }

  // Validate predictedWinner is a valid team or 'draw'
  if (
    data.predictedWinner !== 'draw' &&
    data.predictedWinner !== match.homeTeamId &&
    data.predictedWinner !== match.awayTeamId
  ) {
    return NextResponse.json({ error: 'predictedWinner must be a team in this match or "draw"' }, { status: 400 });
  }

  const prediction: Prediction = {
    id: `${data.userId}-${data.matchId}-${Date.now()}`,
    userId: data.userId,
    matchId: data.matchId,
    predictedWinner: data.predictedWinner,
    predictedHomeScore: data.predictedHomeScore,
    predictedAwayScore: data.predictedAwayScore,
    confidence: data.confidence as 1|2|3|4|5,
    opinion: data.opinion,
    timestamp: new Date().toISOString(),
    sessionId: `session-${Date.now()}`,
  };

  let memwalBlobId: string | undefined;

  // Store to MemWal if configured — with 8s timeout to avoid Vercel function timeout
  if (isMemWalConfigured()) {
    try {
      const memwal = getMemWal(data.userId);
      const homeTeam = TEAM_MAP.get(match.homeTeamId);
      const awayTeam = TEAM_MAP.get(match.awayTeamId);
      const matchLabel = `${homeTeam?.name ?? match.homeTeamId} vs ${awayTeam?.name ?? match.awayTeamId} (Group ${match.group}, MD${match.matchday})`;
      const predictedLabel =
        data.predictedWinner === 'draw'
          ? 'a draw'
          : `${TEAM_MAP.get(data.predictedWinner)?.name ?? data.predictedWinner} win`;
      const scoreLabel =
        data.predictedHomeScore !== undefined
          ? `${data.predictedHomeScore}-${data.predictedAwayScore}`
          : undefined;

      const memoryText = formatPredictionMemory({
        username: data.username,
        matchLabel,
        predicted: predictedLabel,
        score: scoreLabel,
        confidence: data.confidence,
        opinion: data.opinion,
        timestamp: prediction.timestamp,
      });

      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
      const job = await Promise.race([memwal.rememberAndWait(memoryText), timeout]);
      memwalBlobId = job?.blob_id;
      prediction.memwalBlobId = memwalBlobId;
    } catch (err) {
      logError('predict:memwal', 'MemWal store failed', err instanceof Error ? err.message : String(err));
    }
  }

  // Update real users store
  const users = await loadRealUsers();
  let user = users.find((u) => u.id === data.userId);

  if (!user) {
    user = {
      id: data.userId,
      username: data.username,
      avatar: '👤',
      joinedAt: new Date().toISOString(),
      stats: { totalPredictions: 0, correctWinners: 0, exactScores: 0, points: 0, winnerAccuracy: 0, streak: 0, bestStreak: 0 },
      predictions: [],
      isReal: true,
      memwalNamespace: `wc2026-${data.userId}`,
    };
    users.push(user);
  }

  // Replace existing prediction for same match or add new one
  const existingIdx = user.predictions.findIndex((p) => p.matchId === data.matchId);
  if (existingIdx >= 0) {
    user.predictions[existingIdx] = prediction;
  } else {
    user.predictions.push(prediction);
    user.stats.totalPredictions++;
  }

  try { await saveRealUsers(users); } catch (err) { logError('predict:save', 'saveRealUsers failed', err instanceof Error ? err.message : String(err)); }

  return NextResponse.json({ prediction, memwalBlobId, stored: !!memwalBlobId });
}
