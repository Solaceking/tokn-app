import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

interface AuthResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  error?: NextResponse;
}

export async function checkAuthAndApiAccess(): Promise<AuthResult> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      authorized: false,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    authorized: true,
    userId: user.id,
    email: user.email,
  };
}

export async function withApiAccess<T>(
  handler: (auth: { userId: string; email: string }) => Promise<T>
): Promise<T | NextResponse> {
  const auth = await checkAuthAndApiAccess();

  if (!auth.authorized || !auth.userId || !auth.email) {
    return auth.error!;
  }

  return handler({
    userId: auth.userId,
    email: auth.email,
  });
}
