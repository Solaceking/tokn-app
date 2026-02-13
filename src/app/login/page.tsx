'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Key, Loader2, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = supabaseUrl && supabaseKey && 
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseKey !== 'your-anon-key';

  const supabase = isSupabaseConfigured 
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please set up your .env file with Supabase credentials.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please set up your .env file with Supabase credentials.');
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Key className="w-8 h-8 text-[#FF9F1C]" />
          <span className="text-2xl font-bold tracking-wider">TOKN</span>
        </div>

        {/* Login Form */}
        <div className="border-2 border-[#404040] bg-[#171717] p-8">
          <h1 className="text-xl font-bold mb-6 text-center">Sign In</h1>

          {!isSupabaseConfigured && (
            <div className="p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-500 text-sm mb-4">
              ⚠️ Supabase is not configured. Copy <code className="bg-black/50 px-1">.env.example</code> to <code className="bg-black/50 px-1">.env</code> and add your Supabase credentials.
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignIn('github')}
              disabled={!isSupabaseConfigured}
              className="w-full p-3 border-2 border-[#404040] hover:border-[#FF9F1C] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#404040]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#171717] px-2 text-[#737373]">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border border-red-500 bg-red-500/10 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-[#737373] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#737373] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-black border-2 border-[#404040] focus:border-[#FF9F1C] outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full p-3 bg-[#FF9F1C] text-black font-bold hover:bg-[#FF9F1C]/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#737373]">
            <Link href="/dashboard" className="text-[#FF9F1C] hover:underline mr-3">
              Go to Dashboard
            </Link>
            <br className="md:hidden" />
            Don't have an account?{' '}
            <Link href="/register" className="text-[#FF9F1C] hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
