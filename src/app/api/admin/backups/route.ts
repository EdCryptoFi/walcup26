import { NextRequest, NextResponse } from 'next/server';
import { convexQuery, convexMutation } from '@/lib/convex-client';
import { saveRealUsers } from '@/lib/users-data';
import { logInfo, logError } from '@/lib/error-logger';
import { User } from '@/types';

function isAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// GET /api/admin/backups — list recent backups
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const backups = await convexQuery<unknown[]>('backups:list', { limit: 10 });
  return NextResponse.json({ backups: backups ?? [] });
}

// POST /api/admin/backups — restore from a backup
// Body: { id: "<convex backup id>" }
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.id || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Missing backup id' }, { status: 400 });
  }

  try {
    // Fetch the full backup document
    const backup = await convexQuery<{ timestamp: string; userCount: number; data: string } | null>(
      'backups:getById',
      { id: body.id }
    );

    if (!backup) return NextResponse.json({ error: 'Backup not found' }, { status: 404 });

    const users: User[] = JSON.parse(backup.data);
    await saveRealUsers(users);

    logInfo('backup', `Restored from backup ${backup.timestamp}`, { userCount: users.length });

    return NextResponse.json({
      ok: true,
      restoredFrom: backup.timestamp,
      userCount: users.length,
    });
  } catch (err) {
    logError('backup', 'Restore failed', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Restore failed' }, { status: 500 });
  }
}
