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
  KeyRound,
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
  Crown,
  Zap,
  Users,
  Plus,
  UserPlus,
  Settings as SettingsIcon,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ProviderSettings as AIProviderSettings } from '@/components/providers/ProviderSettings';
import { TeamsSettings } from '@/components/TeamsSettings';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: nextAuthSession } = useSession();
  const supabase = createClient();
  
  const initialTab = searchParams.get('tab') || 'appearance';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [user, setUser] = useState<{ id: string; email: string; name: string | null; avatar_url: string | null; plan?: string; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [theme, setTheme] = useState('dark');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const localAuth = process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === 'true';
    setUseLocalAuth(localAuth);
    
    if (!localAuth) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const configured = !!(
        supabaseUrl &&
        supabaseKey &&
        supabaseUrl !== 'https://your-project.supabase.co' &&
        supabaseKey !== 'your-anon-key'
      );
      setIsConfigured(configured);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (useLocalAuth) {
        if (nextAuthSession?.user) {
          setIsAuthenticated(true);
        }
        setSessionLoading(false);
      } else {
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        if (supabaseSession) {
          setIsAuthenticated(true);
        }
        setSessionLoading(false);
      }
    };
    checkSession();
  }, [useLocalAuth, nextAuthSession, supabase]);

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchUserData();
      fetchApiKeys();
    }
  }, [sessionLoading, isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/api-keys');
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar_url: avatarUrl }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        fetchUserData();
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setGeneratingKey(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys([...apiKeys, data.key]);
        setMessage({ type: 'success', text: 'API key generated' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to generate API key' });
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== keyId));
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete API key' });
    }
  };

  const handleLogout = async () => {
    if (useLocalAuth) {
      await signOut({ redirect: false });
    } else {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
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

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade');
    }
  };

  const isPro = user?.plan === 'PRO';

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'plan', label: 'Plan', icon: Crown },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'ai-providers', label: 'AI Providers', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: KeyRound },
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
                <p className="text-[#737373] text-sm mb-6">
                  Customize how TOKNS looks on your device.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#737373] mb-3">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className={`p-4 border-2 flex items-center justify-center gap-2 ${
                          theme === 'dark' ? 'border-[#FF9F1C] text-[#FF9F1C]' : 'border-[#404040] text-[#737373]'
                        }`}
                      >
                        <Moon className="w-5 h-5" />
                        Dark
                      </button>
                      <button
                        onClick={() => handleThemeChange('light')}
                        className={`p-4 border-2 flex items-center justify-center gap-2 ${
                          theme === 'light' ? 'border-[#FF9F1C] text-[#FF9F1C]' : 'border-[#404040] text-[#737373]'
                        }`}
                      >
                        <Sun className="w-5 h-5" />
                        Light
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
                  Profile Settings
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {message.text && (
                    <div className={`p-3 text-sm ${
                      message.type === 'success' 
                        ? 'border border-green-500 bg-green-500/10 text-green-500' 
                        : 'border border-red-500 bg-red-500/10 text-red-500'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-[#262626] border-2 border-[#404040] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-[#737373]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#737373] mb-1">Profile Photo</p>
                      <p className="text-xs text-[#525252]">Paste a URL for your avatar</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full p-3 bg-black border-2 border-[#404040] text-[#737373] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#737373] mb-2">Avatar URL</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#FF9F1C]" />
                  Your Plan
                </h2>
                
                <div className={`p-4 border-2 mb-6 ${isPro ? 'border-[#FF9F1C] bg-[#FF9F1C]/10' : 'border-[#404040]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {isPro ? (
                          <span className="text-[#FF9F1C] font-bold flex items-center gap-2">
                            <Crown className="w-5 h-5" /> PRO
                          </span>
                        ) : (
                          <span className="text-white font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Free
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#737373] mt-1">
                        {isPro 
                          ? 'You have unlimited tokens and team features!' 
                          : '15 tokens max, 1 user'}
                      </p>
                    </div>
                    {!isPro && (
                      <button
                        onClick={handleUpgrade}
                        className="px-6 py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                </div>

                {!isPro && (
                  <div className="border-2 border-[#404040] p-6">
                    <h3 className="font-bold mb-4">Pro Plan - $7.99/user/month</h3>
                    <ul className="space-y-2 text-sm text-[#737373] mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> Unlimited tokens
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> Team collaboration
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> Priority support
                      </li>
                    </ul>
                    <button
                      onClick={handleUpgrade}
                      className="w-full py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90"
                    >
                      Upgrade Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF9F1C]" />
                  Team Collaboration
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Create and manage teams to share tokens with your colleagues. Available on PRO plan.
                </p>
                
                {!isPro ? (
                  <div className="border-2 border-[#FF9F1C] bg-[#FF9F1C]/10 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-6 h-6 text-[#FF9F1C]" />
                      <span className="font-bold text-[#FF9F1C]">Upgrade to PRO</span>
                    </div>
                    <p className="text-sm text-[#737373] mb-4">
                      Team collaboration is available on the PRO plan. Create teams, invite members, and share tokens securely.
                    </p>
                    <button
                      onClick={handleUpgrade}
                      className="w-full py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Upgrade to PRO
                    </button>
                  </div>
                ) : (
                  <TeamsSettings user={user} />
                )}
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
                
                <div id="ai-providers-content">
                  <AIProviderSettings />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="border-2 border-[#404040] bg-[#171717] p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#FF9F1C]" />
                    Change Password
                  </h2>

                  {useLocalAuth ? (
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
                        disabled={changingPassword}
                        className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Change Password
                      </button>
                    </form>
                  ) : (
                    <p className="text-[#737373] text-sm">
                      Password changes are managed through Supabase authentication.
                    </p>
                  )}
                </div>

                <div className="border-2 border-red-900/50 bg-red-900/5 p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-[#737373] text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full p-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#FF9F1C]" />
                  API Keys
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Manage API keys for programmatic access to your TOKNS account.
                </p>

                {!isPro ? (
                  <div className="border-2 border-[#FF9F1C] bg-[#FF9F1C]/10 p-6 rounded-lg mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-6 h-6 text-[#FF9F1C]" />
                      <span className="font-bold text-[#FF9F1C]">Upgrade to PRO for API Access</span>
                    </div>
                    <p className="text-sm text-[#737373] mb-4">
                      Programmatic API access is a PRO feature. Generate API keys and integrate TOKNS with your CI/CD pipelines, scripts, and applications.
                    </p>
                    <ul className="space-y-2 text-sm text-[#737373] mb-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> REST API for token CRUD operations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> API key management
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> Webhook integrations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> CI/CD integration
                      </li>
                    </ul>
                    <button
                      onClick={handleUpgrade}
                      className="w-full py-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Upgrade to PRO
                    </button>
                    <a 
                      href="/docs/api" 
                      className="flex items-center justify-center gap-2 mt-4 text-sm text-[#FF9F1C] hover:underline"
                    >
                      View API Documentation
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <>
                    {message.text && (
                      <div className={`p-3 text-sm mb-4 ${
                        message.type === 'success' 
                          ? 'border border-green-500 bg-green-500/10 text-green-500' 
                          : 'border border-red-500 bg-red-500/10 text-red-500'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500 mb-6">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">API access enabled with your PRO plan</span>
                    </div>

                    <div className="space-y-4 mb-6">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-3 bg-black border border-[#404040]">
                          <div>
                            <div className="font-mono text-sm">
                              {key.prefix}...{key.suffix}
                            </div>
                            <div className="text-xs text-[#737373]">
                              Created {new Date(key.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(key.fullKey)}
                              className="p-2 text-[#737373] hover:text-[#FF9F1C]"
                            >
                              {copiedKey === key.fullKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteApiKey(key.id)}
                              className="p-2 text-[#737373] hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerateApiKey}
                      disabled={generatingKey}
                      className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      Generate New API Key
                    </button>
                    
                    <a 
                      href="/docs/api" 
                      className="flex items-center justify-center gap-2 mt-4 text-sm text-[#FF9F1C] hover:underline"
                    >
                      View API Documentation
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                )}
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
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F1C]" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}