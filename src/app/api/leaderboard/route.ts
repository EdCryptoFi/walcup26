import { NextResponse } from 'next/server';
import { SEED_USERS } from '@/lib/seed-data';
import { User, LeaderboardEntry } from '@/types';
import fs from 'fs';
import path from 'path';

const REAL_USERS_FILE = path.join(process.cwd(), 'data', 'real-users.json');

function loadRealUsers(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) {
      return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function toEntry(user: User, rank: number): LeaderboardEntry {
  return {
    rank,
    userId: user.id,
    username: user.username,
    avatar: user.avatar,
    favoriteTeam: user.favoriteTeam,
    points: user.stats.points,
    correctWinners: user.stats.correctWinners,
    exactScores: user.stats.exactScores,
    totalPredictions: user.stats.totalPredictions,
    accuracy: Number((user.stats.winnerAccuracy * 100).toFixed(1)),
    isReal: user.isReal,
    streak: user.stats.streak,
  };
}

export function GET() {
  const realUsers = loadRealUsers();
  const allUsers = [...realUsers, ...SEED_USERS];

  const sorted = [...allUsers].sort(
    (a, b) =>
      b.stats.points - a.stats.points ||
      b.stats.exactScores - a.stats.exactScores ||
      b.stats.correctWinners - a.stats.correctWinners
  );

  const entries = sorted.map((u, i) => toEntry(u, i + 1));
  return NextResponse.json({ leaderboard: entries, total: entries.length });
}
