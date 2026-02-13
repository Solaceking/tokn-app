'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Key,
  Search,
  Menu,
  Moon,
  Sun,
  FileCode,
  Scan,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Brain,
} from 'lucide-react';
import { scanForTokens, DetectedToken } from '@/lib/token-parser';
import { useToknStore } from '@/lib/store';
import { useAppTheme } from '@/hooks/use-theme';
import { maskToken } from '@/lib/encryption';
import { cn } from '@/lib/utils';

export default function ParserPage() {
  const { addToken, tokens } = useToknStore();
  const { theme, toggleTheme } = useAppTheme();

  const [inputText, setInputText] = useState('');
  const [detectedTokens, setDetectedTokens] = useState<DetectedToken[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = scanForTokens(inputText);
      setDetectedTokens(results);
      setSelectedTokens(new Set(results.map(t => t.id)));
      setIsScanning(false);
    }, 300);
  };

  const handleAIParse = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/parse/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        setIsScanning(false);
        return;
      }
      
      // Use the tokens returned from AI (or fallback)
      const results = data.tokens || [];
      setDetectedTokens(results);
      setSelectedTokens(new Set(results.map((t: any) => t.id)));
    } catch (error) {
      console.error('AI parse error:', error);
      alert('Failed to parse with AI');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleTokenSelection = (id: string) => {
    const newSet = new Set(selectedTokens);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTokens(newSet);
  };

  const handleSaveSelected = () => {
    const tokensToSave = detectedTokens.filter(t => selectedTokens.has(t.id));

    tokensToSave.forEach(t => {
      addToken({
        service: t.name,
        token: t.value,
        description: t.description,
        category: t.category,
        status: 'ACTIVE',
      });
    });

    setSavedCount(tokensToSave.length);
    setTimeout(() => setSavedCount(0), 3000);

    // Clear saved tokens from the list
    setDetectedTokens(detectedTokens.filter(t => !selectedTokens.has(t.id)));
    setSelectedTokens(new Set());
  };

  const handleClear = () => {
    setInputText('');
    setDetectedTokens([]);
    setSelectedTokens(new Set());
  };

  const allSelected = detectedTokens.length > 0 && selectedTokens.size === detectedTokens.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTokens(new Set());
    } else {
      setSelectedTokens(new Set(detectedTokens.map(t => t.id)));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-[#404040] bg-[#171717] flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[#404040] flex items-center gap-3">
          <Key className="w-6 h-6 text-[#FF9F1C]" />
          <Link href="/dashboard" className="text-xl font-bold text-white tracking-wider hover:text-[#FF9F1C]">
            TOKN
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors mb-1"
          >
            <Search className="w-5 h-5" />
            <span className="uppercase text-sm font-bold">Dashboard</span>
          </Link>
          <Link
            href="/parser"
            className="flex items-center gap-3 px-3 py-2 border-2 border-[#FF9F1C] bg-[#FF9F1C]/10 text-[#FF9F1C] mb-1"
          >
            <FileCode className="w-5 h-5" />
            <span className="uppercase text-sm font-bold">Parser</span>
          </Link>
        </nav>

        {/* Theme Toggle */}
        <div className="p-2 border-t border-[#404040]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="uppercase text-sm font-bold">Toggle Theme</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b-2 border-[#404040] bg-[#171717] px-6 py-4">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-[#FF9F1C]" />
            <h1 className="text-xl font-bold uppercase tracking-wider">Smart Token Parser</h1>
          </div>
          <p className="text-sm text-[#737373] mt-1">
            Paste text containing API tokens. We will detect and extract them automatically.
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            {/* Input Section */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
                  Input Text
                </h2>
                <span className="text-xs text-[#525252]">{inputText.length} characters</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Paste your text here. Examples:

# .env file
OPENAI_API_KEY=sk-proj-abc123...
STRIPE_SECRET=sk_live_xyz789...
GITHUB_TOKEN=ghp_1234567890...

# Config files
api_key: "AIzaSyB..."
database_url: "postgres://user:pass@host:5432/db"
                `}
                className="flex-1 min-h-[400px] bg-[#0a0a0a] border-2 border-[#404040] text-white p-4 focus:border-[#FF9F1C] outline-none transition-colors font-mono text-sm resize-none"
              />

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border-2 border-[#404040] text-[#737373] font-bold uppercase hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleScan}
                  disabled={!inputText.trim() || isScanning}
                  className={cn(
                    'flex-1 px-4 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2',
                    inputText.trim() && !isScanning
                      ? 'bg-[#404040] text-white border-2 border-[#404040] hover:border-[#FF9F1C] hover:text-[#FF9F1C]'
                      : 'bg-[#262626] text-[#525252] border-2 border-[#262626] cursor-not-allowed'
                  )}
                >
                  <Scan className="w-4 h-4" />
                  {isScanning ? '...' : 'Regex'}
                </button>
                <button
                  onClick={handleAIParse}
                  disabled={!inputText.trim() || isScanning}
                  className={cn(
                    'flex-1 px-4 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2',
                    inputText.trim() && !isScanning
                      ? 'bg-[#FF9F1C] text-black border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C]'
                      : 'bg-[#262626] text-[#525252] border-2 border-[#262626] cursor-not-allowed'
                  )}
                >
                  <Brain className="w-4 h-4" />
                  {isScanning ? '...' : 'AI Parse'}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
                  Detected Tokens
                </h2>
                <span className="text-xs text-[#525252]">
                  {detectedTokens.length} found
                </span>
              </div>

              <div className="flex-1 border-2 border-[#404040] bg-[#171717] overflow-hidden flex flex-col">
                {detectedTokens.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div>
                      <Scan className="w-12 h-12 text-[#404040] mx-auto mb-4" />
                      <p className="text-[#737373]">
                        No tokens detected yet.
                        <br />
                        Paste some text and click Scan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Select All */}
                    <div className="p-3 border-b border-[#404040] flex items-center gap-3 bg-[#0a0a0a]">
                      <button
                        onClick={toggleSelectAll}
                        className={cn(
                          'w-5 h-5 border-2 flex items-center justify-center transition-colors',
                          allSelected
                            ? 'bg-[#FF9F1C] border-[#FF9F1C] text-black'
                            : 'border-[#404040] hover:border-[#FF9F1C]'
                        )}
                      >
                        {allSelected && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <span className="text-xs text-[#737373] uppercase">
                        {selectedTokens.size} selected
                      </span>
                    </div>

                    {/* Token List */}
                    <div className="flex-1 overflow-auto">
                      {detectedTokens.map((token) => (
                        <div
                          key={token.id}
                          className={cn(
                            'p-4 border-b border-[#262626] flex items-start gap-3 transition-colors',
                            selectedTokens.has(token.id) && 'bg-[#FF9F1C]/5'
                          )}
                        >
                          <button
                            onClick={() => toggleTokenSelection(token.id)}
                            className={cn(
                              'w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                              selectedTokens.has(token.id)
                                ? 'bg-[#FF9F1C] border-[#FF9F1C] text-black'
                                : 'border-[#404040] hover:border-[#FF9F1C]'
                            )}
                          >
                            {selectedTokens.has(token.id) && <CheckCircle className="w-4 h-4" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-white uppercase">
                                {token.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-[#262626] text-[#737373]">
                                {token.category}
                              </span>
                              <span className={cn(
                                'text-xs',
                                token.confidence > 0.8 ? 'text-green-500' : 'text-[#FF9F1C]'
                              )}>
                                {Math.round(token.confidence * 100)}%
                              </span>
                            </div>
                            <code className="text-xs text-[#737373] font-mono break-all">
                              {maskToken(token.value)}
                            </code>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save Actions */}
                    <div className="p-4 border-t border-[#404040] bg-[#0a0a0a]">
                      {savedCount > 0 && (
                        <div className="mb-3 p-2 bg-green-600/20 border border-green-600 text-green-500 text-sm text-center">
                          {savedCount} token(s) saved successfully
                        </div>
                      )}
                      <button
                        onClick={handleSaveSelected}
                        disabled={selectedTokens.size === 0}
                        className={cn(
                          'w-full px-6 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2',
                          selectedTokens.size > 0
                            ? 'bg-[#FF9F1C] text-black border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C]'
                            : 'bg-[#262626] text-[#525252] border-2 border-[#262626] cursor-not-allowed'
                        )}
                      >
                        <Plus className="w-4 h-4" />
                        Save Selected ({selectedTokens.size})
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
