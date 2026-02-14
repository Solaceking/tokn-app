import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name } = body;
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Team name must be at least 2 characters' 
      }, { status: 400 });
    }
    
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        ownerId: user.id
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