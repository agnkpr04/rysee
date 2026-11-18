"use client";

import React, { useState } from 'react';
import { CheckCircle2, Layout, Users, ExternalLink } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const affiliateTestimonials = [
  {
    name: "Rina Growth",
    role: "Shopee Top Affiliate",
    profit: "Total Komisi Rp 12M+",
    content: "Dulu link bio berantakan banget. Sejak pakai Rysee dengan landing page premium, conversion rate naik drastis karena toko affiliate terlihat sangat terpercaya dan profesional.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", // Ganti dengan screenshot dashboard
  },
  {
    name: "Budi Digital",
    role: "Content Creator",
    profit: "500+ Klik per Hari",
    content: "Dengan Rysee, saya bisa custom toko affiliate sesuai branding saya. Followers makin percaya dan conversion ke Shopee meningkat signifikan. Fitur analytics-nya juga sangat membantu.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  }
];

const referralTestimonials = [
  {
    name: "Andi Cuan",
    role: "Rysee Networker",
    profit: "Nett Profit Rp 1.5jt/Week",
    content: "Sistem referral Rysee sangat transparan. Setiap teman yang upgrade Premium Rp 35.000, saya dapat Rp 25.000 bersih (71.4% share). Withdraw cepat dan terpercaya.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop", // Ganti dengan bukti transfer
  },
  {
    name: "Siti Berkah",
    role: "Side Hustler",
    profit: "45 Verified Invites",
    content: "Awalnya ragu, tapi setelah undang teman upgrade Premium dan dapat Rp 25.000 per orang, langsung gaspol. Rysee benar-benar bantu income tambahan tanpa ribet.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  }
];

export default function TestimonialsGrid() {
  const [activeTab, setActiveTab] = useState('affiliate');

  const currentData = activeTab === 'affiliate' ? affiliateTestimonials : referralTestimonials;

  return (
    <section className="py-24 bg-[#F9F9FB]">
      <div className="max-w-6xl mx-auto px-8">
        
        {/* Tabs Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-white border border-gray-100 rounded-full shadow-sm">
            <button 
              onClick={() => setActiveTab('affiliate')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium transition-all ${activeTab === 'affiliate' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'}`}
            >
              <Layout className="w-3.5 h-3.5" /> Affiliate Sukses
            </button>
            <button 
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium transition-all ${activeTab === 'referral' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'}`}
            >
              <Users className="w-3.5 h-3.5" /> Referral Sukses
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentData.map((item, index) => (
            <div key={index} className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Visual Screenshot / Mockup */}
                <div className="w-full lg:w-48 h-64 lg:h-auto rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-[10px] font-bold text-[#8B5CF6] tracking-wider uppercase mb-4 w-fit">
                    {item.profit}
                  </div>
                  <h3 className="text-xl font-light tracking-tight text-[#18181B] mb-3 leading-relaxed">
                    &quot;{item.content}&quot;
                  </h3>
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                    <div>
                      <p className="text-sm font-medium text-[#18181B]">{item.name}</p>
                      <p className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">{item.role}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-200 group-hover:text-[#D946EF] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Context Note */}
        <p className="text-center mt-12 text-[10px] text-[#A1A1AA] font-light tracking-[0.2em] uppercase">
          {activeTab === 'affiliate' 
            ? "*Data berdasarkan laporan dashboard affiliate member Rysee" 
            : "*Skema: Premium Rp 35.000 - Platform Fee Rp 10.000 = Referrer Rp 25.000"}
        </p>
      </div>
    </section>
  );
}