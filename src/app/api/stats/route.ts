import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/users-data';

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json({ playerCount: users.length });
}
