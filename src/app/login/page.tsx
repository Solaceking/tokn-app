'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { signIn } from 'next-auth/react';
import { Key, Loader2, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

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

  const supabase = !useLocalAuth && isConfigured
    ? createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setError('Supabase is not configured.');
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
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useLocalAuth ? handleLocalLogin : handleSupabaseLogin;

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    if (!supabase) {
      setError('Supabase is not configured.');
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
        <div className="flex items-center justify-center gap-3 mb-8">
          <Key className="w-8 h-8 text-[#FF9F1C]" />
          <span className="text-2xl font-bold tracking-wider italic" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>TOKNS</span>
        </div>

        <div className="border-2 border-[#404040] bg-[#171717] p-8">
          <h1 className="text-xl font-bold mb-6 text-center">Sign In</h1>

          {!isConfigured && !useLocalAuth && (
            <div className="p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-500 text-sm mb-4">
              Authentication is not configured. Set USE_LOCAL_AUTH=true or configure Supabase credentials.
            </div>
          )}

          {useLocalAuth && (
            <div className="p-3 border border-blue-500 bg-blue-500/10 text-blue-400 text-sm mb-4">
              Local authentication mode enabled
            </div>
          )}

          {!useLocalAuth && isConfigured && (
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthSignIn('github')}
                className="w-full p-3 border-2 border-[#404040] hover:border-[#FF9F1C] flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#404040]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#171717] px-2 text-[#737373]">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || (!useLocalAuth && !isConfigured)}
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