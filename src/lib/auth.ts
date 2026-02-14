import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { db } from './db';
import bcrypt from 'bcryptjs';

export const USE_LOCAL_AUTH = process.env.USE_LOCAL_AUTH === 'true';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {}
        },
      },
    }
  );
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  if (USE_LOCAL_AUTH) {
    return getLocalAuthUser();
  }
  return getSupabaseAuthUser();
}

async function getSupabaseAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    let dbUser = await db.users.findUnique({
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
      dbUser = await db.users.create({
        data: {
          email: user.email!,
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
    }
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.full_name,
      avatar_url: dbUser.avatar_url,
    };
  } catch (error) {
    console.error('Supabase auth error:', error);
    return null;
  }
}

async function getLocalAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return null;
    }
    
    const dbUser = await db.users.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
      },
    });
    
    if (!dbUser) {
      return null;
    }
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.full_name,
      avatar_url: dbUser.avatar_url,
    };
  } catch (error) {
    console.error('Local auth error:', error);
    return null;
  }
}

export async function verifyPassword(email: string, password: string): Promise<AuthUser | null> {
  const user = await db.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      full_name: true,
      avatar_url: true,
      password: true,
    },
  });
  
  if (!user || !user.password) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.full_name,
    avatar_url: user.avatar_url,
  };
}

export async function createUser(email: string, password: string, name?: string): Promise<AuthUser> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await db.users.create({
    data: {
      email,
      username: email.split('@')[0],
      full_name: name || null,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      full_name: true,
      avatar_url: true,
    },
  });
  
  return {
    id: user.id,
    email: user.email,
    name: user.full_name,
    avatar_url: user.avatar_url,
  };
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    await db.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return true;
  } catch {
    return false;
  }
}

export function isAuthConfigured(): boolean {
  if (USE_LOCAL_AUTH) {
    return true;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseKey !== 'your-anon-key'
  );
}

export function getAuthMode(): 'local' | 'supabase' {
  return USE_LOCAL_AUTH ? 'local' : 'supabase';
}