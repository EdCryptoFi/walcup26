import fs from 'fs';
import path from 'path';
import { User, LeaderboardEntry } from '@/types';
import { SEED_USERS } from '@/lib/seed-data';
import { isConvexConfigured, convexQuery, convexMutation } from '@/lib/convex-client';

// ── Filesystem fallback (local dev / when Convex not configured) ────
const REAL_USERS_FILE = process.env.VERCEL
  ? '/tmp/wc-real-users.json'
  : path.join(process.cwd(), 'data', 'real-users.json');

function loadRealUsersFromFile(): User[] {
  try {
    if (fs.existsSync(REAL_USERS_FILE)) {
      return JSON.parse(fs.readFileSync(REAL_USERS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveRealUsersToFile(users: User[]) {
  try {
    const dir = path.dirname(REAL_USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(REAL_USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('saveRealUsersToFile failed:', err);
  }
}

// ── Convex types ────────────────────────────────────────────────────
type ConvexUserDoc = { odId: string; data: string };

// ── Primary data functions (Convex-first, filesystem fallback) ──────

export async function loadRealUsers(): Promise<User[]> {
  if (isConvexConfigured()) {
    const docs = await convexQuery<ConvexUserDoc[]>('realUsers:getAll');
    if (docs && docs.length > 0) {
      return docs.map((d) => JSON.parse(d.data) as User);
    }
    // If Convex returned empty, check filesystem (first-run migration)
    const fileUsers = loadRealUsersFromFile();
    if (fileUsers.length > 0) {
      await saveRealUsers(fileUsers);
    }
    return fileUsers;
  }
  return loadRealUsersFromFile();
}

export async function saveRealUsers(users: User[]): Promise<void> {
  // Always write to filesystem as backup
  saveRealUsersToFile(users);

  if (isConvexConfigured()) {
    const batch = users.map((u) => ({
      odId: u.id,
      data: JSON.stringify(u),
    }));
    await convexMutation('realUsers:saveAll', { users: batch });
  }
}

export async function saveOneUser(user: User): Promise<void> {
  // Update filesystem
  const users = loadRealUsersFromFile();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveRealUsersToFile(users);

  // Update Convex
  if (isConvexConfigured()) {
    await convexMutation('realUsers:upsert', {
      odId: user.id,
      data: JSON.stringify(user),
    });
  }
}

export async function getAllUsers(): Promise<User[]> {
  const realUsers = await loadRealUsers();
  return [...realUsers, ...SEED_USERS];
}

export async function getUserById(id: string): Promise<User | null> {
  if (isConvexConfigured()) {
    const doc = await convexQuery<ConvexUserDoc | null>('realUsers:getById', { odId: id });
    if (doc) return JSON.parse(doc.data) as User;
  } else {
    const fileUsers = loadRealUsersFromFile();
    const found = fileUsers.find((u) => u.id === id);
    if (found) return found;
  }
  return SEED_USERS.find((u) => u.id === id) ?? null;
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

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const allUsers = await getAllUsers();
  const sorted = [...allUsers].sort(
    (a, b) =>
      b.stats.points - a.stats.points ||
      b.stats.exactScores - a.stats.exactScores ||
      b.stats.correctWinners - a.stats.correctWinners
  );
  return sorted.map((u, i) => toEntry(u, i + 1));
}
