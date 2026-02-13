/**
 * Activity Logging API
 * GET: Fetch user's activity log
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';

// GET /api/activities - Get user's activity log
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
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