"use client";

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqData = [
  {
    title: "Bagaimana cara mendapatkan komisi referral?",
    content: "Semua user (Free, Pro, Premium) dapat mengikuti program referral. Anda akan mendapatkan link referral unik yang bisa dibagikan ke teman. Komisi tergantung tier Anda dan tier yang direfer."
  },
  {
    title: "Berapa komisi yang saya dapatkan per referral?",
    content: "Komisi referral menggunakan matrix tier: Free dapat Rp 10K-20K, Pro dapat Rp 20K-40K, Premium dapat Rp 30K-60K tergantung tier yang direfer (Pro atau Premium)."
  },
  {
    title: "Bagaimana cara withdraw komisi?",
    content: "Withdraw dilakukan secara manual via WhatsApp atau transfer bank. Anda perlu mengajukan request withdraw di dashboard, dan admin akan memprosesnya setelah verifikasi."
  },
  {
    title: "Apakah ada batas jumlah referral?",
    content: "Tidak ada batas jumlah referral. Semakin banyak referral yang Anda ajak upgrade ke Pro/Premium, semakin besar penghasilan Anda tanpa limit."
  },
  {
    title: "Apakah user Free bisa ikut program referral?",
    content: "Ya! Semua user dapat mengikuti program referral. Namun, komisi yang didapat tergantung tier Anda. User Premium mendapatkan komisi tertinggi (hingga Rp 60K per referral)."
  }
];

export default function FAQSection() {
  const [selectedItem, setSelectedItem] = useState(-1);

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-[10px] font-bold tracking-widest text-[#A1A1AA] uppercase">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#18181B]">
            Pertanyaan <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">Umum</span>
          </h2>
        </div>

        <div className="border-t border-gray-100">
          {faqData.map((faq, idx) => (
            <div key={`faq-item-${idx}`} className="border-b border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedItem(selectedItem === idx ? -1 : idx)}
                className="w-full py-6 flex items-center justify-between text-left group outline-none"
              >
                <span className={`text-base font-medium transition-colors duration-300 ${selectedItem === idx ? 'text-[#8B5CF6]' : 'text-[#18181B] group-hover:text-[#8B5CF6]'}`}>
                  {faq.title}
                </span>
                <div className={`transition-transform duration-500 ${selectedItem === idx ? 'rotate-180' : 'rotate-0'}`}>
                  {selectedItem === idx ? (
                    <Minus className="w-5 h-5 text-[#8B5CF6]" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </button>

              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  selectedItem === idx ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-sm text-[#71717A] font-light leading-relaxed pr-12">
                  {faq.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-[#A1A1AA]">
          Butuh bantuan lebih lanjut? 
          <a href="/contact" className="ml-2 text-[#18181B] font-medium hover:text-[#8B5CF6] transition-colors">
            Hubungi Kami
          </a>
        </div>

      </div>
    </section>
  );
}