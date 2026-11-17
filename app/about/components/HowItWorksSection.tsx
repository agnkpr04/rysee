"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const registrationSteps = [
    {
      step: "01",
      title: "Register & Login",
      description: "Daftar dan login via Supabase Auth untuk mulai menggunakan platform."
    },
    {
      step: "02",
      title: "Pilih Produk",
      description: "Browse master catalog dan pilih produk untuk ditambahkan ke toko kamu."
    },
    {
      step: "03",
      title: "Customize Store",
      description: "Edit nama, deskripsi, logo, dan theme colors toko affiliate kamu."
    },
    {
      step: "04",
      title: "Share & Earn",
      description: "Share link toko ke customer dan dapatkan komisi dari setiap penjualan."
    }
  ];

  const customerSteps = [
    {
      step: "01",
      title: "Dapatkan Link",
      description: "Customer dapat link toko affiliate dari social media atau direct share."
    },
    {
      step: "02",
      title: "Browse Produk",
      description: "Customer browse produk di toko affiliate yang dikunjungi."
    },
    {
      step: "03",
      title: "Klik Affiliate Link",
      description: "Customer klik link untuk redirect ke Shopee/TikTok dan berbelanja."
    },
    {
      step: "04",
      title: "Affiliator Dapat Komisi",
      description: "Setiap penjualan lewat link memberikan komisi ke affiliator."
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-[#18181B] mb-3">
          Cara Kerja
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        {/* Affiliator Flow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-medium text-[#18181B] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center">
              <span className="text-white text-xs font-medium">A</span>
            </span>
            Untuk Affiliator
          </h3>
          <div className="space-y-4">
            {registrationSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#F9F9FB] border border-gray-50 flex items-center justify-center">
                    <span className="text-xs font-medium text-[#8B5CF6]">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1 pb-4 border-l border-gray-100 pl-4">
                  <h4 className="text-sm font-medium text-[#18181B] mb-1">{step.title}</h4>
                  <p className="text-xs font-light text-[#A1A1AA]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Flow */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-medium text-[#18181B] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#D946EF] to-[#EC4899] flex items-center justify-center">
              <span className="text-white text-xs font-medium">C</span>
            </span>
            Untuk Customer
          </h3>
          <div className="space-y-4">
            {customerSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#F9F9FB] border border-gray-50 flex items-center justify-center">
                    <span className="text-xs font-medium text-[#D946EF]">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1 pb-4 border-l border-gray-100 pl-4">
                  <h4 className="text-sm font-medium text-[#18181B] mb-1">{step.title}</h4>
                  <p className="text-xs font-light text-[#A1A1AA]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
