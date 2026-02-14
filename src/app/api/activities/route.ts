/**
 * Activity Logging API
 * GET: Fetch user's activity log
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      skip: offset,
    });
    
    const total = await prisma.activity.count({
      where: { userId: user.id },
    });
    
    return NextResponse.json({
      activities,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + activities.length < total,
      },
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}