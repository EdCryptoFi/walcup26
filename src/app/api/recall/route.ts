import { NextRequest, NextResponse } from 'next/server';
import { getMemWal, isMemWalConfigured } from '@/lib/memwal';
import { SEED_USERS } from '@/lib/seed-data';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { MemWalQueryResponse, User } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = path.join(process.cwd(), 'data', 'real-users.json');

function loadRealUsers(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8')) as User[];
  } catch {}
  return [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const query = searchParams.get('query') ?? 'predictions';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 50);

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const realUsers = loadRealUsers();
  const seedUser = SEED_USERS.find((u) => u.id === userId);
  const realUser = realUsers.find((u) => u.id === userId);
  const user = realUser ?? seedUser;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Real MemWal recall for real users
  if (realUser && isMemWalConfigured()) {
    try {
      const memwal = getMemWal(userId);
      const result = await memwal.recall({ query, limit, maxDistance: 0.7 });
      const response: MemWalQueryResponse = {
        userId,
        username: user.username,
        query,
        results: result.results.map((r: { blob_id: string; text: string; distance: number }) => ({
          blobId: r.blob_id,
          text: r.text,
          distance: r.distance,
        })),
        total: result.total,
      };
      return NextResponse.json(response);
    } catch (err) {
      console.error('MemWal recall failed:', err);
      // Fall through to synthetic response
    }
  }

  // For seeded users (or fallback): synthesize recall results from local predictions
  const syntheticResults = user.predictions
    .filter((p) => {
      const match = MATCH_MAP.get(p.matchId);
      if (!match) return false;
      const home = TEAM_MAP.get(match.homeTeamId);
      const away = TEAM_MAP.get(match.awayTeamId);
      const text = `${home?.name} ${away?.name} ${p.predictedWinner} ${p.opinion ?? ''}`.toLowerCase();
      return query.split(' ').some((word) => text.includes(word.toLowerCase()));
    })
    .slice(0, limit)
    .map((p) => {
      const match = MATCH_MAP.get(p.matchId)!;
      const home = TEAM_MAP.get(match.homeTeamId);
      const away = TEAM_MAP.get(match.awayTeamId);
      const winnerName =
        p.predictedWinner === 'draw'
          ? 'a draw'
          : `${TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner} win`;
      const scoreStr =
        p.predictedHomeScore !== undefined ? ` (${p.predictedHomeScore}-${p.predictedAwayScore})` : '';
      return {
        blobId: `synthetic-${p.matchId}`,
        text: `[PREDICTION] ${user.username} predicted ${winnerName}${scoreStr} in ${home?.name} vs ${away?.name} (Group ${match.group}). Confidence: ${p.confidence}/5.${p.opinion ? ` Opinion: "${p.opinion}"` : ''} Recorded at: ${p.timestamp}.`,
        distance: 0.3,
      };
    });

  const response: MemWalQueryResponse = {
    userId,
    username: user.username,
    query,
    results: syntheticResults,
    total: syntheticResults.length,
  };

  return NextResponse.json(response);
}
