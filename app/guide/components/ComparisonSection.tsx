"use client";

import React from 'react';
import { Check, X, Zap } from 'lucide-react';

const comparison = [
  {
    feature: "Komisi per Referral",
    others: "Kecil & Tidak Menentu",
    guide: "Hingga Rp 60.000 (Matrix Tier)",
    status: true
  },
  {
    feature: "Metode Withdraw",
    others: "3-7 Hari Kerja",
    guide: "Manual via WhatsApp/Transfer",
    status: true
  },
  {
    feature: "Batas Referral",
    others: "Terbatas",
    guide: "Unlimited / Tanpa Batas",
    status: true
  },
  {
    feature: "Biaya Platform",
    others: "Tidak Transparan",
    guide: "Transparan (Rp 49.000 - Rp 99.000)",
    status: true
  },
  {
    feature: "Transparansi Data",
    others: "Terbatas / Tertutup",
    guide: "Live Dashboard Tracking",
    status: true
  }
];

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#F9F9FB] px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#18181B] mb-4">
            Keunggulan <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">Referral Rysee</span>
          </h2>
          <p className="text-sm text-[#A1A1AA] font-light tracking-widest uppercase">
            Program referral yang transparan dan menguntungkan
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="p-4 md:p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] whitespace-nowrap">Fitur</th>
                  <th className="p-4 md:p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] whitespace-nowrap">Lainnya</th>
                  <th className="p-4 md:p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6] bg-purple-50/30 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 fill-current" />
                      Rysee
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comparison.map((item, index) => (
                  <tr key={index} className="group hover:bg-[#F9F9FB] transition-colors">
                    <td className="p-4 md:p-6 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#18181B]">{item.feature}</span>
                    </td>
                    <td className="p-4 md:p-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3 text-xs text-[#A1A1AA] font-light">
                        <X className="w-3 h-3 text-red-300 flex-shrink-0" />
                        <span className="truncate">{item.others}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 bg-purple-50/10 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3 text-sm font-semibold text-[#18181B]">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{item.guide}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Trust Note */}
        <p className="mt-8 text-center text-xs text-[#A1A1AA]">
          *Data berdasarkan program referral Rysee saat ini.
        </p>
      </div>
    </section>
  );
}