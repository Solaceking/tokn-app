import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';
import { decrypt } from '@/lib/server-encryption';

// GET - Decrypt and return team token
export async function GET(
  request: Request,
  { params }: { params: { id: string; tokenId: string } }
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
    
    // Get team token
    const token = await prisma.teamToken.findUnique({
      where: { 
        id: params.tokenId,
        teamId: params.id
      }
    });
    
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    
    // Decrypt the token
    const decryptedToken = decrypt(token.token, token.iv);
    
    return NextResponse.json({ 
      token: {
        id: token.id,
        service: token.service,
        token: decryptedToken,
        description: token.description,
        category: token.category,
        status: token.status,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt
      }
    });
  } catch (error) {
    console.error('Get team token error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team token' },
      { status: 500 }
    );
  }
}

// PATCH - Update team token
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; tokenId: string } }
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
    
    const body = await request.json();
    const { service, token, description, category, status } = body;
    
    // Get existing token
    const existingToken = await prisma.teamToken.findUnique({
      where: { 
        id: params.tokenId,
        teamId: params.id
      }
    });
    
    if (!existingToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (service) updateData.service = service.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (status) updateData.status = status;
    
    // If token is provided, encrypt it
    if (token) {
      const { encryptedData, iv } = encrypt(token);
      updateData.token = encryptedData;
      updateData.iv = iv;
    }
    
    // Update token
    const updatedToken = await prisma.teamToken.update({
      where: { id: params.tokenId },
      data: updateData
    });
    
    return NextResponse.json({ 
      token: {
        id: updatedToken.id,
        service: updatedToken.service,
        description: updatedToken.description,
        category: updatedToken.category,
        status: updatedToken.status,
        createdAt: updatedToken.createdAt,
        updatedAt: updatedToken.updatedAt
      }
    });
  } catch (error) {
    console.error('Update team token error:', error);
    return NextResponse.json(
      { error: 'Failed to update team token' },
      { status: 500 }
    );
  }
}

// DELETE - Remove team token
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tokenId: string } }
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
    
    // Delete team token
    await prisma.teamToken.delete({
      where: { 
        id: params.tokenId,
        teamId: params.id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete team token error:', error);
    return NextResponse.json(
      { error: 'Failed to delete team token' },
      { status: 500 }
    );
  }
}