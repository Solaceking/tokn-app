import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const team = await prisma.team.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const members = await prisma.teamMember.findMany({
      where: { teamId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            avatar_url: true
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' }
      ]
    });
    
    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const team = await prisma.team.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: user.id },
          { 
            members: { 
              some: { 
                userId: user.id,
                role: { in: ['OWNER', 'ADMIN'] }
              } 
            } 
          }
        ]
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }
    
    const invitedUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!invitedUser) {
      return NextResponse.json({ 
        error: 'User not found. Please ask them to sign up first.' 
      }, { status: 404 });
    }
    
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId: invitedUser.id
        }
      }
    });
    
    if (existingMember) {
      return NextResponse.json({ 
        error: 'User is already a team member' 
      }, { status: 400 });
    }
    
    const member = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId: invitedUser.id,
        role: 'MEMBER'
      },
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
    });
    
    return NextResponse.json({ member });
  } catch (error) {
    console.error('Invite team member error:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}