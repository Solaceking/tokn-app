'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { ErrorBoundary } from './ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem={false}
        disableTransitionOnChange
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </SessionProvider>
  );
}
