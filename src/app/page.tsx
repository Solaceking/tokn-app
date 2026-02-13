'use client';

import { useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { Features, TokenPreview } from '@/components/home/Features';
import { CTA } from '@/components/home/CTA';
import { Footer } from '@/components/layout/Footer';
import { useToknStore } from '@/lib/store';

export default function Home() {
  const theme = useToknStore((state) => state.theme);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Hero />
      <Features />
      <TokenPreview />
      <CTA />
      <Footer />
    </main>
  );
}
