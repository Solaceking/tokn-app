'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Key,
  Search,
  Shield,
  Download,
  Keyboard,
  Moon,
  Activity,
  Copy,
  Eye,
  Lock,
  Zap,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Search,
    title: 'SMART PARSER',
    description: 'Auto-detect API tokens from any text. Supports OpenAI, GitHub, Stripe, AWS, and 20+ formats.',
    accent: true,
  },
  {
    icon: Lock,
    title: 'LOCAL ENCRYPTION',
    description: 'Your tokens stay on your device. End-to-end encrypted. Zero cloud dependency.',
    accent: false,
  },
  {
    icon: Copy,
    title: 'QUICK COPY',
    description: 'One-click copy with auto-clear after 30 seconds. Clipboard security built-in.',
    accent: false,
  },
  {
    icon: Eye,
    title: 'TOKEN MASKING',
    description: 'Tokens masked by default. Click to reveal, click to hide. No accidental exposure.',
    accent: false,
  },
  {
    icon: Download,
    title: 'EXPORT OPTIONS',
    description: 'Export to .env or JSON. Perfect for CI/CD pipelines and deployment workflows.',
    accent: false,
  },
  {
    icon: Keyboard,
    title: 'KEYBOARD FIRST',
    description: 'Ctrl+K to search, Ctrl+N to add. Built for developers who hate the mouse.',
    accent: true,
  },
  {
    icon: Moon,
    title: 'DARK MODE',
    description: 'Dark by default. Light mode available. Easy on the eyes during late-night coding.',
    accent: false,
  },
  {
    icon: Activity,
    title: 'ACTIVITY LOG',
    description: 'Track every action. Know when tokens were added, copied, or deleted.',
    accent: false,
  },
];

export function Features() {
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the feature animations
            FEATURES.forEach((_, index) => {
              setTimeout(() => {
                setVisibleFeatures((prev) => new Set([...prev, index]));
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 border-t-2 border-[#404040]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#FF9F1C] text-[#FF9F1C] text-sm font-bold uppercase tracking-wider mb-6">
            <Terminal className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase">
            Built for Developers
          </h2>
          <p className="text-[#737373] max-w-2xl mx-auto text-lg">
            Every feature designed with security and efficiency in mind.
            <br />
            No bloat. No compromise. Just raw functionality.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#404040]">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'bg-[#171717] p-6 transition-all duration-500 min-h-[200px] flex flex-col',
                visibleFeatures.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 flex items-center justify-center border-2 mb-4 shrink-0',
                  feature.accent
                    ? 'border-[#FF9F1C] text-[#FF9F1C]'
                    : 'border-[#404040] text-[#737373]'
                )}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">
                {feature.title}
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed flex-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0a0a0a] border-2 border-[#262626]">
            <Zap className="w-5 h-5 text-[#FF9F1C]" />
            <span className="text-sm text-[#737373]">
              <span className="text-white font-bold">Zero setup</span> required. Start managing tokens in seconds.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Token preview section
export function TokenPreview() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Component mounted
  }, []);

  return (
    <section className="py-24 border-t-2 border-[#404040] bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div className={cn(
            'transition-all duration-700',
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          )}>
            <div className="inline-block px-4 py-2 border border-[#FF9F1C] text-[#FF9F1C] text-sm font-bold uppercase tracking-wider mb-4">
              Preview
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase">
              See It In Action
            </h2>
            <p className="text-[#737373] mb-8 leading-relaxed text-lg">
              Clean interface. No distractions. Your tokens organized and accessible.
              <br />
              Masked by default, revealed on demand.
            </p>

            <div className="space-y-4">
              {[
                { icon: Key, title: '20+ TOKEN TYPES', desc: 'OpenAI, GitHub, Stripe, AWS, and more' },
                { icon: Lock, title: 'LOCAL ENCRYPTION', desc: 'Your data stays on your device' },
                { icon: Zap, title: 'INSTANT SEARCH', desc: 'Find any token in milliseconds' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center border-2 border-[#404040] text-[#737373] group-hover:border-[#FF9F1C] group-hover:text-[#FF9F1C] transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold uppercase">{item.title}</div>
                    <div className="text-sm text-[#737373]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock dashboard preview */}
          <div
            className={cn(
              'border-2 border-[#404040] bg-[#171717] transition-all duration-700',
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Mock header */}
            <div className="flex items-center justify-between p-4 border-b border-[#404040]">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#FF9F1C]" />
                <span className="text-white font-bold">TOKN</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-8 bg-[#262626] border border-[#404040] flex items-center justify-center text-xs text-[#737373]">
                  <Search className="w-3 h-3 mr-1" />
                  Ctrl+K
                </div>
              </div>
            </div>

            {/* Mock stats */}
            <div className="grid grid-cols-4 gap-px bg-[#404040] border-b border-[#404040]">
              {[
                { label: 'TOTAL', value: '23' },
                { label: 'ACTIVE', value: '21' },
                { label: 'EXPIRING', value: '2' },
                { label: 'SYNC', value: 'OK' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#171717] p-3 text-center">
                  <div className="text-lg font-bold text-[#FF9F1C]">{stat.value}</div>
                  <div className="text-[10px] text-[#525252] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mock token cards */}
            <div className="p-4 space-y-2">
              {[
                { name: 'OPENAI', mask: 'sk-proj-••••••••••1234', status: 'ACTIVE', statusColor: 'bg-green-600' },
                { name: 'GITHUB', mask: 'ghp_••••••••••5678', status: 'ACTIVE', statusColor: 'bg-green-600' },
                { name: 'STRIPE', mask: 'sk_live_••••••••abcd', status: 'EXPIRING', statusColor: 'bg-[#FF9F1C] text-black' },
              ].map((token, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#0a0a0a] border border-[#404040] flex items-center justify-between hover:border-[#FF9F1C] transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[10px] text-[#525252] uppercase mb-1">{token.name}</div>
                    <div className="text-white font-mono text-sm">{token.mask}</div>
                  </div>
                  <div className={cn(
                    'px-2 py-1 text-[10px] font-bold uppercase',
                    token.statusColor
                  )}>
                    {token.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock footer */}
            <div className="p-4 border-t border-[#404040] flex items-center justify-between">
              <span className="text-xs text-[#525252]">3 TOKENS</span>
              <div className="flex items-center gap-1 text-[#FF9F1C] text-xs font-bold uppercase">
                <Download className="w-3 h-3" />
                Export
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
