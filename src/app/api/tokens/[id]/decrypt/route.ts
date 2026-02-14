/**
 * Token Decryption API
 * POST: Decrypt and return a token value (requires authentication)
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { decryptToken } from '@/lib/server-encryption';
import { prisma } from '@/lib/db';
import { withRateLimit, createRateLimiter } from '@/lib/rate-limit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = withRateLimit(request, 'tokenDecryption');
  if (rateLimitResponse) return rateLimitResponse;
  
  const limiter = createRateLimiter('tokenDecryption');
  const rateResult = limiter(request);
  
  try {
    const { id } = await params;
    
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    
    const token = await prisma.token.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    const decryptedToken = await decryptToken(token.token);
    
    await logActivity(user.id, 'REVEAL', token.service, 'Token decrypted for viewing');
    
    const response = NextResponse.json({
      id: token.id,
      service: token.service,
      token: decryptedToken,
      description: token.description,
      category: token.category,
      status: token.status,
    });
    response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
    return response;
  } catch (error) {
    console.error('Decrypt token error:', error);
    return NextResponse.json(
      { error: 'Failed to decrypt token' },
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