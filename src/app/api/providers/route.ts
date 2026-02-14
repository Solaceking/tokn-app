/**
 * AI Provider Management API
 * GET: List user's configured providers
 * POST: Add/update a provider configuration
 * DELETE: Remove a provider configuration
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/server-encryption';
import { AIProviderType, AI_PROVIDER_CONFIGS } from '@/lib/ai-providers/types';
import { testApiKey } from '@/lib/ai-providers/service';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const providers = await prisma.userAIProvider.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    const configs = await Promise.all(
      providers.map(async (p) => {
        const decryptedKey = await decrypt(p.apiKey);
        return {
          id: p.id,
          providerType: p.providerType,
          displayName: AI_PROVIDER_CONFIGS[p.providerType as AIProviderType].displayName,
          selectedModel: p.config,
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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { provider, apiKey, selectedModel, testOnly } = body;
    
    if (!provider || !AI_PROVIDER_CONFIGS[provider as AIProviderType]) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }
    
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }
    
    const testResult = await testApiKey(provider as AIProviderType, apiKey);
    if (!testResult.valid) {
      return NextResponse.json(
        { error: `Invalid API key: ${testResult.error}` },
        { status: 400 }
      );
    }
    
    const encryptedKey = await encrypt(apiKey);
    
    const model = selectedModel || AI_PROVIDER_CONFIGS[provider as AIProviderType].defaultModel;
    
    const existingProvider = await prisma.userAIProvider.findUnique({
      where: {
        userId_providerType: {
          userId: user.id,
          providerType: provider as AIProviderType,
        },
      },
    });
    
    let savedProvider;
    if (existingProvider) {
      savedProvider = await prisma.userAIProvider.update({
        where: { id: existingProvider.id },
        data: {
          apiKey: encryptedKey,
          config: model,
        },
      });
    } else {
      savedProvider = await prisma.userAIProvider.create({
        data: {
          userId: user.id,
          providerType: provider as AIProviderType,
          apiKey: encryptedKey,
          config: model,
        },
      });
    }
    
    return NextResponse.json({
      id: savedProvider.id,
      providerType: savedProvider.providerType,
      displayName: AI_PROVIDER_CONFIGS[provider as AIProviderType].displayName,
      selectedModel: savedProvider.config,
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

export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    
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

function maskKey(key: string): string {
  if (key.length <= 12) return '••••••••';
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}