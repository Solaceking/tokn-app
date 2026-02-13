/**
 * Token Management API
 * Uses Supabase Auth and Prisma with server-side encryption
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { encryptToken, decryptToken } from '@/lib/server-encryption';
import { prisma } from '@/lib/db';
import { TokenStatus } from '@prisma/client';

// GET /api/tokens - Get all tokens for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const tokens = await prisma.token.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // Return tokens without decrypting (frontend shows masked)
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Get tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

// POST /api/tokens - Create a new token
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { service, token, description, category, status } = body;
    
    if (!service || !token) {
      return NextResponse.json(
        { error: 'Service and token are required' },
        { status: 400 }
      );
    }
    
    // Encrypt the token before storing
    const encryptedToken = await encryptToken(token);
    
    const newToken = await prisma.token.create({
      data: {
        service,
        token: encryptedToken,
        description: description || '',
        category: category || 'Other',
        status: (status as TokenStatus) || 'ACTIVE',
        userId: user.id,
      },
    });
    
    // Log activity
    await logActivity(user.id, 'CREATE', service, 'Token created');
    
    return NextResponse.json(newToken);
  } catch (error) {
    console.error('Create token error:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}

// PATCH /api/tokens - Update a token
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, service, token, description, category, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }
    
    // Build update data
    const updateData: {
      service?: string;
      description?: string;
      category?: string;
      status?: TokenStatus;
      token?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };
    
    if (service) updateData.service = service;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (status) updateData.status = status as TokenStatus;
    if (token) updateData.token = await encryptToken(token);
    
    const updatedToken = await prisma.token.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: updateData,
    });
    
    if (updatedToken.count === 0) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Log activity
    await logActivity(user.id, 'UPDATE', service || 'Token', 'Token updated');
    
    // Return the updated token
    const tokenData = await prisma.token.findUnique({
      where: { id },
    });
    
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Update token error:', error);
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    );
  }
}

// DELETE /api/tokens - Delete a token
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }
    
    // Get token info before deleting for activity log
    const token = await prisma.token.findFirst({
      where: { id, userId: user.id },
    });
    
    const result = await prisma.token.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });
    
    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Log activity
    if (token) {
      await logActivity(user.id, 'DELETE', token.service, 'Token deleted');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete token error:', error);
    return NextResponse.json(
      { error: 'Failed to delete token' },
      { status: 500 }
    );
  }
}

/**
 * Helper to log activity
 */
async function logActivity(
  userId: string,
  action: string,
  service: string,
  details?: string
): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        service,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}