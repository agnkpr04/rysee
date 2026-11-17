"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap, TrendingUp, Users, Layout } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface HeroSectionProps {
  activeContext: 'affiliate' | 'referral';
  setActiveContext: (context: 'affiliate' | 'referral') => void;
}

export default function HeroSection({ activeContext, setActiveContext }: HeroSectionProps) {
  const content = {
    affiliate: {
      badge: "The Next Gen Affiliate Ecosystem",
      headline: "Bangun <span className=\"italic font-serif\">Profit</span> Digital <br />Tanpa Batas.",
      subheadline: "Kelola link affiliate Shopee dengan landing page premium, atau hasilkan komisi dari setiap referral yang upgrade Premium. Satu platform, dua cara cerdas untuk cuan.",
      success: [
        { icon: TrendingUp, label: "Affiliate Success", value: "Active", desc: "Komisi Shopee Affiliate" },
        { icon: Users, label: "Referral Success", value: "Growing", desc: "Verified referral Premium" },
        { icon: Zap, label: "Weekly Profit", value: "Consistent", desc: "Income referral/minggu" }
      ]
    },
    referral: {
      badge: "Program Referral Rysee",
      headline: "Dapatkan <span className=\"italic font-serif\">Komisi</span> <br />Tanpa Batas.",
      subheadline: "Hasilkan <span className=\"text-[#18181B] font-medium\"> Rp 25.000 bersih </span> dari setiap referral yang upgrade Premium. Tanpa limit, tanpa batas jumlah referral.",
      success: [
        { icon: Users, label: "Total Referral", value: "Growing", desc: "Verified invites" },
        { icon: Zap, label: "Komisi Bersih", value: "Rp 25.000", desc: "Per referral" },
        { icon: TrendingUp, label: "Weekly Profit", value: "Consistent", desc: "Income referral/minggu" }
      ]
    }
  };

  const currentContent = content[activeContext];

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#18181B] px-6 pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/30 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          {/* Context Toggle */}
          <div className="inline-flex p-1 bg-[#27272A] border border-gray-700/50 rounded-full mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setActiveContext('affiliate')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-[10px] font-bold tracking-widest uppercase transition-all ${activeContext === 'affiliate' ? `bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20` : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Layout className="w-3 h-3" /> Affiliate
            </button>
            <button
              type="button"
              onClick={() => setActiveContext('referral')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-[10px] font-bold tracking-widest uppercase transition-all ${activeContext === 'referral' ? `bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20` : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Users className="w-3 h-3" /> Referral
            </button>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272A] border border-gray-700/50 mb-6 sm:mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[10px] font-medium tracking-[0.2em] text-gray-300 uppercase">
              {currentContent.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-white leading-[1.1] mb-6 sm:mb-8 max-w-5xl" dangerouslySetInnerHTML={{ __html: currentContent.headline }}>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-400 font-light leading-relaxed mb-8 sm:mb-12 px-4" dangerouslySetInnerHTML={{ __html: currentContent.subheadline }}>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/#pricing"
              className={`group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${accentGradient} rounded-full text-white text-sm font-medium transition-all hover:shadow-2xl hover:shadow-purple-500/30 active:scale-95`}
            >
              <span className="flex items-center justify-center gap-2">
                Mulai Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#27272A] border border-gray-700/50 rounded-full text-white text-sm font-medium hover:bg-[#3F3F46] hover:border-gray-600 transition-colors"
            >
              Lihat Cara Kerja
            </Link>
          </div>

          {/* Testimonials Opening - Quick Success Stories */}
          <div className="w-full max-w-4xl mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-4 sm:mb-6 tracking-wider uppercase">Success Stories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentContent.success.map((item, index) => (
                <div key={index} className="bg-[#27272A] rounded-2xl p-5 sm:p-6 border border-gray-700/50 hover:border-gray-600 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="text-xs font-medium text-[#8B5CF6]">{item.label}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-light text-white mb-1">{item.value}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Elements */}
          <div className="w-full max-w-4xl mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-medium tracking-tight text-gray-300">Verified System</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D946EF]" />
              <span className="text-xs font-medium tracking-tight text-gray-300">Instant Withdrawal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#18181B] to-transparent"></div>
    </section>
  );
}