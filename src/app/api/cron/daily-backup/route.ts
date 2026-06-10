import { NextRequest, NextResponse } from 'next/server';
import { loadRealUsers } from '@/lib/users-data';
import { convexMutation } from '@/lib/convex-client';
import { logInfo, logError } from '@/lib/error-logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Called by Vercel Cron at 02:00 UTC daily.
// Also callable manually with x-admin-secret header for on-demand backups.
export async function GET(req: NextRequest) {
  const cronHeader = req.headers.get('authorization');
  const adminHeader = req.headers.get('x-admin-secret');
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;

  const fromVercelCron = cronSecret && cronHeader === `Bearer ${cronSecret}`;
  const fromAdmin = adminSecret && adminHeader === adminSecret;

  if (!fromVercelCron && !fromAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await loadRealUsers();
    const timestamp = new Date().toISOString();
    const triggeredBy = fromVercelCron ? 'cron' : 'manual';

    await convexMutation('backups:create', {
      timestamp,
      userCount: users.length,
      data: JSON.stringify(users),
      triggeredBy,
    });

    logInfo('backup', `Daily backup created — ${users.length} users`, { triggeredBy });

    return NextResponse.json({
      ok: true,
      timestamp,
      userCount: users.length,
      triggeredBy,
    });
  } catch (err) {
    logError('backup', 'Daily backup failed', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}
