"use client";

import React from 'react';
import Link from 'next/link';
import { UserPlus, ShieldHalf, Wallet, ArrowRight } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface HowItWorksProps {
  activeContext?: 'affiliate' | 'referral';
}

const steps = [
  {
    icon: <UserPlus className="w-5 h-5" />,
    title: "Invite Member",
    desc: "Undang teman bergabung ke Rysee dengan biaya pendaftaran Rp 35.000.",
    amount: "+ Rp 35.000",
    color: "text-green-500"
  },
  {
    icon: <ShieldHalf className="w-5 h-5" />,
    title: "System Admin",
    desc: "Biaya maintenance sistem dan admin sebesar Rp 10.000 per transaksi.",
    amount: "- Rp 10.000",
    color: "text-red-400"
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    title: "Net Profit",
    desc: "Komisi bersih langsung masuk ke saldo akun Rysee kamu tanpa potongan lagi.",
    amount: "Rp 25.000",
    color: "text-[#8B5CF6]"
  }
];

export default function HowItWorks({ activeContext }: HowItWorksProps) {
  return (
    <section className="py-24 bg-[#18181B] relative overflow-hidden">
      {/* Decorative Gradient Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] opacity-60"></div>

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white mb-4">
            Sistem <span className="italic font-serif">Jujur</span>, Profit Terukur.
          </h2>
          <p className="text-sm text-gray-400 font-light tracking-wide uppercase">
            Transparansi Alur Referral Rysee
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -translate-y-12"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group text-center">
              {/* Icon Container */}
              <div className="w-16 h-16 mx-auto bg-[#27272A] border border-gray-700/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:border-purple-500/30 transition-all duration-500 mb-8 relative z-10">
                <div className={`p-3 rounded-xl bg-gray-800 group-hover:bg-purple-900/20 transition-colors duration-500 text-[#18181B] group-hover:text-[#8B5CF6]`}>
                  {step.icon}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-medium text-white mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 px-4 font-light">
                {step.desc}
              </p>

              {/* Amount Badge */}
              <div className={`inline-block px-4 py-1.5 rounded-full bg-[#27272A] border border-gray-700/50 text-xs font-bold tracking-tighter ${step.color}`}>
                {step.amount}
              </div>

              {/* Mobile Arrow */}
              {index !== 2 && (
                <div className="md:hidden mt-8 flex justify-center opacity-20">
                  <ArrowRight className="w-6 h-6 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note Box */}
        <div className="mt-20 p-8 rounded-3xl bg-[#27272A] border border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${accentGradient} flex items-center justify-center text-white text-xl`}>
              !
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Kenapa ada biaya admin?</h4>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Maintenance system, server eksklusif, & instan withdraw fee.</p>
            </div>
          </div>
          <Link
            href="/guide"
            className="text-xs font-bold text-[#8B5CF6] tracking-widest uppercase hover:opacity-70 transition-opacity"
          >
            Pelajari Selengkapnya →
          </Link>
        </div>
      </div>
    </section>
  );
}