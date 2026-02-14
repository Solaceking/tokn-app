import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';

// GET all teams for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get database user
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get teams where user is a member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: dbUser.id },
          { members: { some: { userId: dbUser.id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                full_name: true,
                avatar_url: true
              }
            }
          }
        },
        _count: {
          select: {
            tokens: true,
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST - Create a new team
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is PRO
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser || dbUser.plan !== 'PRO') {
      return NextResponse.json({ 
        error: 'PRO plan required to create teams' 
      }, { status: 403 });
    }
    
    const body = await request.json();
    const { name } = body;
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Team name must be at least 2 characters' 
      }, { status: 400 });
    }
    
    // Create team
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        ownerId: dbUser.id
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                full_name: true,
                avatar_url: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json({ team });
  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}