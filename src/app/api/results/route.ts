import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { getMemWal, isMemWalConfigured, formatResultMemory } from '@/lib/memwal';
import { scorePrediction } from '@/lib/scoring';
import { loadRealUsers, saveRealUsers } from '@/lib/users-data';
import { logError } from '@/lib/error-logger';
import fs from 'fs';
import path from 'path';

const RESULTS_FILE = process.env.VERCEL
  ? '/tmp/wc-results.json'
  : path.join(process.cwd(), 'data', 'results.json');

const ResultSchema = z.object({
  matchId: z.string(),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});

function loadResults(): Record<string, { homeScore: number; awayScore: number }> {
  try {
    if (fs.existsSync(RESULTS_FILE)) return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  } catch {}
  return {};
}

function saveResults(results: Record<string, { homeScore: number; awayScore: number }>) {
  const dir = path.dirname(RESULTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

// GET /api/results — fetch current results (demo + real)
export function GET() {
  const results = loadResults();
  return NextResponse.json({ results });
}

// POST /api/results — add a match result and score all user predictions (admin only)
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized — admin secret required' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { matchId, homeScore, awayScore } = parsed.data;
  const match = MATCH_MAP.get(matchId);
  if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

  // Persist result
  const results = loadResults();
  results[matchId] = { homeScore, awayScore };
  saveResults(results);

  // Score all real users' predictions for this match
  const matchWithResult = {
    ...match,
    result: { homeScore, awayScore, status: 'finished' as const },
  };

  const users = await loadRealUsers();
  const updated: string[] = [];

  for (const user of users) {
    const pred = user.predictions.find((p) => p.matchId === matchId);
    if (!pred) continue;

    const pts = scorePrediction(pred, matchWithResult);
    pred.pointsEarned = pts;
    user.stats.points += pts;

    const actualWinner =
      homeScore > awayScore ? match.homeTeamId
      : homeScore < awayScore ? match.awayTeamId
      : 'draw';

    if (pred.predictedWinner === actualWinner) {
      user.stats.correctWinners++;
      if (
        pred.predictedHomeScore === homeScore &&
        pred.predictedAwayScore === awayScore
      ) {
        user.stats.exactScores++;
      }
    }

    const played = user.predictions.filter((p) => results[p.matchId]).length;
    user.stats.winnerAccuracy = played > 0 ? user.stats.correctWinners / played : 0;

    // Store result memory in MemWal
    if (isMemWalConfigured()) {
      try {
        const memwal = getMemWal(user.id);
        const home = TEAM_MAP.get(match.homeTeamId);
        const away = TEAM_MAP.get(match.awayTeamId);
        const predictedLabel =
          pred.predictedWinner === 'draw'
            ? 'a draw'
            : `${TEAM_MAP.get(pred.predictedWinner)?.name ?? pred.predictedWinner} win`;

        const text = formatResultMemory({
          username: user.username,
          matchLabel: `${home?.name} vs ${away?.name}`,
          result: `${home?.name} ${homeScore}-${awayScore} ${away?.name}`,
          predicted: predictedLabel,
          correct: pred.predictedWinner === actualWinner,
          pointsEarned: pts,
          cumulativePoints: user.stats.points,
        });

        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
        await Promise.race([memwal.rememberAndWait(text), timeout])
          .catch((err) => logError('results:memwal', 'MemWal result store failed', err instanceof Error ? err.message : String(err)));
      } catch {}
    }

    updated.push(user.id);
  }

  await saveRealUsers(users);

  return NextResponse.json({
    matchId,
    homeScore,
    awayScore,
    usersScored: updated.length,
  });
}
