"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const ryseeGradient = "from-[#8B5CF6] via-[#D946EF] to-[#FBBF24]";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      console.log('[LOGIN MODAL] Starting Google login');

      // Check for referral code in current URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      let refCode = urlParams.get('ref');

      // If not in URL, check localStorage (saved by ReferralTracker)
      if (!refCode) {
        refCode = localStorage.getItem('pendingReferralCode');
        console.log('[LOGIN MODAL] Referral code from localStorage:', refCode);
      } else {
        console.log('[LOGIN MODAL] Referral code from URL:', refCode);
      }

      let redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/affstore')}`;
      if (refCode) {
        redirectUrl += `&ref=${encodeURIComponent(refCode)}`;
        console.log('[LOGIN MODAL] Preserving referral code in OAuth redirect:', refCode);
      }

      console.log('[LOGIN MODAL] Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log('[LOGIN MODAL] OAuth response:', { data, error });

      if (error) {
        console.error('[LOGIN MODAL] Error signing in with Google:', error);
        alert('Login gagal. Silakan coba lagi.');
        setLoading(false);
      } else {
        console.log('[LOGIN MODAL] OAuth initiated successfully, waiting for redirect...');
      }
      // Success will be handled by auth state change in parent
    } catch (error) {
      console.error('[LOGIN MODAL] Unexpected error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white border border-gray-50 shadow-sm rounded-2xl p-8 relative z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#A1A1AA] hover:text-[#18181B] transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light tracking-tight mb-2 text-[#18181B]">
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#FBBF24] bg-clip-text text-transparent italic">Rysee</span>{' '}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
