import { NextResponse } from 'next/server';
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

export function GET() {
  const realUsers = loadRealUsers();
  const allUsers = [...realUsers, ...SEED_USERS];
  return NextResponse.json({ users: allUsers, total: allUsers.length });
}
