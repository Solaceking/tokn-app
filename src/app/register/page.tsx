'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Key, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Key className="w-8 h-8 text-[#FF9F1C]" />
          <span className="text-2xl font-bold tracking-wider">TOKN</span>
        </div>

        {/* Register Form */}
        <div className="border-2 border-[#404040] bg-[#171717] p-8">
          <h1 className="text-xl font-bold mb-6 text-center">Create Account</h1>

          {!isSupabaseConfigured && (
            <div className="p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-500 text-sm mb-4">
              ⚠️ Supabase is not configured. Copy <code className="bg-black/50 px-1">.env.example</code> to <code className="bg-black/50 px-1">.env</code> and add your Supabase credentials.
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

            <div>
              <label className="block text-sm text-[#737373] mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#737373]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF9F1C] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
