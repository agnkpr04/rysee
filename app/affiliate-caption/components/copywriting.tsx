"use client";

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Quote, Terminal } from 'lucide-react';

const captions = [
  {
    category: "Hard Sell (TikTok/Reels)",
    text: "Nyesel banget baru tau sekarang! 😭 Ternyata dapet barang se-aesthetic ini gak harus mahal. Cek link di bio nomor 12 ya, mumpung masih promo! 🔥 #RacunShopee #LuxuryMinimalist",
  },
  {
    category: "Soft Sell (IG Story)",
    text: "Banyak yang tanya spill barang yang di meja kemarin... Ini aku spill ya, belinya di sini. Jujur kualitasnya di luar ekspektasi banget buat harga segini. ✨",
  },
  {
    category: "Urgency (Limited Offer)",
    text: "SISA 5 SLOT LAGI! 🚨 Barang ini sering banget sold out dalam hitungan jam. Yang dari kemarin nungguin, mending langsung checkout sekarang lewat link di bio no. 12!",
  }
];

export default function CopywritingVault() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-24 bg-[#F9F9FB]">
      <div className="max-w-6xl mx-auto px-8">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 mb-6 shadow-sm">
              <Terminal className="w-3 h-3 text-[#8B5CF6]" />
              <span className="text-[10px] font-bold text-[#18181B] tracking-[0.2em] uppercase">Marketing Tool</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#18181B] leading-tight">
              Ready-to-Use <span className="italic font-serif text-[#D946EF]">Copywriting.</span>
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] font-light max-w-xs md:text-right">
            Gak perlu pusing mikir caption. Cukup klik copy, paste, dan mulai jualan secara profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {captions.map((item, i) => (
            <div key={i} className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/20 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <Quote className="w-4 h-4 text-gray-100 group-hover:text-purple-100 transition-colors" />
                </div>
                <p className="text-sm text-[#71717A] leading-relaxed font-light mb-8 italic">
                  "{item.text}"
                </p>
              </div>

              <button 
                onClick={() => handleCopy(item.text, i)}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                  copiedIndex === i 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[#18181B] text-white hover:bg-black'
                }`}
              >
                {copiedIndex === i ? (
                  <> <Check className="w-3 h-3" /> Copied to Clipboard </>
                ) : (
                  <> <Copy className="w-3 h-3" /> Copy Caption </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 text-[#A1A1AA]">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-medium tracking-widest uppercase">Baru: AI Generator Caption (Coming Soon 2027)</span>
           </div>
        </div>
      </div>
    </section>
  );
}