import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET activities for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    const activities = await db.activity.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE clear all activities
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    await db.activity.deleteMany({
      where: { userId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
