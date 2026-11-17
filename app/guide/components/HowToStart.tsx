"use client";

import { motion } from 'framer-motion';
import { Plus, Share2, Wallet, ArrowRight, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HowToStart() {
  const steps = [
    {
      icon: <Plus className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />,
      title: 'Daftar & Login',
      description: 'Buat akun gratis di Rysee. Tidak perlu kartu kredit atau pembayaran untuk memulai.'
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-[#D946EF]" strokeWidth={1.5} />,
      title: 'Pilih Produk',
      description: 'Browse katalog produk digital dan jasa website. Pilih yang sesuai dengan niche Anda.'
    },
    {
      icon: <Plus className="w-6 h-6 text-[#EC4899]" strokeWidth={1.5} />,
      title: 'Add ke Toko',
      description: 'Klik tombol "Add to Store" pada produk yang Anda pilih. Produk akan muncul di toko Anda.'
    },
    {
      icon: <Share2 className="w-6 h-6 text-[#FBBF24]" strokeWidth={1.5} />,
      title: 'Share Link',
      description: 'Copy link toko Anda dan share ke Instagram, TikTok, WhatsApp, atau media sosial lainnya.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />,
      title: 'Mulai Jualan',
      description: 'Setiap penjualan melalui link Anda akan memberikan komisi sesuai tier membership Anda.'
    },
    {
      icon: <Wallet className="w-6 h-6 text-[#D946EF]" strokeWidth={1.5} />,
      title: 'Tarik Komisi',
      description: 'Komisi akan cair ke akun Anda. Tarik kapan saja via WhatsApp tanpa minimum.'
    }
  ];

  return (
    <section className="w-full px-4 md:px-8 py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#18181B] mb-4">
            Mulai Jualan dalam <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">6 Langkah</span>
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] font-light max-w-2xl mx-auto">
            Proses sederhana untuk memulai bisnis digital tanpa modal stok
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-[#F9F9FB] rounded-2xl p-6 border border-gray-50 h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full">
                        Langkah {index + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-[#18181B] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#A1A1AA] font-light">{step.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#A1A1AA]">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-8 py-4 rounded-full hover:opacity-90 transition-all font-medium text-sm md:text-base shadow-lg shadow-[#8B5CF6]/20"
          >
            Upgrade untuk Komisi Lebih Tinggi
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <p className="text-xs text-[#A1A1AA] mt-3 font-light">
            Free user dapat mulai jualan sekarang tanpa biaya
          </p>
        </motion.div>
      </div>
    </section>
  );
}
