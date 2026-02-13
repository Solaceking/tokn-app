/**
 * Token Management API
 * Uses Supabase Auth and Prisma with server-side encryption
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { encryptToken, decryptToken } from '@/lib/server-encryption';
import { prisma } from '@/lib/db';
import { TokenStatus } from '@prisma/client';

// Helper to get database user
async function getDbUser(supabaseUser: any) {
  let dbUser = await prisma.users.findUnique({
    where: { email: supabaseUser.email },
  });
  
  if (!dbUser) {
    dbUser = await prisma.users.create({
      data: {
        email: supabaseUser.email,
        username: supabaseUser.email?.split('@')[0] || 'user',
        full_name: supabaseUser.user_metadata?.full_name || null,
      },
    });
  }
  
  return dbUser;
}

// Check token limit for free users
async function checkTokenLimit(userId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const FREE_TOKEN_LIMIT = 15;
  
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  
  // Pro users have unlimited tokens
  if (user?.plan === 'PRO') {
    return { allowed: true, current: 0, limit: -1 };
  }
  
  // Check token count for free users
  const tokenCount = await prisma.token.count({
    where: { userId },
  });
  
  return {
    allowed: tokenCount < FREE_TOKEN_LIMIT,
    current: tokenCount,
    limit: FREE_TOKEN_LIMIT,
  };
}

// GET /api/tokens - Get all tokens for current user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get database user
    const dbUser = await getDbUser(user);
    
    // Check for export query param
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('export');
    
    const tokens = await prisma.token.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // Handle export
    if (exportType === 'env') {
      // Decrypt tokens for export
      const envLines = await Promise.all(tokens.map(async (t) => {
        const decrypted = await decryptToken(t.token);
        const serviceName = t.service.toUpperCase().replace(/\s+/g, '_');
        return `${serviceName}=${decrypted}`;
      }));
      
      return new NextResponse(envLines.join('\n'), {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
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
    
    // Get database user
    const dbUser = await getDbUser(user);
    
    const body = await request.json();
    const { service, token, description, category, status } = body;
    
    if (!service || !token) {
      return NextResponse.json(
        { error: 'Service and token are required' },
        { status: 400 }
      );
    }
    
    // Check token limit for free users
    const limitCheck = await checkTokenLimit(dbUser.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: 'Token limit reached',
        message: `Free tier limited to ${limitCheck.limit} tokens. Upgrade to Pro for unlimited tokens.`,
        current: limitCheck.current,
        limit: limitCheck.limit,
      }, { status: 403 });
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
        userId: dbUser.id,
      },
    });
    
    // Log activity
    await logActivity(dbUser.id, 'CREATE', service, 'Token created');
    
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