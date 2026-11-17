"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ReferralTracker() {
  useEffect(() => {
    const trackReferral = async () => {
      // Check if referral code exists in URL
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');

      if (!refCode) return;

      console.log('[ReferralTracker] Found referral code in URL:', refCode);

      // Save referral code to localStorage for later use (if user logs in later)
      localStorage.setItem('pendingReferralCode', refCode);
      console.log('[ReferralTracker] Saved referral code to localStorage');

      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          console.log('[ReferralTracker] User not logged in, skipping tracking (code saved for later)');
          return;
        }

        console.log('[ReferralTracker] User is logged in, tracking referral');

        // Call referral tracking API
        const response = await fetch('/api/referral/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token || ''}`,
          },
          body: JSON.stringify({ referralCode: refCode }),
        });

        if (response.ok) {
          console.log('[ReferralTracker] Referral tracked successfully');
          // Clear from localStorage after successful tracking
          localStorage.removeItem('pendingReferralCode');
        } else {
          const error = await response.json().catch(() => ({}));
          console.warn('[ReferralTracker] Referral not tracked:', error?.error || `status ${response.status}`);
        }

        // Remove ?ref= from URL to prevent duplicate tracking
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error('[ReferralTracker] Error tracking referral:', error);

        // Remove ?ref= from URL even on error
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    trackReferral();
  }, []);

  return null; // This component doesn't render anything
}
