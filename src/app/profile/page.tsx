'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Key,
  User,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Loader2,
  LogOut,
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully');
        setUser({ ...user!, name });
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
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
        await signOut({ redirect: false });
        router.push('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F1C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#404040]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-[#FF9F1C]" />
            <span className="text-xl font-bold tracking-wider">TOKN</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#737373] hover:text-white">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#737373] hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

        {/* Profile Information */}
        <div className="border-2 border-[#404040] bg-[#171717] p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF9F1C]" />
            Profile Information
          </h2>

          <form onSubmit={handleUpdateName} className="space-y-4">
            {message && (
              <div className={`p-3 text-sm ${message.includes('success') ? 'border border-green-500 bg-green-500/10 text-green-500' : 'border border-red-500 bg-red-500/10 text-red-500'}`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm text-[#737373] mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full p-3 bg-black border-2 border-[#404040] text-[#737373] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-[#737373] mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm text-[#737373] mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Member Since
              </label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                disabled
                className="w-full p-3 bg-black border-2 border-[#404040] text-[#737373] cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="border-2 border-[#404040] bg-[#171717] p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF9F1C]" />
            Security
          </h2>
          <p className="text-[#737373] text-sm mb-4">
            Your tokens are encrypted using AES-256-GCM encryption.
            Password is securely hashed.
          </p>
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
      </main>
    </div>
  );
}

function Link({ href, children, className }: any) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
