'use client';

import { useEffect, useState, useRef } from 'react';
import { Key, ArrowRight, Terminal, Shield, Zap, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROTATING_TEXTS = [
  'YOUR TOKENS. YOUR VAULT.',
  'SECURE. PARSE. SYNC.',
  'THE DEVELOPER\'S COMMAND CENTER.',
];

const ACTIVITY_LINES = [
  { text: '> initializing tokns_vault...', status: 'pending' },
  { text: '> encryption: AES-256-GCM', status: 'success', checkmark: true },
  { text: '> parser: active', status: 'active' },
  { text: '> tokens: 23 secured', status: 'default' },
  { text: '> sync: standby', status: 'pending' },
  { text: '> status: ready', status: 'success', checkmark: true },
];

export function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<number[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const currentLine = ACTIVITY_LINES[currentLineIndex].text;
    
    if (charIndex < currentLine.length) {
      const typingTimer = setTimeout(() => {
        setCharIndex(charIndex + 1);
      }, 40);
      return () => clearTimeout(typingTimer);
    } else {
      const lineCompleteTimer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev, currentLineIndex];
          if (newLines.length > 6) newLines.shift();
          return newLines;
        });
        setCurrentLineIndex((prev) => (prev + 1) % ACTIVITY_LINES.length);
        setCharIndex(0);
      }, 1500);
      return () => clearTimeout(lineCompleteTimer);
    }
  }, [charIndex, currentLineIndex]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 159, 28, 0.15) 0%, transparent 50%)`,
        }}
      />

      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(255, 159, 28, 0.4) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(255, 159, 28, 0.3) 0%, transparent 70%)', animationDelay: '2s' }}
        />
      </div>

      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="bg-card border border-border p-4 w-80 font-mono text-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
            <span className="ml-2 text-muted-foreground text-xs">tokns_vault</span>
          </div>
          <div className="space-y-1 min-h-[180px]">
            {displayedLines.map((lineIdx, i) => {
              const line = ACTIVITY_LINES[lineIdx];
              const isLastLine = i === displayedLines.length - 1;
              return (
                <div key={i} className="flex items-center">
                  <span
                    className={cn(
                      line.status === 'success' && 'text-[#22c55e]',
                      line.status === 'active' && 'text-primary',
                      line.status === 'pending' && 'text-primary',
                      line.status === 'default' && 'text-muted-foreground'
                    )}
                  >
                    {line.text}
                    {line.checkmark && ' ✓'}
                    {line.status === 'active' && ' ✓'}
                  </span>
                </div>
              );
            })}
            {displayedLines.length < 6 && (
              <div className="flex items-center">
                <span
                  className={cn(
                    ACTIVITY_LINES[currentLineIndex].status === 'success' && 'text-[#22c55e]',
                    ACTIVITY_LINES[currentLineIndex].status === 'active' && 'text-primary',
                    ACTIVITY_LINES[currentLineIndex].status === 'pending' && 'text-primary',
                    ACTIVITY_LINES[currentLineIndex].status === 'default' && 'text-muted-foreground'
                  )}
                >
                  {ACTIVITY_LINES[currentLineIndex].text.slice(0, charIndex)}
                </span>
                <span className="w-2 h-4 bg-primary animate-pulse ml-0.5"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={cn(
              'inline-flex items-center gap-3 px-6 py-3 border-2 border-primary mb-12 transition-all duration-1000',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className="relative">
              <Key className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
            </div>
            <span className="text-3xl font-bold tracking-wider text-foreground italic" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>TOKNS</span>
            <span className="text-xs text-primary uppercase tracking-widest border-l border-primary pl-3 ml-1">
              Beta
            </span>
          </div>

          <div
            className={cn(
              'transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
              <span className="text-foreground block mb-2">
                {ROTATING_TEXTS[textIndex].split('.')[0]}.
              </span>
              <span className="text-gradient-accent block">
                {ROTATING_TEXTS[textIndex].split('.').slice(1).join('.').trim() || 'ZERO COMPROMISE.'}
              </span>
            </h1>
          </div>

          <p
            className={cn(
              'text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            Secure API token management with brutalist precision.
            <br className="hidden md:block" />
            Parse, store, and sync your tokens. Zero tracking. Zero compromise.
          </p>

          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '600ms' }}
          >
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-bold text-lg border-2 border-primary hover:bg-transparent hover:text-primary transition-all brutalist-shadow-hover"
            >
              <Terminal className="w-5 h-5" />
              OPEN DASHBOARD
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/docs"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent text-foreground font-bold text-lg border-2 border-border hover:border-primary hover:text-primary transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              VIEW DOCS
            </a>
          </div>

          <div
            className={cn(
              'grid grid-cols-3 gap-px bg-border max-w-2xl mx-auto transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            {[
              { value: '20+', label: 'Token Types' },
              { value: '100%', label: 'Local First' },
              { value: '0', label: 'Tracking' },
            ].map((stat, i) => (
              <div key={i} className="bg-card p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            'mt-20 grid grid-cols-3 gap-4 max-w-3xl mx-auto transition-all duration-700',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '1000ms' }}
        >
          {[
            { icon: Shield, label: 'Encrypted' },
            { icon: Zap, label: 'Fast' },
            { icon: Lock, label: 'Secure' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-default"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}