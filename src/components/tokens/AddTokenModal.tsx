'use client';

import { useState } from 'react';
import { X, Plus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToknStore } from '@/lib/store';
import { detectTokenType } from '@/lib/token-parser';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'AI/ML',
  'Cloud',
  'Database',
  'Deployment',
  'Payments',
  'Communication',
  'Productivity',
  'Version Control',
  'Other',
];

export function AddTokenModal({ onClose }: { onClose: () => void }) {
  const addToken = useToknStore((state) => state.addToken);

  const [service, setService] = useState('');
  const [token, setToken] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [showToken, setShowToken] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<{
    name: string;
    category: string;
    confidence: number;
  } | null>(null);

  // Auto-detect token type on paste/change
  const handleTokenChange = (value: string) => {
    setToken(value);
    if (value.length > 10) {
      const detected = detectTokenType(value);
      if (detected.confidence > 0.5) {
        setDetectedInfo(detected);
        if (!service && detected.name !== 'Unknown') {
          setService(detected.name);
        }
        if (detected.category !== 'Other') {
          setCategory(detected.category);
        }
      }
    } else {
      setDetectedInfo(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !token) return;

    addToken({
      service,
      token,
      description,
      category,
      status: 'ACTIVE',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-[#171717] border-2 border-[#404040]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <h2 className="text-lg font-bold uppercase tracking-wider">Add New Token</h2>
          <button
            onClick={onClose}
            className="p-1 text-[#737373] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Service Name *
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g., OpenAI, GitHub, Stripe"
              className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors font-mono"
              required
            />
          </div>

          {/* Token Value */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Token Value *
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => handleTokenChange(e.target.value)}
                placeholder="Paste your token here"
                className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 pr-12 focus:border-[#FF9F1C] outline-none transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#FF9F1C] transition-colors"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {detectedInfo && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#737373]">
                  Detected: <span className="text-[#FF9F1C]">{detectedInfo.name}</span>
                  {' '}(confidence: {Math.round(detectedInfo.confidence * 100)}%)
                </span>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors font-mono"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#737373] uppercase tracking-wider mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this token for?"
              rows={2}
              className="w-full bg-[#0a0a0a] border-2 border-[#404040] text-white px-4 py-2 focus:border-[#FF9F1C] outline-none transition-colors font-mono resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-[#404040] text-[#737373] font-bold uppercase hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!service || !token}
              className={cn(
                'flex-1 px-4 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2',
                service && token
                  ? 'bg-[#FF9F1C] text-black border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C]'
                  : 'bg-[#262626] text-[#525252] border-2 border-[#262626] cursor-not-allowed'
              )}
            >
              <Plus className="w-4 h-4" />
              Save Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
