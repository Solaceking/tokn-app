'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { signOut, useSession } from 'next-auth/react';
import {
  Key,
  User,
  Shield,
  Palette,
  Trash2,
  Loader2,
  LogOut,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Copy,
  Check,
  Camera,
  Upload,
  Users,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { ProviderSettings as AIProviderSettings } from '@/components/providers/ProviderSettings';
import { TeamsSettings } from '@/components/TeamsSettings';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<{
    id: string;
    email: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === 'true';
      setUseLocalAuth(useLocal);

      if (useLocal) {
        if (session?.user) {
          setUser({
            id: session.user.id || '',
            email: session.user.email || '',
            username: session.user.name || '',
            full_name: session.user.name || '',
          });
          setIsAuthenticated(true);
          setUsername(session.user.name || '');
          setFullName(session.user.name || '');
        }
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setIsAuthenticated(true);
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (dbUser) {
          setUser(dbUser);
          setUsername(dbUser.username || '');
          setFullName(dbUser.full_name || '');
          setAvatarUrl(dbUser.avatar_url);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [supabase, session]);

  const handleLogout = async () => {
    if (useLocalAuth) {
      await signOut({ redirect: false });
    } else {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    if (useLocalAuth) {
      alert('Profile updates not available in local auth mode');
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        username,
        full_name: fullName,
      })
      .eq('id', user.id);

    if (error) {
      alert('Failed to save profile');
    } else {
      alert('Profile saved!');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        alert('Password changed!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to change password');
      }
    } catch {
      alert('An error occurred');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will delete all your tokens and data.')) {
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
      });
      if (res.ok) {
        if (useLocalAuth) {
          await signOut({ redirect: false });
        } else {
          await supabase.auth.signOut();
        }
        router.push('/');
      } else {
        alert('Failed to delete account');
      }
    } catch {
      alert('An error occurred');
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F1C]" />
      </div>
    );
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'ai-providers', label: 'AI Providers', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'support', label: 'Support', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b-2 border-[#404040]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-[#FF9F1C]" />
            <span className="text-xl font-bold tracking-wider italic" style={{ transform: 'skewX(-8deg)', display: 'inline-block' }}>TOKNS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#737373] hover:text-white">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-[#737373] hover:text-white">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="flex gap-8">
          <nav className="w-48 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                  activeTab === tab.id
                    ? 'bg-[#FF9F1C] text-black'
                    : 'text-[#737373] hover:text-white hover:bg-[#171717]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1">
            {activeTab === 'appearance' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#FF9F1C]" />
                  Appearance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-[#737373]">Select your preferred theme</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-2 border-2 ${theme === 'dark' ? 'border-[#FF9F1C] bg-[#FF9F1C]/10' : 'border-[#404040]'}`}
                      >
                        <Moon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-2 border-2 ${theme === 'light' ? 'border-[#FF9F1C] bg-[#FF9F1C]/10' : 'border-[#404040]'}`}
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FF9F1C]" />
                  Profile
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full p-3 bg-black border-2 border-[#404040] text-[#737373]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF9F1C]" />
                  Team Collaboration
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Create and manage teams to share tokens with your colleagues.
                </p>
                <TeamsSettings user={user} />
              </div>
            )}

            {activeTab === 'ai-providers' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#FF9F1C]" />
                  AI Providers
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Configure AI providers for smart token parsing. Your API keys are encrypted and stored securely.
                </p>
                <AIProviderSettings />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {useLocalAuth && (
                  <div className="border-2 border-[#404040] bg-[#171717] p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#FF9F1C]" />
                      Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#737373] mb-2">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#737373] mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#737373] mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                )}

                <div className="border-2 border-red-500/50 bg-red-500/10 p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-sm text-[#737373] mb-4">
                    Once you delete your account, there is no going back. All your tokens and data will be permanently deleted.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-black transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FF9F1C]" />
                  Support TOKNS
                </h2>
                <p className="text-[#737373] mb-6">
                  TOKNS is open source and free to use. If you find it valuable, consider supporting development:
                </p>
                
                <div className="space-y-4">
                  <a
                    href="https://github.com/sponsors/Solaceking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border-2 border-[#404040] hover:border-[#FF9F1C] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="font-bold">GitHub Sponsors</p>
                        <p className="text-sm text-[#737373]">Support via GitHub</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#737373]" />
                  </a>

                  <a
                    href="https://ko-fi.com/solaceking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border-2 border-[#404040] hover:border-[#FF9F1C] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">☕</span>
                      <div>
                        <p className="font-bold">Ko-fi</p>
                        <p className="text-sm text-[#737373]">Buy me a coffee</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#737373]" />
                  </a>
                </div>

                <div className="mt-6 p-4 bg-[#FF9F1C]/10 border-2 border-[#FF9F1C]">
                  <p className="text-sm">
                    🙏 Thank you for using TOKNS! Your support helps keep this project alive and free for everyone.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF9F1C]" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
