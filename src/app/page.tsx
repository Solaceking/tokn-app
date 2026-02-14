'use client';

import { Hero } from '@/components/home/Hero';
import { Features, TokenPreview } from '@/components/home/Features';
import { CTA } from '@/components/home/CTA';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <Features />
      <TokenPreview />
      <CTA />
      <Footer />
    </main>
  );
}