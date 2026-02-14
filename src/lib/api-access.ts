// API Access - Simplified
// All users have full API access when they bring their own AI keys

export type Plan = 'FREE';

export interface ApiAccessResult {
  allowed: boolean;
  reason?: string;
}

export async function getUserPlan(_userId: string): Promise<Plan> {
  return 'FREE';
}

export async function getUserPlanByEmail(_email: string): Promise<Plan> {
  return 'FREE';
}

export function isApiAccessAllowed(): ApiAccessResult {
  // Everyone has full access - bring your own AI key
  return { allowed: true };
}
