import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';

// DELETE - Remove team member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
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
    
    // Get member to remove
    const member = await prisma.teamMember.findUnique({
      where: { id: params.memberId },
      include: { user: true }
    });
    
    if (!member || member.teamId !== params.id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    // Cannot remove team owner
    if (member.role === 'OWNER') {
      return NextResponse.json({ 
        error: 'Cannot remove team owner' 
      }, { status: 400 });
    }
    
    // Cannot remove yourself if you're the owner
    if (member.userId === team.ownerId && member.userId === dbUser.id) {
      return NextResponse.json({ 
        error: 'Cannot remove yourself as team owner' 
      }, { status: 400 });
    }
    
    // Remove member
    await prisma.teamMember.delete({
      where: { id: params.memberId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}

// PATCH - Update member role
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
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
    
    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: {
        id: params.id,
        ownerId: dbUser.id
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { role } = body;
    
    if (!role || !['OWNER', 'ADMIN', 'MEMBER'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role' 
      }, { status: 400 });
    }
    
    // Get member to update
    const member = await prisma.teamMember.findUnique({
      where: { id: params.memberId }
    });
    
    if (!member || member.teamId !== params.id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    // Cannot change owner role
    if (member.role === 'OWNER' && role !== 'OWNER') {
      return NextResponse.json({ 
        error: 'Cannot change owner role' 
      }, { status: 400 });
    }
    
    // Update member role
    const updatedMember = await prisma.teamMember.update({
      where: { id: params.memberId },
      data: { role },
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
    
    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}