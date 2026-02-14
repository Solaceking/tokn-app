'use client';

import { useState } from 'react';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenHealthResult {
  id: string;
  service: string;
  status: 'valid' | 'invalid' | 'error';
  statusCode?: number;
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

interface TokenHealthCheckerProps {
  tokens: Array<{
    id: string;
    service: string;
    category: string;
  }>;
  onHealthCheckComplete?: (results: TokenHealthResult[]) => void;
}

export function TokenHealthChecker({ tokens, onHealthCheckComplete }: TokenHealthCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [results, setResults] = useState<TokenHealthResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const checkTokenHealth = async (token: { id: string; service: string; category: string }): Promise<TokenHealthResult> => {
    try {
      const res = await fetch(`/api/tokens/${token.id}/test`, {
        method: 'POST',
      });

      const data = await res.json();
      
      return {
        id: token.id,
        service: token.service,
        status: data.valid ? 'valid' : 'invalid',
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        message: data.message,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        id: token.id,
        service: token.service,
        status: 'error',
        message: 'Failed to test token',
        lastChecked: new Date().toISOString(),
      };
    }
  };

  const checkAllTokens = async () => {
    setChecking(true);
    setShowResults(true);
    const newResults: TokenHealthResult[] = [];

    for (const token of tokens) {
      setCurrentToken(token.id);
      const result = await checkTokenHealth(token);
      newResults.push(result);
      
      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setResults(newResults);
    setChecking(false);
    setCurrentToken(null);
    onHealthCheckComplete?.(newResults);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-500';
      case 'invalid':
        return 'text-red-500';
      case 'error':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const validCount = results.filter(r => r.status === 'valid').length;
  const invalidCount = results.filter(r => r.status === 'invalid').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#FF9F1C]" />
            Token Health Checker
          </h3>
          <p className="text-sm text-[#737373]">
            Test your API tokens to ensure they're still valid and working
          </p>
        </div>
        <button
          onClick={checkAllTokens}
          disabled={checking || tokens.length === 0}
          className="px-4 py-2 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center gap-2"
        >
          {checking ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Check All Tokens
            </>
          )}
        </button>
      </div>

      {/* Results Summary */}
      {showResults && results.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border border-green-500/20 bg-green-500/5 rounded">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span className="font-bold">{validCount}</span>
            </div>
            <div className="text-xs text-green-600">Valid</div>
          </div>
          <div className="p-3 border border-red-500/20 bg-red-500/5 rounded">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="w-4 h-4" />
              <span className="font-bold">{invalidCount}</span>
            </div>
            <div className="text-xs text-red-600">Invalid</div>
          </div>
          <div className="p-3 border border-yellow-500/20 bg-yellow-500/5 rounded">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold">{errorCount}</span>
            </div>
            <div className="text-xs text-yellow-600">Errors</div>
          </div>
        </div>
      )}

      {/* Current Check Progress */}
      {checking && currentToken && (
        <div className="p-3 border border-[#404040] bg-[#171717] rounded">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#FF9F1C]" />
            <span className="text-sm">
              Testing {tokens.find(t => t.id === currentToken)?.service}...
            </span>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {showResults && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-3 border border-[#404040] bg-[#171717] rounded"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.service}</div>
                    <div className={cn(
                      'text-xs font-medium',
                      getStatusColor(result.status)
                    )}>
                      {result.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#525252]">
                  {new Date(result.lastChecked).toLocaleTimeString()}
                </div>
              </div>
              
              {result.message && (
                <div className="text-xs text-[#737373] mb-2">
                  {result.message}
                </div>
              )}
              
              {result.statusCode && result.responseTime && (
                <div className="flex items-center gap-4 text-xs text-[#525252]">
                  <span>Status: {result.statusCode}</span>
                  <span>Response: {result.responseTime}ms</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {tokens.length === 0 && (
        <div className="p-6 border border-[#404040] bg-[#171717] rounded text-center">
          <AlertTriangle className="w-8 h-8 text-[#737373] mx-auto mb-2" />
          <p className="text-[#737373]">No tokens to check</p>
        </div>
      )}
    </div>
  );
}