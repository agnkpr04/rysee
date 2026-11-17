"use client";

import React from 'react';
import { Monitor, Layout, Users, Wallet } from 'lucide-react';

export default function DashboardShowcase() {
  return (
    <section className="py-24 bg-[#F9F9FB] px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Product Narrative */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#A1A1AA] uppercase block mb-6">
              Dashboard Rysee
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#18181B] leading-tight mb-6">
              Pantau Semua di <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                Satu Tempat
              </span>
            </h2>
            
            <p className="text-base text-[#71717A] font-light leading-relaxed mb-10">
              Dashboard Rysee memudahkan Anda memantau referral, komisi, dan performa toko Anda secara real-time.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#18181B] mb-1">Tracking Referral</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">Lihat semua referral yang berhasil Anda ajak.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <Wallet className="w-5 h-5 text-[#D946EF]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#18181B] mb-1">Komisi Real-time</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">Pantau komisi hingga Rp 60.000 per referral secara langsung.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <Layout className="w-5 h-5 text-[#EC4899]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#18181B] mb-1">Request Withdraw</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">Ajukan penarikan komisi dengan mudah via dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image Placeholder */}
          <div className="lg:w-1/2 order-1 lg:order-2 relative">
            {/* The Image Frame */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg border-8 border-white">
              <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 p-12 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-[#8B5CF6] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#18181B] mb-2">Dashboard Rysee</h3>
                  <p className="text-sm text-[#71717A]">Pantau referral & komisi Anda</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#18181B]">Aktif</span>
                </div>
                <p className="text-[10px] text-[#71717AA] leading-tight">Sistem referral berjalan 24/7</p>
              </div>
            </div>

            {/* Decorative Geometric Element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full blur-3xl opacity-60 -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}