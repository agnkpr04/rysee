"use client";

import React from 'react';

interface StatsSectionProps {
  activeContext?: 'affiliate' | 'referral';
}

const stats = [
  { label: "Active Members", value: "Growing", suffix: "Community" },
  { label: "Commission System", value: "Automated", suffix: "Payouts" },
  { label: "Success Rate", value: "High", suffix: "Satisfaction" },
];

export default function StatsSection({ activeContext }: StatsSectionProps) {
  return (
    <section className="py-20 bg-[#18181B] border-y border-gray-800">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-4 group-hover:text-[#8B5CF6] transition-colors">
                {stat.label}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl font-light tracking-tighter text-white">
                  {stat.value}
                </span>
                <span className="text-[10px] font-medium tracking-widest text-[#D946EF] mt-2 uppercase">
                  {stat.suffix}
                </span>
              </div>
              {/* Subtle underline accent */}
              <div className="w-8 h-[1px] bg-gray-800 mx-auto mt-8 group-hover:w-16 group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#D946EF] transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}