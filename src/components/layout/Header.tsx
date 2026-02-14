'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Key, Menu, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useAppTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface UserData {
  name: string;
  email: string;
  avatar_url?: string;
}

interface HeaderProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ sidebarOpen = true, onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppTheme();
  const supabase = createClient();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="border-b-2 border-border bg-card px-4 py-3 flex items-center gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <Link href="/dashboard" className="flex items-center gap-2">
        <Key className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold text-foreground tracking-wider italic" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>TOKNS</span>
      </Link>

      <div className="flex-1" />

      <nav className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/dashboard')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/parser"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/parser')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Parser
        </Link>
        <Link
          href="/settings"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/settings')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Settings
        </Link>
      </nav>

      <div className="flex items-center gap-2 pl-4 border-l border-border">
        <button
          onClick={toggleTheme}
          className="p-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {!loading && user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary border border-border flex items-center justify-center text-muted-foreground font-bold text-sm">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-foreground">
                  {user.name || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-muted-foreground hidden lg:block">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 border border-border text-muted-foreground hover:border-red-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}