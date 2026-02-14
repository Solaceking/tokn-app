/**
 * AI Token Parser API
 * POST: Parse text for tokens using user's configured AI provider
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { decrypt } from '@/lib/server-encryption';
import { AIProviderType } from '@/lib/ai-providers/types';
import { parseWithAI } from '@/lib/ai-providers/service';
import { prisma } from '@/lib/db';
import { scanForTokens, DetectedToken } from '@/lib/token-parser';
import { withRateLimit, createRateLimiter } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rateLimitResponse = withRateLimit(request, 'aiParsing');
  if (rateLimitResponse) return rateLimitResponse;
  
  const limiter = createRateLimiter('aiParsing');
  const rateResult = limiter(request);
  
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { text, providerType: requestedProvider, useFallback = true } = body;
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    let providerType: AIProviderType | null = null;
    let apiKey: string | null = null;
    let config: string | null = null;
    
    if (requestedProvider) {
      const savedProvider = await prisma.userAIProvider.findUnique({
        where: {
          userId_providerType: {
            userId: user.id,
            providerType: requestedProvider as AIProviderType,
          },
        },
      });
      
      if (savedProvider) {
        providerType = savedProvider.providerType as AIProviderType;
        apiKey = await decrypt(savedProvider.apiKey);
        config = savedProvider.config;
      }
    }
    
    if (!providerType) {
      const defaultProvider = await prisma.userAIProvider.findFirst({
        where: {
          userId: user.id,
        },
      });
      
      if (defaultProvider) {
        providerType = defaultProvider.providerType as AIProviderType;
        apiKey = await decrypt(defaultProvider.apiKey);
        config = defaultProvider.config;
      }
    }
    
    if (!providerType) {
      const anyProvider = await prisma.userAIProvider.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      
      if (anyProvider) {
        providerType = anyProvider.providerType as AIProviderType;
        apiKey = await decrypt(anyProvider.apiKey);
        config = anyProvider.config;
      }
    }
    
    if (!providerType || !apiKey) {
      if (useFallback) {
        const tokens = scanForTokens(text);
        
        
        const response = NextResponse.json({
          tokens,
          providerType: null,
          model: null,
          method: 'regex_fallback',
          message: 'No AI provider configured. Using regex parser.',
        });
        response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
        return response;
      }
      
      return NextResponse.json(
        { error: 'No AI provider configured. Please add one in settings.' },
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    const result = await parseWithAI(providerType, apiKey, config || "default", text);
    const duration = Date.now() - startTime;
    
    if (result.error) {
      if (useFallback) {
        const tokens = scanForTokens(text);
        
        
        const response = NextResponse.json({
          tokens,
          providerType,
          model: config,
          method: 'regex_fallback',
          error: result.error,
          duration,
        });
        response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
        return response;
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    
    const tokens: DetectedToken[] = result.tokens.map((t, index) => ({
      id: `ai-${Date.now()}-${index}`,
      name: t.service,
      value: t.token,
      confidence: t.confidence,
      category: t.category,
      description: t.description || `${t.service} API Key`,
    }));
    
    const response = NextResponse.json({
      tokens,
      providerType,
      model: config,
      method: 'ai',
      duration,
      rawResponse: process.env.NODE_ENV === 'development' ? result.rawResponse : undefined,
    });
    response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
    return response;
  } catch (error) {
    console.error('AI parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse text' },
      { status: 500 }
    );
  }
}

