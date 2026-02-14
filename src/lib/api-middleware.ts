import { NextResponse } from 'next/server';
import { getAuthenticatedUser, USE_LOCAL_AUTH } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  isCloudMode,
  getUserPlan,
  isApiAccessAllowed,
  createPaymentRequiredResponse,
  Plan
} from './api-access';

interface AuthResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  plan?: Plan;
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

  const plan = (user.plan as Plan) || 'FREE';

  return {
    authorized: true,
    userId: user.id,
    email: user.email,
    plan,
  };
}

export async function withApiAccess<T>(
  handler: (auth: { userId: string; email: string; plan: Plan }) => Promise<T>
): Promise<T | NextResponse> {
  const auth = await checkAuthAndApiAccess();

  if (!auth.authorized || !auth.userId || !auth.email || !auth.plan) {
    return auth.error!;
  }

  if (isCloudMode()) {
    const access = isApiAccessAllowed(auth.plan);
    if (!access.allowed) {
      return createPaymentRequiredResponse(access.reason);
    }
  }

  return handler({
    userId: auth.userId,
    email: auth.email,
    plan: auth.plan,
  });
}

export async function checkApiAccessForUser(userId: string): Promise<{ allowed: boolean; error?: NextResponse }> {
  if (!isCloudMode()) {
    return { allowed: true };
  }

  const plan = await getUserPlan(userId);
  const access = isApiAccessAllowed(plan);

  if (!access.allowed) {
    return {
      allowed: false,
      error: createPaymentRequiredResponse(access.reason),
    };
  }

  return { allowed: true };
}