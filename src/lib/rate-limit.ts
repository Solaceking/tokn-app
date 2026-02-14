import { NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

export const rateLimitConfigs = {
  tokenCreation: { limit: 10, windowMs: 60000 },
  tokenDecryption: { limit: 20, windowMs: 60000 },
  aiParsing: { limit: 10, windowMs: 60000 },
} as const;

export type RateLimitType = keyof typeof rateLimitConfigs;

function getClientIP(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export function rateLimit(limit: number, windowMs: number): (request: Request) => RateLimitResult {
  return (request: Request): RateLimitResult => {
    const ip = getClientIP(request);
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const entry = rateLimitMap.get(ip);
    
    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: resetTime,
      };
    }
    
    if (entry.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: entry.resetTime,
      };
    }
    
    entry.count++;
    rateLimitMap.set(ip, entry);
    
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: entry.resetTime,
    };
  };
}

export function createRateLimiter(type: RateLimitType) {
  const config = rateLimitConfigs[type];
  return rateLimit(config.limit, config.windowMs);
}

export function withRateLimit(
  request: Request,
  type: RateLimitType
): NextResponse | null {
  const limiter = createRateLimiter(type);
  const result = limiter(request);
  
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  return null;
}

export function getRateLimitHeaders(result: RateLimitResult): Headers {
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.reset.toString());
  return headers;
}