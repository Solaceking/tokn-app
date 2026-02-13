'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useAppTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark' || resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return {
    theme: mounted ? theme : 'dark',
    setTheme,
    toggleTheme,
    mounted,
  };
}
