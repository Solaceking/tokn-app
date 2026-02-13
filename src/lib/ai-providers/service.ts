/**
 * AI Provider Service
 * Handles fetching models and making requests to different AI providers
 */

import { 
  AIProviderType, 
  AIProviderConfig, 
  AIModel, 
  ParseResult, 
  ParsedToken,
  AI_PROVIDER_CONFIGS,
  STATIC_MODELS 
} from './types';

/**
 * Fetch available models for a provider
 * Returns static list or fetches from API if available
 */
export async function fetchModels(
  provider: AIProviderType,
  apiKey: string
): Promise<AIModel[]> {
  const config = AI_PROVIDER_CONFIGS[provider];
  
  // Return static models if no endpoint available
  if (!config.modelsEndpoint) {
    return STATIC_MODELS[provider];
  }
  
  try {
    const headers: Record<string, string> = {};
    
    if (config.apiKeyPrefix) {
      headers[config.apiKeyHeader] = `${config.apiKeyPrefix} ${apiKey}`;
    } else {
      headers[config.apiKeyHeader] = apiKey;
    }
    
    const response = await fetch(`${config.baseUrl}${config.modelsEndpoint}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse different response formats
    return parseModelsResponse(provider, data);
  } catch (error) {
    console.warn(`Failed to fetch models from ${provider}, using static list:`, error);
    return STATIC_MODELS[provider];
  }
}

/**
 * Parse models response based on provider format
 */
function parseModelsResponse(provider: AIProviderType, data: unknown): AIModel[] {
  switch (provider) {
    case 'openai':
    case 'deepseek':
    case 'openrouter': {
      // OpenAI-compatible format: { data: [{ id, object, created, owned_by }] }
      const openaiData = data as { data?: Array<{ id: string; object?: string }> };
      if (openaiData.data) {
        return openaiData.data
          .filter((m: { id: string; object?: string }) => m.object === 'model' || !m.object)
          .map((m: { id: string }) => ({
            id: m.id,
            name: formatModelName(m.id),
          }));
      }
      return STATIC_MODELS[provider];
    }
    
    case 'google': {
      // Gemini format: { models: [{ name, displayName, description }] }
      const geminiData = data as { models?: Array<{ name: string; displayName?: string; description?: string }> };
      if (geminiData.models) {
        return geminiData.models.map((m) => ({
          id: m.name.replace('models/', ''),
          name: m.displayName || formatModelName(m.name),
          description: m.description,
        }));
      }
      return STATIC_MODELS[provider];
    }
    
    default:
      return STATIC_MODELS[provider];
  }
}

/**
 * Format model ID to readable name
 */
function formatModelName(id: string): string {
  return id
    .split('/').pop() || id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Test if an API key is valid for a provider
 */
export async function testApiKey(
  provider: AIProviderType,
  apiKey: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const config = AI_PROVIDER_CONFIGS[provider];
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (config.apiKeyPrefix) {
      headers[config.apiKeyHeader] = `${config.apiKeyPrefix} ${apiKey}`;
    } else {
      headers[config.apiKeyHeader] = apiKey;
    }
    
    // Make a simple request to test the key
    let testUrl: string;
    let testBody: unknown;
    
    if (provider === 'google') {
      testUrl = `${config.baseUrl}/models?key=${apiKey}`;
      testBody = undefined;
    } else {
      testUrl = `${config.baseUrl}/chat/completions`;
      testBody = {
        model: config.defaultModel,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1,
      };
    }
    
    const response = await fetch(testUrl, {
      method: provider === 'google' ? 'GET' : 'POST',
      headers,
      body: testBody ? JSON.stringify(testBody) : undefined,
    });
    
    if (response.ok) {
      return { valid: true };
    }
    
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || errorData.message || response.statusText;
    
    return { valid: false, error: errorMessage };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Parse text for tokens using AI
 */
export async function parseWithAI(
  provider: AIProviderType,
  apiKey: string,
  model: string,
  text: string
): Promise<ParseResult> {
  const config = AI_PROVIDER_CONFIGS[provider];
  
  const prompt = buildParsingPrompt(text);
  
  try {
    let response: Response;
    let responseData: unknown;
    
    if (provider === 'google') {
      // Gemini-specific format
      response = await fetch(
        `${config.baseUrl}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: prompt }],
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2000,
              responseMimeType: 'application/json',
            },
          }),
        }
      );
      
      responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = (responseData as { error?: { message?: string } })?.error?.message || response.statusText;
        throw new Error(errorMsg);
      }
      
      // Parse Gemini response
      const geminiResponse = responseData as { 
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> 
      };
      const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }
      
      return parseAIResponse(content);
    } else {
      // OpenAI-compatible format
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (config.apiKeyPrefix) {
        headers[config.apiKeyHeader] = `${config.apiKeyPrefix} ${apiKey}`;
      } else {
        headers[config.apiKeyHeader] = apiKey;
      }
      
      // Add OpenRouter-specific headers
      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://tokn.app';
        headers['X-Title'] = 'TOKN';
      }
      
      response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: getSystemPrompt() },
            { role: 'user', content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        }),
      });
      
      responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = (responseData as { error?: { message?: string } })?.error?.message || response.statusText;
        throw new Error(errorMsg);
      }
      
      // Parse OpenAI-compatible response
      const openaiResponse = responseData as { 
        choices?: Array<{ message?: { content?: string } }> 
      };
      const content = openaiResponse.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from AI');
      }
      
      return parseAIResponse(content);
    }
  } catch (error) {
    return {
      tokens: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get system prompt for token extraction
 */
function getSystemPrompt(): string {
  return `You are a precise API token extraction assistant. Your task is to analyze text and extract API keys, tokens, and credentials.

Rules:
1. Extract ALL tokens you find in the text
2. Identify the service (e.g., OpenAI, GitHub, AWS, Stripe)
3. Categorize: AI/ML, Version Control, Cloud, Payments, Database, Communication, Other
4. Assign confidence: 0.0-1.0 based on token format validity
5. Return ONLY valid JSON

Categories:
- AI/ML: OpenAI, Anthropic, Google AI, Hugging Face, Replicate
- Version Control: GitHub, GitLab, Bitbucket
- Cloud: AWS, GCP, Azure, Vercel, Netlify
- Payments: Stripe, PayPal, Square
- Database: MongoDB, PostgreSQL, Redis, Supabase
- Communication: Slack, Discord, Twilio
- Other: Any other service

Common token patterns:
- OpenAI: sk-... or sk-proj-...
- GitHub: ghp_..., gho_..., github_pat_...
- AWS: AKIA... (access key)
- Stripe: sk_live_..., sk_test_...
- Anthropic: sk-ant-...
- Slack: xoxb-..., xoxa-...
- Generic: Any key=token or "token": "..." patterns`;
}

/**
 * Build parsing prompt with user text
 */
function buildParsingPrompt(text: string): string {
  return `Extract all API tokens/keys from this text:

"""
${text}
"""

Return JSON in this exact format:
{
  "tokens": [
    {
      "service": "Service Name",
      "token": "the-full-token-value",
      "category": "Category",
      "confidence": 0.95,
      "description": "Brief description"
    }
  ],
  "unstructured_count": 0
}

If no tokens found, return empty tokens array.`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(content: string): ParseResult {
  try {
    // Clean up the response (remove markdown code blocks if present)
    const cleaned = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(cleaned) as { 
      tokens?: unknown[]; 
      unstructured_count?: number;
    };
    
    if (!parsed.tokens || !Array.isArray(parsed.tokens)) {
      return { tokens: [], rawResponse: content };
    }
    
    // Validate and normalize tokens
    const tokens: ParsedToken[] = parsed.tokens
      .filter((t): t is Record<string, unknown> => typeof t === 'object' && t !== null)
      .map((t) => ({
        service: String(t.service || 'Unknown'),
        token: String(t.token || ''),
        category: String(t.category || 'Other'),
        confidence: Number(t.confidence) || 0.5,
        description: t.description ? String(t.description) : undefined,
      }))
      .filter((t) => t.token && t.token.length > 0);
    
    return { tokens, rawResponse: content };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      tokens: [],
      rawResponse: content,
      error: 'Failed to parse AI response',
    };
  }
}