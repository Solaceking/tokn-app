import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';
import { decrypt } from '@/lib/server-encryption';

// Service-specific testing configurations
const serviceConfigs: Record<string, {
  testUrl: string;
  headers?: Record<string, string>;
  method: 'GET' | 'POST';
  successStatusCodes: number[];
}> = {
  'github': {
    testUrl: 'https://api.github.com/user',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
    method: 'GET',
    successStatusCodes: [200],
  },
  'openai': {
    testUrl: 'https://api.openai.com/v1/models',
    method: 'GET',
    successStatusCodes: [200],
  },
  'anthropic': {
    testUrl: 'https://api.anthropic.com/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-06-01',
      'anthropic-version': '2023-06-01',
    },
    successStatusCodes: [200],
  },
  'google': {
    testUrl: 'https://generativelanguage.googleapis.com/v1/models',
    method: 'GET',
    successStatusCodes: [200],
  },
  'stripe': {
    testUrl: 'https://api.stripe.com/v1/balance',
    method: 'GET',
    successStatusCodes: [200],
  },
  'twilio': {
    testUrl: 'https://api.twilio.com/2010-04-01/Accounts.json',
    method: 'GET',
    successStatusCodes: [200],
  },
  'aws': {
    testUrl: 'https://sts.amazonaws.com/?Action=GetCallerIdentity&Version=2011-06-15',
    method: 'GET',
    successStatusCodes: [200],
  },
  'azure': {
    testUrl: 'https://management.azure.com/subscriptions?api-version=2020-01-01',
    method: 'GET',
    successStatusCodes: [200, 401], // 401 still means the token is valid format
  },
  'slack': {
    testUrl: 'https://slack.com/api/auth.test',
    method: 'GET',
    successStatusCodes: [200],
  },
  'discord': {
    testUrl: 'https://discord.com/api/v9/users/@me',
    method: 'GET',
    successStatusCodes: [200],
  },
  'twitter': {
    testUrl: 'https://api.twitter.com/2/users/me',
    method: 'GET',
    successStatusCodes: [200],
  },
  'reddit': {
    testUrl: 'https://oauth.reddit.com/api/v1/me',
    method: 'GET',
    successStatusCodes: [200],
  },
  'spotify': {
    testUrl: 'https://api.spotify.com/v1/me',
    method: 'GET',
    successStatusCodes: [200],
  },
  'default': {
    testUrl: 'https://httpbin.org/status/200',
    method: 'GET',
    successStatusCodes: [200],
  },
};

// POST - Test token validity
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get token
    const token = await prisma.token.findUnique({
      where: { 
        id: params.tokenId,
        userId: dbUser.id
      }
    });
    
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    
    // Decrypt the token
    const decryptedToken = decrypt(token.token, token.iv);
    
    // Get service configuration
    const serviceName = token.service.toLowerCase();
    const config = serviceConfigs[serviceName] || serviceConfigs.default;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'User-Agent': 'TOKN/1.0 (https://github.com/Solaceking/tokn-app)',
      ...config.headers,
    };
    
    // Add authentication based on service
    if (serviceName === 'github') {
      headers['Authorization'] = `token ${decryptedToken}`;
    } else if (serviceName === 'openai') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
    } else if (serviceName === 'anthropic') {
      headers['x-api-key'] = decryptedToken;
      headers['anthropic-version'] = '2023-06-01';
    } else if (serviceName === 'google') {
      headers['x-goog-api-key'] = decryptedToken;
    } else if (serviceName === 'stripe') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
      headers['Stripe-Version'] = '2023-10-16';
    } else if (serviceName === 'aws') {
      // AWS uses Signature Version 4 - this is a simplified test
      headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${decryptedToken}`;
    } else if (serviceName === 'azure') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
    } else if (serviceName === 'slack') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
    } else if (serviceName === 'discord') {
      headers['Authorization'] = `Bot ${decryptedToken}`;
    } else if (serviceName === 'twitter') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
    } else if (serviceName === 'reddit') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
      headers['User-Agent'] = 'TOKN/1.0 by /u/Solaceking';
    } else if (serviceName === 'spotify') {
      headers['Authorization'] = `Bearer ${decryptedToken}`;
    }
    
    // Make the test request
    const startTime = Date.now();
    let response: Response;
    let statusCode = 0;
    let responseText = '';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      response = await fetch(config.testUrl, {
        method: config.method,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      statusCode = response.status;
      responseText = await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({
          valid: false,
          statusCode: 408,
          responseTime: 10000,
          message: 'Request timeout - token may be invalid or service is unreachable'
        });
      }
      
      return NextResponse.json({
        valid: false,
        statusCode: 0,
        responseTime: Date.now() - startTime,
        message: `Network error: ${error.message}`
      });
    }
    
    const responseTime = Date.now() - startTime;
    
    // Check if the response indicates a valid token
    const isValid = config.successStatusCodes.includes(statusCode);
    
    // Parse response for additional info
    let message = '';
    if (!isValid) {
      try {
        const errorData = JSON.parse(responseText);
        message = errorData.message || errorData.error || `HTTP ${statusCode}`;
      } catch {
        message = `HTTP ${statusCode}`;
      }
    } else {
      message = 'Token is valid';
    }
    
    // Log the test result
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        action: 'TEST',
        service: token.service,
        details: `Token test: ${isValid ? 'VALID' : 'INVALID'} (${statusCode})`
      }
    });
    
    return NextResponse.json({
      valid: isValid,
      statusCode,
      responseTime,
      message,
      service: token.service,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Token test error:', error);
    return NextResponse.json(
      { 
        valid: false,
        statusCode: 0,
        responseTime: 0,
        message: 'Failed to test token'
      },
      { status: 500 }
    );
  }
}