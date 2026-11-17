"use client";

import React from 'react';
import { ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function ReferralHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#F9F9FB] px-6 pt-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D946EF]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 mb-8 shadow-sm">
            <ShoppingBag className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-medium tracking-wider text-[#18181B]">
              Platform Affiliate Digital
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#18181B] leading-tight mb-6">
            Mulai Bisnis Digital <br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
              Tanpa Modal Stok
            </span>
          </h1>

          {/* Value Prop Text */}
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#71717A] font-light leading-relaxed mb-10">
            Jual produk digital dan jasa website tanpa perlu stok barang. Dapatkan komisi hingga <span className="text-[#18181B] font-medium">80%</span> dari setiap penjualan sesuai tier membership Anda.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/pricing"
              className={`group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${accentGradient} text-white text-sm font-medium rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20`}
            >
              Lihat Pricing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/templates"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#18181B] hover:text-[#8B5CF6] transition-all"
            >
              Lihat Produk
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8 w-full max-w-3xl">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-3xl font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">80%</span>
              <span className="text-xs text-[#A1A1AA] mt-1">Max Komisi Produk</span>
            </div>
            <div className="flex flex-col items-center md:items-start border-x border-gray-200 px-8">
              <span className="text-3xl font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Unlimited</span>
              <span className="text-xs text-[#A1A1AA] mt-1">Stok Produk</span>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-3xl font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Gratis</span>
              <span className="text-xs text-[#A1A1AA] mt-1">Mulai Jualan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}