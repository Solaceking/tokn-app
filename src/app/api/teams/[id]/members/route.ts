import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';

// GET team members
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user is team member
    const team = await prisma.team.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: dbUser.id },
          { members: { some: { userId: dbUser.id } } }
        ]
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    // Get team members
    const members = await prisma.teamMember.findMany({
      where: { teamId: params.id },
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

// POST - Invite member to team
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user is team owner/admin
    const team = await prisma.team.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: dbUser.id },
          { 
            members: { 
              some: { 
                userId: dbUser.id,
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
    
    // Find user to invite
    const invitedUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!invitedUser) {
      return NextResponse.json({ 
        error: 'User not found. Please ask them to sign up first.' 
      }, { status: 404 });
    }
    
    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: params.id,
          userId: invitedUser.id
        }
      }
    });
    
    if (existingMember) {
      return NextResponse.json({ 
        error: 'User is already a team member' 
      }, { status: 400 });
    }
    
    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId: params.id,
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