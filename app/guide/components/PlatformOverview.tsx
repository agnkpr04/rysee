"use client";

import { motion } from 'framer-motion';
import { ShoppingBag, Globe, TrendingUp, Users } from 'lucide-react';

export default function PlatformOverview() {
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
            Cara Kerja <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Rysee</span>
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] font-light max-w-2xl mx-auto">
            Platform affiliate yang memudahkan Anda memulai bisnis digital tanpa modal stok
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <ShoppingBag className="w-8 h-8 text-[#8B5CF6]" strokeWidth={1.5} />,
              title: 'Pilih Produk',
              description: 'Pilih produk digital dan jasa website yang ingin Anda jual dari katalog kami.'
            },
            {
              icon: <Globe className="w-8 h-8 text-[#D946EF]" strokeWidth={1.5} />,
              title: 'Add ke Toko',
              description: 'Tambahkan produk ke toko Anda dengan satu klik. Tidak perlu stok barang.'
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-[#EC4899]" strokeWidth={1.5} />,
              title: 'Mulai Jualan',
              description: 'Share link toko Anda dan mulai jualan. Dapatkan komisi dari setiap penjualan.'
            },
            {
              icon: <Users className="w-8 h-8 text-[#FBBF24]" strokeWidth={1.5} />,
              title: 'Dapat Komisi',
              description: 'Komisi langsung cair ke akun Anda. Semakin banyak jual, semakin besar income.'
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#F9F9FB] rounded-2xl p-6 border border-gray-50"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-lg font-medium text-[#18181B] mb-2">{step.title}</h3>
              <p className="text-sm text-[#A1A1AA] font-light">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
