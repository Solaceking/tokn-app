import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/server-encryption';

// GET team tokens
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
    
    // Get team tokens
    const tokens = await prisma.teamToken.findMany({
      where: { teamId: params.id },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Return tokens without decrypted values for security
    const safeTokens = tokens.map(token => ({
      id: token.id,
      service: token.service,
      description: token.description,
      category: token.category,
      status: token.status,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt
    }));
    
    return NextResponse.json({ tokens: safeTokens });
  } catch (error) {
    console.error('Get team tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team tokens' },
      { status: 500 }
    );
  }
}

// POST - Create team token
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
    const { service, token, description, category } = body;
    
    if (!service || !token) {
      return NextResponse.json({ 
        error: 'Service and token are required' 
      }, { status: 400 });
    }
    
    // Encrypt the token
    const { encryptedData, iv } = encrypt(token);
    
    // Create team token
    const teamToken = await prisma.teamToken.create({
      data: {
        teamId: params.id,
        service: service.trim(),
        token: encryptedData,
        iv,
        description: description?.trim() || null,
        category: category?.trim() || null
      }
    });
    
    return NextResponse.json({ 
      token: {
        id: teamToken.id,
        service: teamToken.service,
        description: teamToken.description,
        category: teamToken.category,
        status: teamToken.status,
        createdAt: teamToken.createdAt,
        updatedAt: teamToken.updatedAt
      }
    });
  } catch (error) {
    console.error('Create team token error:', error);
    return NextResponse.json(
      { error: 'Failed to create team token' },
      { status: 500 }
    );
  }
}