'use client';

import { useState } from 'react';
import { X, Copy, Eye, EyeOff, Trash2, CheckCircle, Clock, Tag, FileText, Shield } from 'lucide-react';
import { useToknStore, getDecryptedToken } from '@/lib/store';
import { copyToClipboard, formatDate, formatRelativeTime } from '@/lib/encryption';
import { cn } from '@/lib/utils';

export function TokenDetailModal({
  tokenId,
  onClose,
}: {
  tokenId: string;
  onClose: () => void;
}) {
  const token = useToknStore((state) => state.getToken(tokenId));
  const deleteToken = useToknStore((state) => state.deleteToken);

  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!token) {
    onClose();
    return null;
  }

  const decryptedToken = getDecryptedToken(token.token);

  const handleCopy = async () => {
    const success = await copyToClipboard(decryptedToken);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this token?')) {
      deleteToken(tokenId);
      onClose();
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
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#737373] uppercase">Status:</span>
            <span className={cn(
              'px-3 py-1 text-xs font-bold uppercase',
              statusColors[token.status]
            )}>
              {token.status}
            </span>
          </div>

          {/* Token Value */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Token
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0a0a0a] border-2 border-[#404040] px-4 py-2 font-mono text-sm break-all">
                {showToken ? decryptedToken : '•'.repeat(Math.min(decryptedToken.length, 24))}
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
