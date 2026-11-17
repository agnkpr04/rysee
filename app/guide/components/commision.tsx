"use client";

import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function CommissionSection() {
  return (
    <section className="py-24 bg-white px-6 overflow-hidden relative">
      {/* Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: The Numbers */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8B5CF6]/10 bg-[#8B5CF6]/5 mb-6">
              <TrendingUp className="w-3 h-3 text-[#8B5CF6]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6]">Struktur Komisi</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#18181B] leading-tight mb-6">
              Komisi Hingga <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                Rp 60.000
              </span> Per Referral
            </h2>

            <p className="text-base text-[#71717A] font-light leading-relaxed max-w-md mb-8">
              Komisi referral tergantung tier Anda dan tier yang direfer. Semakin tinggi tier Anda, semakin besar komisi yang didapat. Tanpa batas jumlah referral.
            </p>

            <div className="p-6 rounded-2xl bg-[#F9F9FB] border border-gray-100">
              <h4 className="text-sm font-medium text-[#18181B] mb-4">Matrix Komisi Referral</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Free → Pro/Premium</span>
                  <span className="text-sm font-medium text-[#8B5CF6]">Rp 10.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Pro → Pro</span>
                  <span className="text-sm font-medium text-[#D946EF]">Rp 20.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Pro → Premium</span>
                  <span className="text-sm font-medium text-[#D946EF]">Rp 40.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Premium → Pro</span>
                  <span className="text-sm font-medium text-[#8B5CF6]">Rp 30.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">Premium → Premium</span>
                  <span className="text-sm font-medium text-[#8B5CF6]">Rp 60.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Projection Card */}
          <div className="relative">
            <div className="relative z-10 p-1 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-2xl">
              <div className="bg-[#F9F9FB] p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-[#18181B] mb-8 uppercase tracking-[0.2em]">Proyeksi Penghasilan</h3>
                
                <div className="space-y-6">
                  {[
                    { label: "10 Referrals (Premium)", amount: "Rp 600.000" },
                    { label: "50 Referrals (Premium)", amount: "Rp 3.000.000" },
                    { label: "100 Referrals (Premium)", amount: "Rp 6.000.000", highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between pb-4 border-b border-gray-200 ${item.highlight ? '' : ''}`}>
                      <span className="text-sm font-light text-[#71717A]">{item.label}</span>
                      <span className={`text-lg font-medium ${item.highlight ? 'text-[#8B5CF6]' : 'text-[#18181B]'}`}>{item.amount}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-[#A1A1AA] italic">
                  * Proyeksi penghasilan jika Anda adalah Premium dengan komisi Rp 60.000 per referral
                </p>
              </div>
            </div>
            
            {/* Ambient Background Light */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 blur-2xl opacity-30 -z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
}