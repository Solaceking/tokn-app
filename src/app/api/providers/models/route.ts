/**
 * Provider Models API
 * POST: Fetch available models for a provider using user's API key
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { decrypt } from '@/lib/server-encryption';
import { AIProviderType, AI_PROVIDER_CONFIGS, STATIC_MODELS } from '@/lib/ai-providers/types';
import { fetchModels } from '@/lib/ai-providers/service';
import { prisma } from '@/lib/db';

// POST /api/providers/models - Fetch models for a provider
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { provider, apiKey: tempApiKey } = body;
    
    // Validate provider type
    if (!provider || !AI_PROVIDER_CONFIGS[provider as AIProviderType]) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }
    
    let apiKey: string;
    
    // Use temp API key if provided (for testing before save)
    // Otherwise, fetch from database
    if (tempApiKey) {
      apiKey = tempApiKey;
    } else {
      const savedProvider = await prisma.userAIProvider.findUnique({
        where: {
          userId_provider: {
            userId: user.id,
            provider: provider as AIProviderType,
          },
        },
      });
      
      if (!savedProvider) {
        // Return static models if no saved provider
        return NextResponse.json({
          provider,
          models: STATIC_MODELS[provider as AIProviderType],
          source: 'static',
        });
      }
      
      apiKey = await decrypt(savedProvider.apiKey);
    }
    
    // Fetch models from provider
    const models = await fetchModels(provider as AIProviderType, apiKey);
    
    return NextResponse.json({
      provider,
      models,
      source: 'api',
    });
  } catch (error) {
    console.error('Fetch models error:', error);
    
    // Return static models on error
    const { provider } = await request.json().catch(() => ({ provider: null }));
    if (provider && AI_PROVIDER_CONFIGS[provider as AIProviderType]) {
      return NextResponse.json({
        provider,
        models: STATIC_MODELS[provider as AIProviderType],
        source: 'static_fallback',
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// GET /api/providers/models - Get static models list for all providers
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Return static models for all providers (useful for initial UI)
    const allModels = Object.entries(STATIC_MODELS).map(([provider, models]) => ({
      provider,
      displayName: AI_PROVIDER_CONFIGS[provider as AIProviderType].displayName,
      models,
    }));
    
    return NextResponse.json(allModels);
  } catch (error) {
    console.error('Get all models error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}