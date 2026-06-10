import { NextRequest, NextResponse } from 'next/server';
import { convexQuery, convexMutation } from '@/lib/convex-client';

function isAdmin(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// GET /api/admin/logs?level=error&limit=50
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level') ?? undefined;
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);

  const logs = await convexQuery<unknown[]>('errorLogs:getLogs', {
    limit,
    ...(level ? { level } : {}),
  });

  return NextResponse.json({ logs: logs ?? [] });
}

// DELETE /api/admin/logs?days=30 — clear logs older than N days
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '30', 10);
  const before = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const result = await convexMutation<{ deleted: number }>('errorLogs:clearBefore', { before });
  return NextResponse.json({ ok: true, deleted: result?.deleted ?? 0, before });
}
