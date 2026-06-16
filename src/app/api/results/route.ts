import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { getMemWal, isMemWalConfigured, formatResultMemory } from '@/lib/memwal';
import { scorePrediction } from '@/lib/scoring';
import { loadRealUsers, saveRealUsers } from '@/lib/users-data';
import { logError } from '@/lib/error-logger';
import { convexQuery, convexMutation, isConvexConfigured } from '@/lib/convex-client';

const ResultSchema = z.object({
  matchId: z.string(),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});

// GET /api/results — fetch all scored match results from Convex
export async function GET() {
  if (!isConvexConfigured()) {
    return NextResponse.json({ results: {} });
  }
  const results = await convexQuery<Record<string, { homeScore: number; awayScore: number }>>('matchResults:getAll') ?? {};
  return NextResponse.json({ results });
}

// POST /api/results — add a result and score all user predictions (admin only, idempotent)
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { matchId, homeScore, awayScore } = parsed.data;
  const match = MATCH_MAP.get(matchId);
  if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });

  // Idempotency check — skip if already scored (prevents double-counting)
  if (isConvexConfigured()) {
    const existing = await convexQuery<{ matchId: string } | null>('matchResults:getById', { matchId });
    if (existing) {
      return NextResponse.json({ matchId, alreadyScored: true, skipped: true });
    }
  }

  // Score all real users' predictions for this match
  const matchWithResult = {
    ...match,
    result: { homeScore, awayScore, status: 'finished' as const },
  };

  const users = await loadRealUsers();
  const updated: string[] = [];

  const actualWinner =
    homeScore > awayScore ? match.homeTeamId
    : homeScore < awayScore ? match.awayTeamId
    : 'draw';

  for (const user of users) {
    const pred = user.predictions.find((p) => p.matchId === matchId);
    if (!pred) continue;

    const pts = scorePrediction(pred, matchWithResult);
    pred.pointsEarned = pts;
    user.stats.points += pts;

    if (pred.predictedWinner === actualWinner) {
      user.stats.correctWinners++;
      if (pred.predictedHomeScore === homeScore && pred.predictedAwayScore === awayScore) {
        user.stats.exactScores++;
      }
    }

    // Recalculate accuracy over all played matches
    const allResults = isConvexConfigured()
      ? (await convexQuery<Record<string, unknown>>('matchResults:getAll') ?? {})
      : {};
    const tempResults = { ...allResults, [matchId]: { homeScore, awayScore } };
    const played = user.predictions.filter((p) => tempResults[p.matchId]).length;
    user.stats.winnerAccuracy = played > 0 ? user.stats.correctWinners / played : 0;

    // Write result memory to MemWal
    if (isMemWalConfigured()) {
      try {
        const memwal = getMemWal(user.id);
        const home = TEAM_MAP.get(match.homeTeamId);
        const away = TEAM_MAP.get(match.awayTeamId);
        const predictedLabel =
          pred.predictedWinner === 'draw' ? 'a draw'
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

  await saveRealUsers(users).catch((err) =>
    logError('results:save', 'saveRealUsers failed', err instanceof Error ? err.message : String(err))
  );

  // Persist result to Convex (prevents double-scoring on future calls)
  if (isConvexConfigured()) {
    await convexMutation('matchResults:upsert', {
      matchId,
      homeScore,
      awayScore,
      scoredAt: new Date().toISOString(),
      usersScored: updated.length,
    }).catch((err) =>
      logError('results:convex', 'Convex upsert failed', err instanceof Error ? err.message : String(err))
    );
  }

  return NextResponse.json({ matchId, homeScore, awayScore, usersScored: updated.length });
}
