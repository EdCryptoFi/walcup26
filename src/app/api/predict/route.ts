import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMemWal, isMemWalConfigured, formatPredictionMemory } from '@/lib/memwal';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { Prediction, User } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = process.env.VERCEL
  ? '/tmp/wc-real-users.json'
  : path.join(process.cwd(), 'data', 'real-users.json');

const PredictSchema = z.object({
  userId: z.string().min(1).max(40),
  username: z.string().min(1).max(40),
  matchId: z.string(),
  predictedWinner: z.string(),
  predictedHomeScore: z.number().int().min(0).max(20).optional(),
  predictedAwayScore: z.number().int().min(0).max(20).optional(),
  confidence: z.number().int().min(1).max(5),
  opinion: z.string().max(500).optional(),
});

function loadRealUsers(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) {
      return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveRealUsers(users: User[]) {
  const dir = path.dirname(REAL_USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REAL_USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = PredictSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const match = MATCH_MAP.get(data.matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
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

  // Store to MemWal if configured
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

      const job = await memwal.rememberAndWait(memoryText);
      memwalBlobId = job?.blob_id;
      prediction.memwalBlobId = memwalBlobId;
    } catch (err) {
      console.error('MemWal store failed:', err);
    }
  }

  // Update real users store
  const users = loadRealUsers();
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

  try { saveRealUsers(users); } catch (err) { console.error('saveRealUsers failed:', err); }

  return NextResponse.json({ prediction, memwalBlobId, stored: !!memwalBlobId });
}
