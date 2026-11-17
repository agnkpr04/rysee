"use client";

import React from 'react';
import { ArrowRight, Crown, Package, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function FinalCTA() {
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const res = await fetch('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session?.access_token || ''}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setIsPremium(data.isPremium || false);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const res = await fetch('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session?.access_token || ''}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setIsPremium(data.isPremium || false);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <section className="relative w-full py-24 bg-[#F9F9FB] px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Konten Kit CTA */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-light text-[#18181B] mb-4">
            Konten Kit Siap Pakai
          </h3>
          <p className="text-[#71717A] mb-6 max-w-xl mx-auto text-sm">
            Akses ratusan konten promosi siap pakai untuk memaksimalkan bisnis Rysee Anda
          </p>
          {user ? (
            <Link
              href="/konten-kit"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20"
            >
              <Package className="w-4 h-4" strokeWidth={1.5} />
              Buka Konten Kit
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#F9F9FB] text-[#18181B] border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
            >
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              Login untuk Akses
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto mb-16"></div>

        {/* Main CTA */}
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#18181B] leading-tight mb-6">
          Mulai Dapatkan <br />
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
            Penghasilan Tambahan
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-base text-[#71717A] font-light leading-relaxed mb-10">
          Upgrade ke Premium seharga <span className="text-[#18181B] font-medium">Rp 99.000</span> dan dapatkan komisi hingga <span className="text-[#18181B] font-medium">Rp 60.000</span> per referral. Semua tier dapat mengikuti program referral. Tanpa batas, tanpa limit.
        </p>

        {/* Main Action Call */}
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/#pricing"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-base font-medium hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20"
          >
            Upgrade ke Premium
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            <span>Rp 99.000 Sekali Bayar</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Hingga Rp 60.000 Per Referral</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Matrix Tier System</span>
          </div>
        </div>
      </div>
    </section>
  );
}