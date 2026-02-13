'use client';

import { useState } from 'react';
import { X, Copy, Eye, EyeOff, Trash2, CheckCircle, Clock, Tag, FileText, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { copyToClipboard, formatRelativeTime } from '@/lib/encryption';
import { cn } from '@/lib/utils';

interface Token {
  id: string;
  service: string;
  token: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING';
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TokenDetailModalProps {
  token: Token;
  onClose: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function TokenDetailModal({
  token,
  onClose,
  onUpdate,
  onDelete,
}: TokenDetailModalProps) {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [localStatus, setLocalStatus] = useState(token.status);

  const handleCopy = async () => {
    // Fetch decrypted token
    try {
      const res = await fetch(`/api/tokens/${token.id}/decrypt`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const success = await copyToClipboard(data.token);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this token?')) {
      if (onDelete) onDelete();
      onClose();
    }
  };

  // Test token validity
  const handleTestToken = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // First get the decrypted token
      const decryptRes = await fetch(`/api/tokens/${token.id}/decrypt`, { method: 'POST' });
      if (!decryptRes.ok) {
        setTestResult('failed');
        setTesting(false);
        return;
      }

      const { token: decryptedToken } = await decryptRes.json();

      // Common API test patterns based on service
      const serviceLower = token.service.toLowerCase();
      let testUrl = '';
      let testHeaders: Record<string, string> = {};

      // Detect service type and construct test request
      if (serviceLower.includes('openai') || serviceLower.includes('ai') || serviceLower.includes('gpt')) {
        testUrl = 'https://api.openai.com/v1/models';
        testHeaders = { 'Authorization': `Bearer ${decryptedToken}` };
      } else if (serviceLower.includes('github')) {
        testUrl = 'https://api.github.com/user';
        testHeaders = { 'Authorization': `token ${decryptedToken}` };
      } else if (serviceLower.includes('stripe')) {
        testUrl = 'https://api.stripe.com/v1/balance';
        testHeaders = { 'Authorization': `Bearer ${decryptedToken}` };
      } else if (serviceLower.includes('aws') || serviceLower.includes('amazon')) {
        // AWS tokens are complex - just mark as unknown
        setTestResult('failed');
        setTesting(false);
        return;
      } else if (serviceLower.includes('google') || serviceLower.includes('gcp')) {
        testUrl = 'https://oauth2.googleapis.com/tokeninfo';
        testHeaders = { 'Authorization': `Bearer ${decryptedToken}` };
      } else if (serviceLower.includes('sendgrid')) {
        testUrl = 'https://api.sendgrid.com/v3/user/profile';
        testHeaders = { 'Authorization': `Bearer ${decryptedToken}` };
      } else if (serviceLower.includes('twilio')) {
        testUrl = `https://api.twilio.com/2010-04-01/Accounts.json`;
        const auth = Buffer.from(`${decryptedToken}`).toString('base64');
        testHeaders = { 'Authorization': `Basic ${auth}` };
      } else {
        // Generic test - try to use the token as Bearer token
        testUrl = 'https://httpbin.org/headers';
        testHeaders = { 'Authorization': `Bearer ${decryptedToken}` };
      }

      const response = await fetch(testUrl, { headers: testHeaders });
      
      // Check response
      if (response.ok || response.status === 200 || response.status === 201) {
        setTestResult('success');
        setLocalStatus('ACTIVE');
      } else if (response.status === 401 || response.status === 403) {
        setTestResult('failed');
        setLocalStatus('EXPIRED');
      } else {
        // Unknown response - might still be valid
        setTestResult('success');
      }
    } catch (error) {
      console.error('Token test error:', error);
      setTestResult('failed');
    } finally {
      setTesting(false);
    }
  };

  const statusColors = {
    ACTIVE: 'bg-green-600 text-white',
    EXPIRED: 'bg-red-600 text-white',
    EXPIRING: 'bg-[#FF9F1C] text-black',
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#171717] border-2 border-[#404040]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#FF9F1C]" />
            <h2 className="text-lg font-bold uppercase tracking-wider">{token.service}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#737373] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status Badge with Test Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#737373] uppercase">Status:</span>
              <span className={cn(
                'px-3 py-1 text-xs font-bold uppercase',
                statusColors[localStatus]
              )}>
                {localStatus}
              </span>
            </div>
            <button
              onClick={handleTestToken}
              disabled={testing}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 border text-xs font-bold uppercase transition-colors',
                testResult === 'success' ? 'border-green-600 text-green-600' :
                testResult === 'failed' ? 'border-red-600 text-red-600' :
                'border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C]'
              )}
            >
              {testing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {testing ? 'Testing...' : 'Test Token'}
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className={cn(
              'p-3 text-sm font-bold',
              testResult === 'success' ? 'bg-green-600/20 text-green-600' : 'bg-red-600/20 text-red-600'
            )}>
              {testResult === 'success' ? '✓ Token appears to be valid!' : '✗ Token test failed - may be invalid or expired'}
            </div>
          )}

          {/* Token Value */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Token
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0a0a0a] border-2 border-[#404040] px-4 py-2 font-mono text-sm break-all">
                {showToken ? token.token : '•'.repeat(Math.min(token.token.length, 24))}
              </div>
              <button
                onClick={() => setShowToken(!showToken)}
                className="p-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopy}
                className={cn(
                  'p-2 border transition-colors',
                  copied
                    ? 'border-green-600 text-green-600'
                    : 'border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C]'
                )}
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-4">
            <Tag className="w-4 h-4 text-[#737373]" />
            <span className="text-xs text-[#737373] uppercase">Category:</span>
            <span className="text-sm text-white">{token.category}</span>
          </div>

          {/* Description */}
          {token.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#737373]" />
                <span className="text-xs text-[#737373] uppercase">Description</span>
              </div>
              <p className="text-sm text-[#A3A3A3] bg-[#0a0a0a] border border-[#404040] p-3">
                {token.description}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#262626]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#737373]" />
              <div>
                <div className="text-xs text-[#525252] uppercase">Created</div>
                <div className="text-xs text-white">{formatRelativeTime(token.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#737373]" />
              <div>
                <div className="text-xs text-[#525252] uppercase">Updated</div>
                <div className="text-xs text-white">{formatRelativeTime(token.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-bold uppercase hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-3 bg-[#FF9F1C] text-black font-bold uppercase border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
