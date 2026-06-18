import { NextRequest, NextResponse } from 'next/server';
import { loadRealUsers, saveRealUsers } from '@/lib/users-data';
import { convexMutation, isConvexConfigured, convexQuery } from '@/lib/convex-client';

// POST /api/admin/reset-scores — wipe all user points + matchResults, then rescore
// DESTRUCTIVE but safe: predictions are never touched
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Reset all real user stats (leave predictions intact)
  const users = await loadRealUsers();
  for (const user of users) {
    if (!user.isReal) continue;
    user.stats.points = 0;
    user.stats.correctWinners = 0;
    user.stats.exactScores = 0;
    user.stats.winnerAccuracy = 0;
    // Clear pointsEarned on each prediction so rescore is clean
    for (const p of user.predictions) {
      p.pointsEarned = undefined;
    }
  }
  await saveRealUsers(users);

  // Clear matchResults in Convex
  let clearedCount = 0;
  if (isConvexConfigured()) {
    const existing = await convexQuery<Record<string, unknown>>('matchResults:getAll') ?? {};
    clearedCount = Object.keys(existing).length;
    await convexMutation('matchResults:deleteAll', {});
  }

  return NextResponse.json({
    ok: true,
    usersReset: users.filter((u) => u.isReal).length,
    matchResultsCleared: clearedCount,
  });
}
