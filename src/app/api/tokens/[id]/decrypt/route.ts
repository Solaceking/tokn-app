/**
 * Token Decryption API
 * POST: Decrypt and return a token value (requires authentication)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { decryptToken } from '@/lib/server-encryption';
import { prisma } from '@/lib/db';

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

// POST /api/tokens/[id]/decrypt - Decrypt a token
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get database user
    const dbUser = await getDbUser(user);
    
    // Get the token
    const token = await prisma.token.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Decrypt the token
    const decryptedToken = await decryptToken(token.token);
    
    // Log the reveal activity
    await logActivity(dbUser.id, 'REVEAL', token.service, 'Token decrypted for viewing');
    
    return NextResponse.json({
      id: token.id,
      service: token.service,
      token: decryptedToken,
      description: token.description,
      category: token.category,
      status: token.status,
    });
  } catch (error) {
    console.error('Decrypt token error:', error);
    return NextResponse.json(
      { error: 'Failed to decrypt token' },
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