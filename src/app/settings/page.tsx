'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
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
} from 'lucide-react';
import { ProviderSettings as AIProviderSettings } from '@/components/providers/ProviderSettings';

// Create Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
 
function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  
  // Get initial tab from URL or default to 'appearance'
  const initialTab = searchParams.get('tab') || 'appearance';
  const [activeTab, setActiveTab] = useState(initialTab);

  // User state
  const [user, setUser] = useState<{ id: string; email: string; name: string | null; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Theme
  const [theme, setTheme] = useState('dark');
  
  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // API Keys
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      setSession(supabaseSession);
      setSessionLoading(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchUserData();
      fetchApiKeys();
    }
  }, [session, sessionLoading]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
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
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        // Refresh user data
        fetchUserData();
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete API key' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        await supabase.auth.signOut();
        router.push('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F1C]" />
      </div>
    );
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-providers', label: 'AI Providers', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#404040]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-[#FF9F1C]" />
            <span className="text-xl font-bold tracking-wider">TOKN</span>
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
          {/* Sidebar */}
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

          {/* Content */}
          <div className="flex-1">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#FF9F1C]" />
                  Appearance
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Customize how TOKN looks on your device.
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

            {/* Profile Tab */}
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

            {/* AI Providers Tab */}
            {activeTab === 'ai-providers' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#FF9F1C]" />
                  AI Providers
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Configure AI providers for smart token parsing. Your API keys are encrypted and stored securely.
                </p>
                
                {/* AI Provider Settings Component */}
                <div id="ai-providers-content">
                  <AIProviderSettings />
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
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
                      disabled={changingPassword}
                      className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Change Password
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
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

            {/* API Keys Tab */}
            {activeTab === 'api' && (
              <div className="border-2 border-[#404040] bg-[#171717] p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#FF9F1C]" />
                  API Keys
                </h2>
                <p className="text-[#737373] text-sm mb-6">
                  Manage API keys for programmatic access to your TOKN account.
                </p>

                {message.text && (
                  <div className={`p-3 text-sm mb-4 ${
                    message.type === 'success' 
                      ? 'border border-green-500 bg-green-500/10 text-green-500' 
                      : 'border border-red-500 bg-red-500/10 text-red-500'
                  }`}>
                    {message.text}
                  </div>
                )}

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
