"use client";

import { motion } from 'framer-motion';
import { Store, Users, Zap } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function ConceptSection() {
  const concepts = [
    {
      icon: Store,
      title: "Katalog Produk",
      description: "Rysee menyediakan katalog produk yang sudah dikurasi dan siap untuk dipilih oleh affiliator."
    },
    {
      icon: Users,
      title: "Platform Affiliate",
      description: "Bukan marketplace biasa. Kami menghubungkan affiliator dengan produk untuk membuat toko affiliate custom."
    },
    {
      icon: Zap,
      title: "Tanpa Stok",
      description: "Affiliator tidak perlu stok produk sendiri. Cukup pilih, branding, dan share link untuk mulai berjualan."
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
          Konsep Utama
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {concepts.map((concept, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white border border-gray-50 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center mb-4">
              <concept.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-[#18181B] mb-2">{concept.title}</h3>
            <p className="text-sm font-light text-[#A1A1AA] leading-relaxed">{concept.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
