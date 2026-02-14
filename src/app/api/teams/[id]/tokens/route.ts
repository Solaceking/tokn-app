import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/server-encryption';
import { checkApiAccessForUser } from '@/lib/api-middleware';

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
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const team = await prisma.team.findFirst({
      where: {
        id,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      }
    });
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    const tokens = await prisma.teamToken.findMany({
      where: { teamId: id },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const team = await prisma.team.findFirst({
      where: {
        id,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
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
    
    const encryptedToken = await encrypt(token);
    
    const teamToken = await prisma.teamToken.create({
      data: {
        teamId: id,
        service: service.trim(),
        token: encryptedToken,
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