import { NextResponse } from 'next/server';

// AI-powered token parser using pattern matching + heuristics
// This is a robust solution that combines regex patterns with AI-like heuristics

interface ParsedToken {
  id: string;
  name: string;
  value: string;
  category: string;
  confidence: number;
  description: string;
}

// Comprehensive token patterns
const TOKEN_PATTERNS = [
  // AI/ML
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, name: 'OpenAI', category: 'AI/ML', description: 'OpenAI API Key' },
  { pattern: /sk-proj-[a-zA-Z0-9_-]{20,}/g, name: 'OpenAI Project', category: 'AI/ML', description: 'OpenAI Project API Key' },
  { pattern: /sk-ant-[a-zA-Z0-9_-]{20,}/g, name: 'Anthropic', category: 'AI/ML', description: 'Anthropic API Key' },
  { pattern: /hf_[a-zA-Z0-9]{20,}/g, name: 'Hugging Face', category: 'AI/ML', description: 'Hugging Face Token' },
  { pattern: /r8_[a-zA-Z0-9]{20,}/g, name: 'Replicate', category: 'AI/ML', description: 'Replicate API Token' },
  
  // Version Control
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub PAT', category: 'Version Control', description: 'GitHub Personal Access Token' },
  { pattern: /gho_[a-zA-Z0-9]{36}/g, name: 'GitHub OAuth', category: 'Version Control', description: 'GitHub OAuth Token' },
  { pattern: /ghu_[a-zA-Z0-9]{36}/g, name: 'GitHub App', category: 'Version Control', description: 'GitHub App User Token' },
  { pattern: /ghr_[a-zA-Z0-9]{36}/g, name: 'GitHub Refresh', category: 'Version Control', description: 'GitHub Refresh Token' },
  
  // Payments
  { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Live', category: 'Payments', description: 'Stripe Live Secret Key' },
  { pattern: /sk_test_[a-zA-Z0-9]{24,}/g, name: 'Stripe Test', category: 'Payments', description: 'Stripe Test Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Public', category: 'Payments', description: 'Stripe Live Public Key' },
  { pattern: /pk_test_[a-zA-Z0-9]{24,}/g, name: 'Stripe Test Public', category: 'Payments', description: 'Stripe Test Public Key' },
  
  // Cloud Providers
  { pattern: /AKIA[A-Z0-9]{16}/g, name: 'AWS Access Key', category: 'Cloud', description: 'AWS Access Key ID' },
  { pattern: /AIza[a-zA-Z0-9_-]{35}/g, name: 'Google API', category: 'Cloud', description: 'Google API Key' },
  { pattern: /ya29\.[a-zA-Z0-9_-]+/g, name: 'Google OAuth', category: 'Cloud', description: 'Google OAuth Token' },
  
  // Communication
  { pattern: /xoxb-[a-zA-Z0-9-]+/g, name: 'Slack Bot', category: 'Communication', description: 'Slack Bot Token' },
  { pattern: /xoxa-[a-zA-Z0-9-]+/g, name: 'Slack App', category: 'Communication', description: 'Slack App Token' },
  { pattern: /xoxp-[a-zA-Z0-9-]+/g, name: 'Slack User', category: 'Communication', description: 'Slack User Token' },
  
  // Productivity
  { pattern: /secret_[a-zA-Z0-9]{40,}/g, name: 'Notion', category: 'Productivity', description: 'Notion Integration Token' },
  { pattern: /sk-[a-zA-Z0-9]{32,}/g, name: 'Linear', category: 'Productivity', description: 'Linear API Key' },
  
  // Database
  { pattern: /postgres(ql)?:\/\/[^\s]+/g, name: 'PostgreSQL', category: 'Database', description: 'PostgreSQL Connection String' },
  { pattern: /mysql:\/\/[^\s]+/g, name: 'MySQL', category: 'Database', description: 'MySQL Connection String' },
  { pattern: /mongodb(\+srv)?:\/\/[^\s]+/g, name: 'MongoDB', category: 'Database', description: 'MongoDB Connection String' },
  { pattern: /redis:\/\/[^\s]+/g, name: 'Redis', category: 'Database', description: 'Redis Connection String' },
  
  // Deployment
  { pattern: /vercel_[a-zA-Z0-9]{20,}/g, name: 'Vercel', category: 'Deployment', description: 'Vercel Token' },
  { pattern: /netlify_[a-zA-Z0-9]{20,}/g, name: 'Netlify', category: 'Deployment', description: 'Netlify Token' },
  { pattern: /sk_live_[a-zA-Z0-9]{20,}/g, name: 'Railway', category: 'Deployment', description: 'Railway Token' },
  
  // Crypto
  { pattern: /sk_live_[a-zA-Z0-9]{20,}/g, name: 'Coinbase', category: 'Crypto', description: 'Coinbase API Key' },
  
  // Generic patterns for unknown tokens
  { pattern: /[a-zA-Z]{2,}_[a-zA-Z0-9]{20,}/g, name: 'Unknown', category: 'Other', description: 'Generic API Token' },
];

