import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/users-data';

export async function GET() {
  const entries = await getLeaderboard();
  return NextResponse.json({ leaderboard: entries, total: entries.length });
}
