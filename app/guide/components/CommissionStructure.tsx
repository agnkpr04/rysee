"use client";

import { motion } from 'framer-motion';
import { TrendingUp, Gift, Crown, Sparkles } from 'lucide-react';

export default function CommissionStructure() {
  const tiers = [
    {
      name: 'Free',
      digitalCommission: '20%',
      templateCommission: '15%',
      referPremium: 'Rp 12K',
      color: 'text-[#A1A1AA]'
    },
    {
      name: 'Premium',
      digitalCommission: '80%',
      templateCommission: '35%',
      referPremium: 'Rp 50K',
      color: 'text-[#FBBF24]',
      icon: <Crown className="w-4 h-4" strokeWidth={1.5} />
    }
  ];

  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-[#F9F9FB]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#18181B] mb-4">
            Struktur <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Komisi</span>
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] font-light max-w-2xl mx-auto">
            Semakin tinggi tier membership Anda, semakin besar komisi yang didapat
          </p>
        </motion.div>

        {/* Product Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-gray-50 shadow-sm mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-[#18181B]">Komisi Penjualan Produk</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-[#F9F9FB] rounded-xl p-4 border ${
                  tier.name === 'Premium' ? 'border-[#FBBF24]/30' : 'border-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {tier.icon}
                  <span className={`font-semibold ${tier.color}`}>{tier.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#A1A1AA]">Produk Digital</span>
                    <span className={`text-sm font-bold ${tier.color}`}>{tier.digitalCommission}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#A1A1AA]">Jasa Website</span>
                    <span className={`text-sm font-bold ${tier.color}`}>{tier.templateCommission}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Referral Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#FBBF24]/5 rounded-2xl p-6 md:p-8 border border-[#8B5CF6]/10"
        >
          <div className="flex items-center gap-2 mb-6">
            <Gift className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-[#18181B]">Komisi Referral</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 border ${
                  tier.name === 'Premium' ? 'border-[#FBBF24]/30' : 'border-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {tier.icon}
                  <span className={`font-semibold ${tier.color}`}>{tier.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#A1A1AA]">Refer ke Premium</span>
                    <span className={`text-sm font-bold ${tier.color}`}>{tier.referPremium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-[#A1A1AA] mt-4 text-center">
            Komisi referral dapat ditarik manual via WhatsApp • Tanpa minimum penarikan
          </p>
        </motion.div>
      </div>
    </section>
  );
}
