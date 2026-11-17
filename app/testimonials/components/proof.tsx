"use client";

import React, { useState } from 'react';
import { CheckCircle, TrendingUp, Layout, Users } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface ProofGalleryProps {
  activeContext: 'affiliate' | 'referral';
  setActiveContext: (context: 'affiliate' | 'referral') => void;
}

const proofData = {
  affiliate: [
    {
      label: "Monthly Payout",
      amount: "Verified",
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop",
    },
    {
      label: "Daily Earnings",
      amount: "Active",
      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
    },
    {
      label: "Store Clicks",
      amount: "Growing",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    }
  ],
  referral: [
    {
      label: "Total Withdrawal",
      amount: "Verified",
      src: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=800&fit=crop",
    },
    {
      label: "Bonus Referral",
      amount: "Per Invite",
      src: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=600&h=400&fit=crop",
    },
    {
      label: "Member Active",
      amount: "Growing",
      src: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
    }
  ]
};

export default function ProofGallery({ activeContext, setActiveContext }: ProofGalleryProps) {
  const currentProof = proofData[activeContext];
  const mainProof = currentProof[0];
  const subProofs = currentProof.slice(1);

  return (
    <section className="py-24 bg-[#18181B]">
      <div className="max-w-6xl mx-auto px-8">
        
        {/* Header & Toggle */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-4 text-[#8B5CF6]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Visual Evidence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white mb-8">
            Bukti <span className="italic font-serif">Nyata</span> di Lapangan.
          </h2>

          <div className="inline-flex p-1 bg-[#27272A] border border-gray-700/50 rounded-full">
            <button 
              type="button"
              onClick={() => setActiveContext('affiliate')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${activeContext === 'affiliate' ? `bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20` : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Layout className="w-3 h-3" /> Affiliate
            </button>
            <button 
              type="button"
              onClick={() => setActiveContext('referral')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${activeContext === 'referral' ? `bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20` : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Users className="w-3 h-3" /> Referral
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Large Card */}
          {mainProof && (
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-gray-700/50 h-[500px]">
              <img 
                src={mainProof.src} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt={mainProof.label}
              />
            </div>
          )}

          {/* Small Cards Column */}
          <div className="grid grid-rows-2 gap-4">
            {subProofs.map((item, index) => (
              <div key={`${activeContext}-sub-${index}`} className="relative group overflow-hidden rounded-[2.5rem] border border-gray-700/50">
                <img 
                  src={item.src} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Verification Note */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gray-800"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-[#D946EF]" />
            <span className="text-[10px] font-medium text-gray-400 tracking-[0.1em] uppercase">Semua bukti telah melalui proses verifikasi admin Rysee</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-800"></div>
        </div>
      </div>
    </section>
  );
}