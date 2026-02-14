import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export type Plan = 'FREE' | 'PRO' | 'ULTRA';

export interface ApiAccessResult {
  allowed: boolean;
  reason?: string;
  plan?: Plan;
}

export function isCloudMode(): boolean {
  return process.env.CLOUD_MODE === 'true';
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return (user?.plan as Plan) || 'FREE';
}

export async function getUserPlanByEmail(email: string): Promise<Plan> {
  const user = await prisma.users.findUnique({
    where: { email },
    select: { plan: true },
  });
  return (user?.plan as Plan) || 'FREE';
}

export function isApiAccessAllowed(plan: Plan): ApiAccessResult {
  if (!isCloudMode()) {
    return { allowed: true };
  }

  if (plan === 'FREE') {
    return {
      allowed: false,
      reason: 'API access requires a PRO or ULTRA subscription. Please upgrade to access programmatic API endpoints.',
      plan,
    };
  }

  return { allowed: true, plan };
}

export function createPaymentRequiredResponse(reason?: string): NextResponse {
  return NextResponse.json(
    {
      error: 'Payment Required',
      message: reason || 'API access requires a paid subscription. Please upgrade your plan.',
      code: 'PAYMENT_REQUIRED',
      upgradeUrl: '/settings?tab=plan',
    },
    { status: 402 }
  );
}

export const CLOUD_ONLY_API_ROUTES = [
  '/api/tokens',
  '/api/api-keys',
  '/api/stripe/webhook',
  '/api/teams',
];

export const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/health',
  '/api/user',
];

export function isCloudOnlyRoute(pathname: string): boolean {
  return CLOUD_ONLY_API_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

export function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}
