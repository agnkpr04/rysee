"use client";

import React from 'react';
import { UserPlus, Share2, Wallet2 } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: <UserPlus className="w-5 h-5" />,
    title: "Daftar Akun",
    description: "Daftar akun Rysee (Free, Pro, atau Premium) untuk mendapatkan akses referral program. Semua tier dapat mengikuti program referral."
  },
  {
    number: "02",
    icon: <Share2 className="w-5 h-5" />,
    title: "Share Link Referral",
    description: "Bagikan link referral unik Anda ke teman, keluarga, atau followers di media sosial."
  },
  {
    number: "03",
    icon: <Wallet2 className="w-5 h-5" />,
    title: "Terima Komisi",
    description: "Setiap referral yang upgrade ke Pro/Premium, Anda mendapatkan komisi sesuai matrix tier (hingga Rp 60.000 untuk Premium)."
  }
];

export default function StepsSection() {
  return (
    <section className="py-24 bg-[#F9F9FB] px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#A1A1AA] uppercase block mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#18181B]">
            Tiga Langkah <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">Mudah</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-[1px] bg-gray-200 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group">
              {/* Number & Icon Container */}
              <div className="flex items-center justify-center w-16 h-16 bg-white border border-gray-100 rounded-full mb-6 transition-all duration-500 group-hover:border-[#8B5CF6] group-hover:shadow-lg group-hover:shadow-purple-50 mx-auto md:mx-0">
                <div className="text-[#18181B] group-hover:text-[#8B5CF6] transition-colors">
                  {step.icon}
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {step.number}
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-[#18181B] mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#71717A] font-light leading-relaxed max-w-[280px] mx-auto md:mx-0">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 p-6 rounded-2xl bg-white border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#18181B] font-medium tracking-tight">
            Siap untuk mulai mendapatkan penghasilan tambahan?
          </p>
          <a
            href="/#pricing"
            className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20"
          >
            Upgrade Sekarang
          </a>
        </div>

      </div>
    </section>
  );
}