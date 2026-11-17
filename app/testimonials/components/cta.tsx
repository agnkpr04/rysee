"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface FinalCTAProps {
  activeContext?: 'affiliate' | 'referral';
}

export default function FinalCTA({ activeContext }: FinalCTAProps) {
  return (
    <section className="py-24 bg-[#18181B] px-8">
      <div className={`relative max-w-6xl mx-auto rounded-[3rem] overflow-hidden bg-gradient-to-br ${accentGradient} p-1`}>
        {/* Inner Content Container */}
        <div className="bg-[#18181B] rounded-[2.9rem] px-8 py-16 md:py-24 text-center relative overflow-hidden">
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6] blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EC4899] blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#D946EF]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Ready to Scale?</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white leading-tight mb-8">
              Jangan Cuma Jadi <span className="italic font-serif">Penonton.</span> <br />
              Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] font-medium">Cuan</span> Sekarang.
            </h2>

            {/* Sub-text */}
            <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-12 max-w-xl mx-auto">
              Gabung dengan komunitas Rysee. Gunakan landing page editorial Rysee 
              atau bangun network referral dengan profit per member.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#pricing"
                className="group relative px-10 py-4 bg-white rounded-full text-[#18181B] text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
              >
                <span className="flex items-center gap-2">
                  Daftar Member Rysee <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                href="/help"
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-white text-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Hubungi Support
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding Subtle */}
      <div className="mt-20 text-center">
        <p className="text-[10px] font-medium tracking-[0.5em] text-gray-500 uppercase">
          Rysee — High End Affiliate System
        </p>
      </div>
    </section>
  );
}