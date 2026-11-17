"use client";

import { motion } from 'framer-motion';
import { Package, Palette, Download, BarChart3, Crown, Share2, FolderOpen } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Package,
      title: "Katalog Produk",
      description: "Akses ke katalog produk lengkap dari Rysee dengan filter dan search."
    },
    {
      icon: FolderOpen,
      title: "Koleksi Produk",
      description: "Atur koleksi produk anda dengan mudah di profile dashboard."
    },
    {
      icon: Palette,
      title: "Kustomisasi Toko",
      description: "Customize nama, deskripsi, logo, dan theme colors toko affiliate kamu."
    },
    {
      icon: Download,
      title: "Download Konten",
      description: "Bebas Download images/videos siap pakai untuk konten."
    },
    {
      icon: Share2,
      title: "Program Referral",
      description: "Dapatkan penghasilan tambahan dengan mengajak teman bergabung ke Rysee."
    },
    {
      icon: Crown,
      title: "Peringkat Leaderboard",
      description: "Showcase top affiliator untuk motivasi dan kompetisi sehat."
    },
    {
      icon: Share2,
      title: "Share Social Media",
      description: "Share toko affiliate ke social media dengan mudah."
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
          Fitur Utama
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="bg-white border border-gray-50 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F9F9FB] border border-gray-50 flex items-center justify-center mb-4">
              <feature.icon className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-medium text-[#18181B] mb-2">{feature.title}</h3>
            <p className="text-xs font-light text-[#A1A1AA] leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
