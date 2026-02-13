'use client';

import { useEffect, useState, useRef } from 'react';
import { Key, ArrowRight, Terminal, Shield, Zap, Lock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROTATING_TEXTS = [
  'YOUR TOKENS. YOUR VAULT.',
  'SECURE. PARSE. SYNC.',
  'THE DEVELOPER\'S COMMAND CENTER.',
];

export function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 159, 28, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Floating orbs */}
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

      {/* Terminal lines decoration */}
      <div className="absolute top-20 left-8 text-[#404040] text-xs font-mono opacity-50 hidden lg:block">
        <div>{'>'} initializing tokn_vault...</div>
        <div className="text-[#FF9F1C]">{'>'} encryption: enabled</div>
        <div>{'>'} status: ready</div>
      </div>

      <div className="absolute bottom-20 right-8 text-[#404040] text-xs font-mono opacity-50 hidden lg:block text-right">
        <div>tokens: [secured]</div>
        <div className="text-[#FF9F1C]">parser: active</div>
        <div>sync: standby</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-3 px-6 py-3 border-2 border-[#FF9F1C] mb-12 transition-all duration-1000',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className="relative">
              <Key className="w-8 h-8 text-[#FF9F1C]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF9F1C] rounded-full animate-ping" />
            </div>
            <span className="text-3xl font-bold tracking-wider text-white">TOKN</span>
            <span className="text-xs text-[#FF9F1C] uppercase tracking-widest border-l border-[#FF9F1C] pl-3 ml-1">
              Beta
            </span>
          </div>

          {/* Main headline */}
          <div
            className={cn(
              'transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
              <span className="text-white block mb-2">
                {ROTATING_TEXTS[textIndex].split('.')[0]}.
              </span>
              <span className="text-gradient-accent block">
                {ROTATING_TEXTS[textIndex].split('.').slice(1).join('.').trim() || 'ZERO COMPROMISE.'}
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p
            className={cn(
              'text-lg md:text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-12 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            Secure API token management with brutalist precision.
            <br className="hidden md:block" />
            Parse, store, and sync your tokens. Zero tracking. Zero compromise.
          </p>

          {/* CTA Buttons */}
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '600ms' }}
          >
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#FF9F1C] text-black font-bold text-lg border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-all brutalist-shadow-hover"
            >
              <Terminal className="w-5 h-5" />
              OPEN DASHBOARD
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent text-white font-bold text-lg border-2 border-[#404040] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-all"
            >
              LEARN MORE
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Stats Row */}
          <div
            className={cn(
              'grid grid-cols-3 gap-px bg-[#404040] max-w-2xl mx-auto transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            {[
              { value: '20+', label: 'Token Types' },
              { value: '100%', label: 'Local First' },
              { value: '0', label: 'Tracking' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#171717] p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#FF9F1C] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[#525252] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
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
              className="flex items-center justify-center gap-2 text-[#525252] hover:text-[#FF9F1C] transition-colors cursor-default"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#404040] flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-[#FF9F1C] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
