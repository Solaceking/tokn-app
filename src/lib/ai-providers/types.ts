/**
 * AI Provider Types and Interfaces
 */

export type AIProviderType = 'openai' | 'deepseek' | 'google' | 'openrouter' | 'zai';

export interface AIProviderConfig {
  type: AIProviderType;
  name: string;
  displayName: string;
  baseUrl: string;
  modelsEndpoint?: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  defaultModel: string;
  supportsStreaming: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  contextWindow?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface ParsedToken {
  service: string;
  token: string;
  category: string;
  confidence: number;
  description?: string;
}

export interface ParseResult {
  tokens: ParsedToken[];
  rawResponse?: string;
  error?: string;
}

export interface AIRequestPayload {
  model: string;
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: {
    type: 'json_object' | 'json_schema';
    schema?: Record<string, unknown>;
  };
}

// Provider configurations
export const AI_PROVIDER_CONFIGS: Record<AIProviderType, AIProviderConfig> = {
  openai: {
    type: 'openai',
    name: 'openai',
    displayName: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelsEndpoint: '/models',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer',
    defaultModel: 'gpt-4o-mini',
    supportsStreaming: true,
  },
  deepseek: {
    type: 'deepseek',
    name: 'deepseek',
    displayName: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    modelsEndpoint: '/models',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer',
    defaultModel: 'deepseek-chat',
    supportsStreaming: true,
  },
  google: {
    type: 'google',
    name: 'google',
    displayName: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyHeader: 'x-goog-api-key',
    apiKeyPrefix: '',
    defaultModel: 'gemini-2.0-flash',
    supportsStreaming: true,
  },
  openrouter: {
    type: 'openrouter',
    name: 'openrouter',
    displayName: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    modelsEndpoint: '/models',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer',
    defaultModel: 'google/gemini-2.0-flash-001:free',
    supportsStreaming: true,
  },
  zai: {
    type: 'zai',
    name: 'zai',
    displayName: 'Z.ai',
    baseUrl: 'https://api.z-ai.io/v1',
    apiKeyHeader: 'Authorization',
    apiKeyPrefix: 'Bearer',
    defaultModel: 'zai-default',
    supportsStreaming: false,
  },
};

// Static model lists for providers that don't have a models endpoint
export const STATIC_MODELS: Record<AIProviderType, AIModel[]> = {
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast, affordable, and capable', contextWindow: 128000, pricing: { input: 0.15, output: 0.6 } },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model', contextWindow: 128000, pricing: { input: 2.5, output: 10 } },
    { id: 'o3-mini', name: 'o3-mini', description: 'Fast reasoning model', contextWindow: 200000, pricing: { input: 1.1, output: 4.4 } },
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek V3', description: 'General purpose', contextWindow: 64000, pricing: { input: 0.5, output: 2 } },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', description: 'Optimized for code', contextWindow: 64000, pricing: { input: 0.5, output: 2 } },
    { id: 'deepseek-reasoner', name: 'DeepSeek R1', description: 'Reasoning model', contextWindow: 64000, pricing: { input: 0.5, output: 2 } },
  ],
  google: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Fast multimodal model', contextWindow: 1000000, pricing: { input: 0.1, output: 0.4 } },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: 'Cost-efficient', contextWindow: 1000000, pricing: { input: 0.075, output: 0.3 } },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Complex tasks', contextWindow: 2000000, pricing: { input: 1.25, output: 5 } },
  ],
  openrouter: [
    { id: 'google/gemini-2.0-flash-001:free', name: 'Gemini 2.0 Flash (Free)', description: 'Free tier via OpenRouter', contextWindow: 1000000, pricing: { input: 0, output: 0 } },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', description: 'Via OpenRouter', contextWindow: 64000, pricing: { input: 0.5, output: 2 } },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Via OpenRouter', contextWindow: 128000, pricing: { input: 0.15, output: 0.6 } },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Via OpenRouter', contextWindow: 200000, pricing: { input: 3, output: 15 } },
  ],
  zai: [
    { id: 'zai-default', name: 'Z.ai Default', description: 'Default model' },
    { id: 'zai-pro', name: 'Z.ai Pro', description: 'Pro model' },
  ],
};