// Token pattern definitions for detection
export interface TokenPattern {
  name: string;
  pattern: RegExp;
  prefix: string;
  category: string;
  description: string;
}

export interface DetectedToken {
  id: string;
  name: string;
  value: string;
  confidence: number;
  category: string;
  description: string;
}

export const TOKEN_PATTERNS: TokenPattern[] = [
  {
    name: 'OpenAI',
    pattern: /sk-[a-zA-Z0-9]{20,}/g,
    prefix: 'sk-',
    category: 'AI/ML',
    description: 'OpenAI API Key',
  },
  {
    name: 'OpenAI Project',
    pattern: /sk-proj-[a-zA-Z0-9]{20,}/g,
    prefix: 'sk-proj-',
    category: 'AI/ML',
    description: 'OpenAI Project API Key',
  },
  {
    name: 'Anthropic',
    pattern: /sk-ant-[a-zA-Z0-9]{20,}/g,
    prefix: 'sk-ant-',
    category: 'AI/ML',
    description: 'Anthropic API Key',
  },
  {
    name: 'GitHub PAT',
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    prefix: 'ghp_',
    category: 'Version Control',
    description: 'GitHub Personal Access Token',
  },
  {
    name: 'GitHub OAuth',
    pattern: /gho_[a-zA-Z0-9]{36}/g,
    prefix: 'gho_',
    category: 'Version Control',
    description: 'GitHub OAuth Token',
  },
  {
    name: 'GitHub App',
    pattern: /ghu_[a-zA-Z0-9]{36}/g,
    prefix: 'ghu_',
    category: 'Version Control',
    description: 'GitHub App User Token',
  },
  {
    name: 'Stripe Live',
    pattern: /sk_live_[a-zA-Z0-9]{24,}/g,
    prefix: 'sk_live_',
    category: 'Payments',
    description: 'Stripe Live Secret Key',
  },
  {
    name: 'Stripe Test',
    pattern: /sk_test_[a-zA-Z0-9]{24,}/g,
    prefix: 'sk_test_',
    category: 'Payments',
    description: 'Stripe Test Secret Key',
  },
  {
    name: 'Notion',
    pattern: /secret_[a-zA-Z0-9]{40,}/g,
    prefix: 'secret_',
    category: 'Productivity',
    description: 'Notion Integration Token',
  },
  {
    name: 'AWS Access Key',
    pattern: /AKIA[A-Z0-9]{16}/g,
    prefix: 'AKIA',
    category: 'Cloud',
    description: 'AWS Access Key ID',
  },
  {
    name: 'Slack Bot',
    pattern: /xoxb-[a-zA-Z0-9-]+/g,
    prefix: 'xoxb-',
    category: 'Communication',
    description: 'Slack Bot Token',
  },
  {
    name: 'Slack App',
    pattern: /xoxa-[a-zA-Z0-9-]+/g,
    prefix: 'xoxa-',
    category: 'Communication',
    description: 'Slack App Token',
  },
  {
    name: 'Google API',
    pattern: /AIza[a-zA-Z0-9_-]{35}/g,
    prefix: 'AIza',
    category: 'Cloud',
    description: 'Google API Key',
  },
  {
    name: 'Vercel',
    pattern: /vercel_[a-zA-Z0-9]+/g,
    prefix: 'vercel_',
    category: 'Deployment',
    description: 'Vercel Token',
  },
  {
    name: 'Netlify',
    pattern: /netlify_[a-zA-Z0-9]+/g,
    prefix: 'netlify_',
    category: 'Deployment',
    description: 'Netlify Token',
  },
  {
    name: 'Hugging Face',
    pattern: /hf_[a-zA-Z0-9]+/g,
    prefix: 'hf_',
    category: 'AI/ML',
    description: 'Hugging Face Token',
  },
  {
    name: 'Replicate',
    pattern: /r8_[a-zA-Z0-9]+/g,
    prefix: 'r8_',
    category: 'AI/ML',
    description: 'Replicate API Token',
  },
  {
    name: 'PostgreSQL',
    pattern: /postgres:\/\/[a-zA-Z0-9_]+:[^@]+@[a-zA-Z0-9.-]+:\d+\/[a-zA-Z0-9_]+/g,
    prefix: 'postgres://',
    category: 'Database',
    description: 'PostgreSQL Connection String',
  },
  {
    name: 'MongoDB',
    pattern: /mongodb(\+srv)?:\/\/[a-zA-Z0-9_]+:[^@]+@[a-zA-Z0-9.-]+\/[a-zA-Z0-9_]+/g,
    prefix: 'mongodb',
    category: 'Database',
    description: 'MongoDB Connection String',
  },
  {
    name: 'Redis',
    pattern: /redis:\/\/[a-zA-Z0-9_]+:[^@]+@[a-zA-Z0-9.-]+:\d+/g,
    prefix: 'redis://',
    category: 'Database',
    description: 'Redis Connection String',
  },
];

/**
 * Scan text for potential tokens
 */
export function scanForTokens(text: string): DetectedToken[] {
  const detected: DetectedToken[] = [];
  const foundTokens = new Set<string>();

  for (const patternDef of TOKEN_PATTERNS) {
    const matches = text.matchAll(patternDef.pattern);
    
    for (const match of matches) {
      const token = match[0];
      
      // Prevent duplicates
      if (foundTokens.has(token)) continue;
      foundTokens.add(token);
      
      // Calculate confidence based on token characteristics
      const confidence = calculateConfidence(token, patternDef);
      
      detected.push({
        id: `detected-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: patternDef.name,
        value: token,
        confidence,
        category: patternDef.category,
        description: patternDef.description,
      });
    }
  }

  // Sort by confidence
  return detected.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Calculate confidence score for a detected token
 */
function calculateConfidence(token: string, pattern: TokenPattern): number {
  let score = 0.7; // Base confidence

  // Format validation
  if (token.startsWith(pattern.prefix)) score += 0.1;
  
  // Length validation
  if (token.length >= 20) score += 0.1;
  
  // Entropy check (variety of characters)
  const uniqueChars = new Set(token).size;
  if (uniqueChars > token.length * 0.4) score += 0.1;
  
  // Cap at 0.99
  return Math.min(score, 0.99);
}

/**
 * Detect token type from value
 */
export function detectTokenType(token: string): {
  name: string;
  category: string;
  confidence: number;
} {
  for (const patternDef of TOKEN_PATTERNS) {
    if (patternDef.pattern.test(token)) {
      const confidence = calculateConfidence(token, patternDef);
      return {
        name: patternDef.name,
        category: patternDef.category,
        confidence,
      };
    }
  }
  
  // Default for unknown tokens
  return {
    name: 'Unknown',
    category: 'Other',
    confidence: 0.3,
  };
}

/**
 * Validate if a string looks like a token
 */
export function isValidTokenFormat(value: string): boolean {
  // Minimum length check
  if (value.length < 10) return false;
  
  // Check against all patterns
  for (const patternDef of TOKEN_PATTERNS) {
    if (patternDef.pattern.test(value)) return true;
  }
  
  // Check for generic token characteristics
  const hasPrefix = /^[a-zA-Z]+[_-]/.test(value);
  const hasHighEntropy = new Set(value).size > value.length * 0.3;
  const hasAlphanumeric = /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
  
  return hasPrefix && hasHighEntropy && hasAlphanumeric;
}

/**
 * Get all unique categories
 */
export function getTokenCategories(): string[] {
  return [...new Set(TOKEN_PATTERNS.map(p => p.category))];
}
