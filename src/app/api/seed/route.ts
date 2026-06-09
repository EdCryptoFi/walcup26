import { NextResponse } from 'next/server';
import { SEED_USERS } from '@/lib/seed-data';
import { getMemWal, isMemWalConfigured, formatPredictionMemory } from '@/lib/memwal';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';

// POST /api/seed — writes a summary memory to MemWal for each seed user.
// Lightweight: 1 memory per user (not all 72 predictions), suitable for demo.
export async function POST() {
  if (!isMemWalConfigured()) {
    return NextResponse.json({
      message: 'MemWal not configured — seed users exist in-memory only.',
      users: SEED_USERS.length,
    });
  }

  const results: { userId: string; status: string; blobId?: string }[] = [];

  for (const user of SEED_USERS) {
    try {
      const memwal = getMemWal(user.id);

      // Pick 3 representative predictions for this user's MemWal seed
      const samplePreds = user.predictions.slice(0, 3);
      const lines = samplePreds.map((p) => {
        const match = MATCH_MAP.get(p.matchId);
        if (!match) return '';
        const home = TEAM_MAP.get(match.homeTeamId);
        const away = TEAM_MAP.get(match.awayTeamId);
        const winner =
          p.predictedWinner === 'draw'
            ? 'draw'
            : TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner;
        return `${home?.name} vs ${away?.name}: ${winner} (${p.confidence}/5 confidence)`;
      });

      const memoryText = formatPredictionMemory({
        username: user.username,
        matchLabel: 'session start — multiple Group Stage matches',
        predicted: lines.join('; '),
        confidence: 3,
        opinion: user.favoriteTeam
          ? `My favorite team is ${TEAM_MAP.get(user.favoriteTeam)?.name ?? user.favoriteTeam}`
          : undefined,
        timestamp: user.joinedAt,
      });

      const job = await memwal.rememberAndWait(memoryText);
      results.push({ userId: user.id, status: 'ok', blobId: job?.blob_id });
    } catch (err) {
      results.push({ userId: user.id, status: `error: ${String(err)}` });
    }
  }

  return NextResponse.json({ seeded: results.length, results });
}