function detectTokenType(value: string): { name: string; category: string; description: string; confidence: number } {
  // Check patterns first
  for (const tokenPattern of TOKEN_PATTERNS) {
    if (tokenPattern.pattern.test(value)) {
      return {
        name: tokenPattern.name,
        category: tokenPattern.category,
        description: tokenPattern.description,
        confidence: 0.95,
      };
    }
  }
  
  // AI-like heuristic analysis for unknown tokens
  const heuristics: { name: string; category: string; test: (v: string) => boolean; weight: number }[] = [
    { name: 'Generic API Key', category: 'API', test: (v) => v.length > 20 && /^[a-zA-Z0-9_-]+$/.test(v), weight: 0.7 },
    { name: 'Bearer Token', category: 'API', test: (v) => v.startsWith('Bearer '), weight: 0.9 },
    { name: 'Base64 Token', category: 'API', test: (v) => /^[A-Za-z0-9+/=]{20,}$/.test(v), weight: 0.6 },
    { name: 'JWT', category: 'Auth', test: (v) => v.split('.').length === 3, weight: 0.95 },
    { name: 'Hex Token', category: 'API', test: (v) => /^[a-fA-F0-9]{32,}$/.test(v), weight: 0.7 },
    { name: 'UUID', category: 'Other', test: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v), weight: 0.5 },
  ];
  
  for (const heuristic of heuristics) {
    if (heuristic.test(value)) {
      return {
        name: heuristic.name,
        category: heuristic.category,
        description: `Detected as ${heuristic.name}`,
        confidence: heuristic.weight,
      };
    }
  }
  
  return {
    name: 'Unknown',
    category: 'Other',
    description: 'Unrecognized token format',
    confidence: 0.3,
  };
}

function generateId(): string {
  return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const detectedTokens: ParsedToken[] = [];
    const foundValues = new Set<string>();

    // First pass: detect using patterns
    for (const tokenPattern of TOKEN_PATTERNS) {
      const regex = new RegExp(tokenPattern.pattern.source, 'g');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const value = match[0];
        
        // Skip duplicates
        if (foundValues.has(value)) continue;
        foundValues.add(value);
        
        const result = detectTokenType(value);
        
        detectedTokens.push({
          id: generateId(),
          name: tokenPattern.name,
          value,
          category: tokenPattern.category,
          description: tokenPattern.description,
          confidence: result.confidence,
        });
      }
    }

    // Second pass: heuristic analysis for any remaining potential tokens
    // Look for things that look like tokens but weren't caught by patterns
    const potentialTokenPatterns = [
      /[a-zA-Z]{2,}_[a-zA-Z0-9]{15,}/g,           // prefix_something...
      /[a-zA-Z0-9]{32,}/g,                          // Long alphanumeric strings
      /[a-zA-Z]{3,}-[a-zA-Z0-9]{20,}/g,            // service-xxx...
    ];
    
    for (const pattern of potentialTokenPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const value = match[0];
        
        if (foundValues.has(value)) continue;
        
        // Check if it looks like a real token (not random text)
        const uniqueChars = new Set(value).size;
        if (uniqueChars < 10) continue; // Too repetitive, likely not a token
        
        foundValues.add(value);
        const result = detectTokenType(value);
        
        detectedTokens.push({
          id: generateId(),
          name: result.name,
          value,
          category: result.category,
          description: result.description,
          confidence: result.confidence * 0.8, // Lower confidence for heuristic matches
        });
      }
    }

    // Sort by confidence (highest first)
    detectedTokens.sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      tokens: detectedTokens,
      count: detectedTokens.length,
    });
  } catch (error) {
    console.error('AI Parse error:', error);
    return NextResponse.json({ error: 'Failed to parse tokens' }, { status: 500 });
  }
}
