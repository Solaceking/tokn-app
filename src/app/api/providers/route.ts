/**
 * AI Provider Management API
 * GET: List user's configured providers
 * POST: Add/update a provider configuration
 * DELETE: Remove a provider configuration
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { encrypt, decrypt } from '@/lib/server-encryption';
import { AIProviderType, AI_PROVIDER_CONFIGS, STATIC_MODELS } from '@/lib/ai-providers/types';
import { fetchModels, testApiKey } from '@/lib/ai-providers/service';
import { prisma } from '@/lib/db';

// GET /api/providers - List user's AI provider configurations
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const providers = await prisma.userAIProvider.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // Decrypt API keys and map to safe format
    const configs = await Promise.all(
      providers.map(async (p) => {
        const decryptedKey = await decrypt(p.apiKey);
        return {
          id: p.id,
          provider: p.provider,
          displayName: AI_PROVIDER_CONFIGS[p.provider as AIProviderType].displayName,
          selectedModel: p.selectedModel,
          isDefault: p.isDefault,
          apiKeyMasked: maskKey(decryptedKey),
        };
      })
    );
    
    return NextResponse.json(configs);
  } catch (error) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// POST /api/providers - Add or update a provider
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { provider, apiKey, selectedModel, isDefault = false } = body;
    
    // Validate provider type
    if (!provider || !AI_PROVIDER_CONFIGS[provider as AIProviderType]) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }
    
    // Validate API key
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }
    
    // Test the API key
    const testResult = await testApiKey(provider as AIProviderType, apiKey);
    if (!testResult.valid) {
      return NextResponse.json(
        { error: `Invalid API key: ${testResult.error}` },
        { status: 400 }
      );
    }
    
    // Encrypt the API key
    const encryptedKey = await encrypt(apiKey);
    
    // Use default model if not specified
    const model = selectedModel || AI_PROVIDER_CONFIGS[provider as AIProviderType].defaultModel;
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.userAIProvider.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }
    
    // Upsert the provider config
    const savedProvider = await prisma.userAIProvider.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: provider as AIProviderType,
        },
      },
      update: {
        apiKey: encryptedKey,
        selectedModel: model,
        isDefault,
      },
      create: {
        userId: user.id,
        provider: provider as AIProviderType,
        apiKey: encryptedKey,
        selectedModel: model,
        isDefault,
      },
    });
    
    return NextResponse.json({
      id: savedProvider.id,
      provider: savedProvider.provider,
      displayName: AI_PROVIDER_CONFIGS[provider as AIProviderType].displayName,
      selectedModel: savedProvider.selectedModel,
      isDefault: savedProvider.isDefault,
      apiKeyMasked: maskKey(apiKey),
    });
  } catch (error) {
    console.error('Save provider error:', error);
    return NextResponse.json(
      { error: 'Failed to save provider' },
      { status: 500 }
    );
  }
}

// DELETE /api/providers - Remove a provider configuration
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.userAIProvider.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete provider error:', error);
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    );
  }
}

// Helper to mask API key for display
function maskKey(key: string): string {
  if (key.length <= 12) return '••••••••';
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}