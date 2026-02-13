'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Key, Terminal, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CTA() {
  const [mounted, setMounted] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Component mounted
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 border-t-2 border-[#404040] relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF9F1C]/5 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-bg-accent opacity-10" />

      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#FF9F1C]/30 to-transparent top-1/4"
          style={{ animation: 'pulse 3s ease-in-out infinite' }}
        />
        <div
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#FF9F1C]/20 to-transparent bottom-1/4"
          style={{ animation: 'pulse 4s ease-in-out infinite', animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div
            className={cn(
              'inline-flex items-center justify-center w-20 h-20 border-2 border-[#FF9F1C] mb-8 transition-all duration-700',
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            )}
          >
            <Key className="w-10 h-10 text-[#FF9F1C]" />
          </div>

          {/* Headline */}
          <h2
            className={cn(
              'text-4xl md:text-6xl font-bold text-white mb-6 uppercase transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            Ready to Take
            <br />
            <span className="text-[#FF9F1C]">Control?</span>
          </h2>

          {/* Description */}
          <p
            className={cn(
              'text-lg text-[#737373] mb-12 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Stop juggling API keys in plain text files.
            <br />
            Start managing them like a pro.
          </p>

          {/* CTA Buttons */}
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '300ms' }}
          >
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-12 py-5 bg-[#FF9F1C] text-black font-bold text-lg border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-all brutalist-shadow-hover"
            >
              <Terminal className="w-5 h-5" />
              GET STARTED FREE
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/parser"
              className="group inline-flex items-center justify-center gap-2 px-12 py-5 bg-transparent text-white font-bold text-lg border-2 border-[#404040] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-all"
            >
              TRY THE PARSER
            </a>
          </div>

          {/* Trust badges */}
          <div
            className={cn(
              'mt-12 flex items-center justify-center gap-8 text-[#525252] transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Data stays local</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Open source</span>
            </div>
          </div>

          {/* Code snippet */}
          <div
            className={cn(
              'mt-16 transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="inline-block bg-[#0a0a0a] border-2 border-[#262626] p-4 text-left">
              <div className="text-xs text-[#525252] mb-2"># Quick start</div>
              <code className="text-sm text-[#737373]">
                <span className="text-[#FF9F1C]">$</span> open{' '}
                <span className="text-white">tokn.app</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
