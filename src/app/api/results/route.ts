import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';
import { getMemWal, isMemWalConfigured, formatResultMemory } from '@/lib/memwal';
import { scorePrediction } from '@/lib/scoring';
import { User } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = path.join(process.cwd(), 'data', 'real-users.json');
const RESULTS_FILE = path.join(process.cwd(), 'data', 'results.json');

const ResultSchema = z.object({
  matchId: z.string(),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});

function loadRealUsers(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8'));
  } catch {}
  return [];
}

function saveRealUsers(users: User[]) {
  const dir = path.dirname(REAL_USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REAL_USERS_FILE, JSON.stringify(users, null, 2));
}

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

  const users = loadRealUsers();
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

        await memwal.rememberAndWait(text).catch(console.error);
      } catch {}
    }

    updated.push(user.id);
  }

  saveRealUsers(users);

  return NextResponse.json({
    matchId,
    homeScore,
    awayScore,
    usersScored: updated.length,
  });
}
