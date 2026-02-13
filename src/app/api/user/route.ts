import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

// Helper to get authenticated user from Supabase
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// GET current user data
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user from our database (using email as identifier)
    const dbUser = await db.users.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        created_at: true,
      },
    });
    
    if (!dbUser) {
      // If user doesn't exist in our DB, create them
      const newUser = await db.users.create({
        data: {
          email: user.email,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || null,
        },
        select: {
          id: true,
          email: true,
          full_name: true,
          avatar_url: true,
          created_at: true,
        },
      });
      
      return NextResponse.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        createdAt: newUser.created_at,
      });
    }
    
    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.full_name,
      avatar_url: dbUser.avatar_url,
      createdAt: dbUser.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH update user profile
export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, avatar_url } = body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.full_name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    
    const updatedUser = await db.users.update({
      where: { email: user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        created_at: true,
      },
    });
    
    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.full_name,
      avatar_url: updatedUser.avatar_url,
      createdAt: updatedUser.created_at,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE delete user account
export async function DELETE() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete all user data (cascade will handle tokens and activities)
    await db.users.delete({
      where: { email: user.email },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
