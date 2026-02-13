'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Key, Menu, LogOut, User as UserIcon, Sun, Moon, Settings } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAppTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  // Don't show header on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="border-b-2 border-[#404040] bg-[#171717] px-4 py-3 flex items-center gap-4">
      {/* Menu Toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <Key className="w-6 h-6 text-[#FF9F1C]" />
        <span className="text-xl font-bold text-white tracking-wider">TOKN</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/dashboard')
              ? 'text-[#FF9F1C]'
              : 'text-[#737373] hover:text-white'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/parser"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/parser')
              ? 'text-[#FF9F1C]'
              : 'text-[#737373] hover:text-white'
          )}
        >
          Parser
        </Link>
        <Link
          href="/settings"
          className={cn(
            'px-3 py-2 text-sm font-bold uppercase transition-colors',
            isActive('/settings')
              ? 'text-[#FF9F1C]'
              : 'text-[#737373] hover:text-white'
          )}
        >
          Settings
        </Link>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 pl-4 border-l border-[#404040]">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Info */}
        {!loading && user && (
          <div className="flex items-center gap-3 pl-4 border-l border-[#404040]">
            <div className="flex items-center gap-2">
              {/* Avatar or initial */}
              <div className="w-8 h-8 bg-[#262626] border border-[#404040] flex items-center justify-center text-[#737373] font-bold text-sm">
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
                <div className="text-sm font-bold text-white">
                  {user.name || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-[#737373] hidden lg:block">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 border border-[#404040] text-[#737373] hover:border-red-600 hover:text-red-600 transition-colors"
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
