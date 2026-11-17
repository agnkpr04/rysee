"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('[AUTH CALLBACK] Starting auth callback process');
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const nextTarget = queryParams.get('next');

        console.log('[AUTH CALLBACK] Query params:', { code: !!code, nextTarget });

        // Check for referral code
        const refCode = queryParams.get('ref');
        console.log('[AUTH CALLBACK] Referral code:', refCode);

        // 1. Tukarkan code dengan session jika ada
        if (code) {
          console.log('[AUTH CALLBACK] Exchanging code for session');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('[AUTH CALLBACK] Exchange error:', exchangeError);
            throw exchangeError;
          }
          console.log('[AUTH CALLBACK] Code exchange successful');
        }

        // 2. Ambil session terbaru
        console.log('[AUTH CALLBACK] Getting session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.error('[AUTH CALLBACK] Session error:', sessionError);
          throw new Error('Sesi tidak valid atau telah kedaluwarsa.');
        }

        console.log('[AUTH CALLBACK] Session found:', { userId: session.user.id, email: session.user.email });
        const user = session.user;

        // 3. Sinkronisasi ke Database Prisma (APR Digital System)
        console.log('[AUTH CALLBACK] Calling /api/auth/user');
        const response = await fetch('/api/auth/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            username: user.user_metadata?.username,
            source: 'auth_callback',
          }),
        });

        console.log('[AUTH CALLBACK] API response status:', response.status);

        // 4. Tangani Response (Baca JSON hanya sekali)
        const result = await response.json().catch(() => ({}));
        console.log('[AUTH CALLBACK] API response:', result);

        if (!response.ok) {
          console.error('[AUTH CALLBACK] API Error:', result);
          throw new Error(result.error || `Gagal sinkronisasi profil (${response.status})`);
        }

        console.log('[AUTH CALLBACK] User sync successful:', result.user?.id);

        // 5. Track referral if code exists
        if (refCode) {
          console.log('[AUTH CALLBACK] Tracking referral with code:', refCode);
          try {
            const trackRes = await fetch('/api/referral/track', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token || ''}`,
              },
              body: JSON.stringify({ referralCode: refCode }),
            });
            if (trackRes.ok) {
              console.log('[AUTH CALLBACK] Referral tracked successfully');
            } else {
              console.error('[AUTH CALLBACK] Failed to track referral:', await trackRes.text());
            }
          } catch (err) {
            console.error('[AUTH CALLBACK] Error tracking referral:', err);
          }
        }

        // 6. Redirect Dinamis
        const targetUrl = nextTarget 
          ? decodeURIComponent(nextTarget) 
          : `/${result.user.username || result.user.id}`;
        
        console.log('[AUTH CALLBACK] Redirecting to:', targetUrl);
        router.replace(targetUrl);
        
      } catch (err: any) {
        console.error('[AUTH CALLBACK] Auth Process Error:', err);
        setError(err.message || 'Terjadi kesalahan sistem.');
        // Beri waktu user membaca error sebelum redirect balik ke login
        setTimeout(() => router.push('/auth/login'), 4000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8F8F8]">
      <div className="text-center px-6">
        {error ? (
          <div className="animate-in fade-in duration-700">
             <h2 className="text-lg font-serif italic mb-2 text-red-500">Sistem Menolak Akses</h2>
             <p className="text-sm text-black/60 mb-6 font-light">{error}</p>
             <div className="flex justify-center">
                <div className="w-8 h-[1px] bg-red-200"></div>
             </div>
             <p className="mt-4 text-[10px] text-black/30 uppercase tracking-[0.2em] font-light">
                Redirecting to entry...
             </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-t-2 border-[#3E47A8] rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-2 border-[#3E47A8]/5 rounded-full"></div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-800 font-medium">Authenticating</p>
              <p className="text-[10px] text-slate-400 italic font-light">Establishing secure ecosystem connection...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}