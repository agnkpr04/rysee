"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get('next') || '/affstore'; 
  const refCode = searchParams.get('ref');

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Preserve referral code in redirect URL
      let redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      if (refCode) {
        redirectUrl += `&ref=${encodeURIComponent(refCode)}`;
        console.log('[Login] Preserving referral code in OAuth redirect:', refCode);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        alert('Login gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F9F9FB]">
      <div className="w-full max-w-md p-8 bg-white border border-gray-50 shadow-sm rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-tight mb-2 text-[#18181B]">
            <span className="text-[#8B5CF6] italic">Rysee</span>{' '}
          </h1>
          <p className="text-sm font-light text-[#A1A1AA]">Affiliate Store Platform</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-light mb-2 text-[#18181B]">Selamat Datang</h2>
            <p className="text-xs font-light text-[#A1A1AA] mb-6">
              Login untuk mulai membuat affiliate store Anda
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 border border-gray-50 rounded-xl hover:bg-[#FAFAFA] hover:border-[#8B5CF6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-light text-[#18181B]">
              {loading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>

          <div className="text-center">
            <p className="text-xs font-light text-[#A1A1AA]">
              Dengan login, Anda setuju dengan syarat dan ketentuan kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#F9F9FB]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}