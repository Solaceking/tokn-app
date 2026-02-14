/**
 * Token Management API
 * Supports both Supabase Auth and Local Auth via auth abstraction
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { encryptToken, decryptToken } from '@/lib/server-encryption';
import { prisma } from '@/lib/db';
import { TokenStatus } from '@prisma/client';
import { withRateLimit, createRateLimiter, getRateLimitHeaders } from '@/lib/rate-limit';
import { checkApiAccessForUser } from '@/lib/api-middleware';

async function checkTokenLimit(userId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const FREE_TOKEN_LIMIT = 15;
  
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  
  if (user?.plan === 'PRO') {
    return { allowed: true, current: 0, limit: -1 };
  }
  
  const tokenCount = await prisma.token.count({
    where: { userId },
  });
  
  return {
    allowed: tokenCount < FREE_TOKEN_LIMIT,
    current: tokenCount,
    limit: FREE_TOKEN_LIMIT,
  };
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('export');
    
    const tokens = await prisma.token.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    if (exportType === 'env') {
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
    
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Get tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = withRateLimit(request, 'tokenCreation');
  if (rateLimitResponse) return rateLimitResponse;
  
  const limiter = createRateLimiter('tokenCreation');
  const rateResult = limiter(request);
  
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const body = await request.json();
    const { service, token, description, category, status } = body;
    
    if (!service || !token) {
      return NextResponse.json(
        { error: 'Service and token are required' },
        { status: 400 }
      );
    }
    
    const limitCheck = await checkTokenLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: 'Token limit reached',
        message: `Free tier limited to ${limitCheck.limit} tokens. Upgrade to Pro for unlimited tokens.`,
        current: limitCheck.current,
        limit: limitCheck.limit,
      }, { status: 403 });
    }
    
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
    
    await logActivity(user.id, 'CREATE', service, 'Token created');
    
    const response = NextResponse.json(newToken);
    response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
    return response;
  } catch (error) {
    console.error('Create token error:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const body = await request.json();
    const { id, service, token, description, category, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }
    
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
    
    await logActivity(user.id, 'UPDATE', service || 'Token', 'Token updated');
    
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

export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const apiAccess = await checkApiAccessForUser(user.id);
    if (!apiAccess.allowed && apiAccess.error) {
      return apiAccess.error;
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }
    
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