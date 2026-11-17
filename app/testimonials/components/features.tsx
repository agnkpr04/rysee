"use client";

import React from 'react';
import { Box, Download, Settings2, Palette, Link as LinkIcon, Sparkles } from 'lucide-react';

interface FeaturesSectionProps {
  activeContext?: 'affiliate' | 'referral';
}

const storePreviews = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=600&fit=crop",
];

const features = [
  {
    icon: <Box className="w-4 h-4" />,
    title: "Ready-to-Add Products",
    desc: "Produk pilihan siap add ke toko dalam satu klik."
  },
  {
    icon: <Download className="w-4 h-4" />,
    title: "Full Asset Kit",
    desc: "Video & foto konten profesional sudah tersedia."
  },
  {
    icon: <Palette className="w-4 h-4" />,
    title: "Infinite Customization",
    desc: "Font, frame, dan color bisa diatur sesukamu."
  }
];

export default function FeaturesSection({ activeContext }: FeaturesSectionProps) {
  return (
    <section className="py-24 bg-[#27272A] overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header Content */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 mb-6">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            <span className="text-[10px] font-bold text-[#8B5CF6] tracking-[0.2em] uppercase">Creative Suite</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white mb-6 leading-tight">
            Bukan Sekadar Link Bio, <br />
            Ini <span className="italic font-serif">Toko Online</span> Anda.
          </h2>
          <p className="text-base text-gray-400 font-light max-w-xl">
            Rysee memberikan kontrol penuh. Personalisasikan toko Anda agar sesuai dengan personal branding Anda, bukan template standar yang membosankan.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div key={i} className="bg-[#18181B] p-8 rounded-[2rem] border border-gray-700/50 shadow-sm hover:shadow-md hover:border-gray-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-900/20 text-[#8B5CF6] flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h4 className="text-sm font-bold text-white mb-2 tracking-tight">{f.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Width Auto-Sliding Gallery - Terpisah agar tidak tumpang tindih */}
      <div className="relative w-full">
        <div className="flex gap-6 animate-scroll-x whitespace-nowrap py-4">
          {[...storePreviews, ...storePreviews].map((img, i) => (
            <div 
              key={i} 
              className="inline-block flex-shrink-0 w-56 h-80 rounded-[2.5rem] overflow-hidden border-[6px] border-[#18181B] shadow-2xl shadow-purple-900/20"
            >
              <img 
                src={img} 
                alt={`Store Preview ${i}`} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>

        {/* Fade Out Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#27272A] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#27272A] to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181B] rounded-full border border-gray-700/50 shadow-sm">
           <Settings2 className="w-3 h-3 text-[#D946EF]" />
           <span className="text-[10px] font-bold text-white tracking-[0.1em] uppercase">Live Preview: Real Member Customization</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); } 
        }
        .animate-scroll-x {
          display: flex;
          width: max-content;
          animation: scrollX 30s linear infinite;
        }
        .animate-scroll-x:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}