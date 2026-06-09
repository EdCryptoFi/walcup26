import { NextRequest, NextResponse } from 'next/server';
import { SEED_USERS } from '@/lib/seed-data';
import { User } from '@/types';
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

export function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    const realUsers = loadRealUsers();
    const user =
      realUsers.find((u) => u.id === id) ??
      SEED_USERS.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  });
}
