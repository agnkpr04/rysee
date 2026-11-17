"use client";

import React from 'react';

export default function PhilosophySection() {
  return (
    <section className="relative w-full py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Large Label */}
          <div className="lg:col-span-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#8B5CF6] uppercase block mb-6">
              Tentang Program
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#18181B] leading-tight">
              Program Referral <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                Rysee
              </span>
            </h2>
          </div>

          {/* Right Side: Editorial Content */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#3F3F46] tracking-tight">
              Program referral Rysee dirancang untuk memberikan penghasilan tambahan bagi semua user. Komisi referral menggunakan matrix tier, hingga <span className="text-[#18181B] font-medium">Rp 60.000</span> per referral untuk user Premium.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181B] mb-3">Tanpa Batas Referral</h4>
                <p className="text-sm text-[#71717A] font-light leading-relaxed">
                  Tidak ada limit jumlah referral. Semakin banyak Anda mengajak teman, semakin besar penghasilan Anda.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181B] mb-3">Transparan & Terpercaya</h4>
                <p className="text-sm text-[#71717A] font-light leading-relaxed">
                  Semua transaksi tercatat di dashboard. Withdraw diproses manual untuk keamanan dan verifikasi.
                </p>
              </div>
            </div>

            {/* Signature Quote / Small Detail */}
            <div className="mt-4">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-[#8B5CF6]"></div>
                <span className="text-xs text-[#71717A]">Didesain untuk komunitas Rysee</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}