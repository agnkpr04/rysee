"use client";

import { motion } from 'framer-motion';
import { Download, Smartphone, Zap, Clock } from 'lucide-react';

export default function ContentAssetsSection() {
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
          Stop Pusing Mikirin Konten
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        {/* Before - Problem */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-50 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-[#18181B]">Masalah Biasa</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Gallery HP penuh dengan konten tidak terorganisir</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Susah cari konten untuk produk tertentu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Bikin konten dari nol memakan waktu (shooting, editing)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Storage penuh, harus hapus konten lama</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Tampilan Online collection shop kurang menarik</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-[#71717A]">Pusing mengatur link per produk dan mentahan</span>
            </li>
          </ul>
        </motion.div>

        {/* After - Solution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-white">Solusi Rysee</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-white">Link produk & assets siap pakai per produk</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-white">Bebas Download saat mau post doang juga bisa</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-white">Tidak perlu simpan asset konten di gallery HP</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-white">Kustomisasi tampilan toko sesuai selera</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></span>
              <span className="text-sm font-light text-white">Link dan mentahan terorganisir Rapih per produk di profile anda</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm text-center"
        >
          <div className="w-12 h-12 rounded-lg bg-[#F9F9FB] border border-gray-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
          </div>
          <h4 className="text-base font-medium text-[#18181B] mb-2">Hemat Waktu</h4>
          <p className="text-xs font-light text-[#A1A1AA]">Tidak perlu shooting & editing, tinggal download & post</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm text-center"
        >
          <div className="w-12 h-12 rounded-lg bg-[#F9F9FB] border border-gray-50 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
          </div>
          <h4 className="text-base font-medium text-[#18181B] mb-2">Hemat Storage</h4>
          <p className="text-xs font-light text-[#A1A1AA]">HP tidak penuh, download saat butuh saja</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm text-center"
        >
          <div className="w-12 h-12 rounded-lg bg-[#F9F9FB] border border-gray-50 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
          </div>
          <h4 className="text-base font-medium text-[#18181B] mb-2">Scalable</h4>
          <p className="text-xs font-light text-[#A1A1AA]">Bisa post lebih sering tanpa bottleneck konten</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12"
      >
        <p className="text-sm font-light text-[#71717A] mb-4">
          Fokus ke traffic & engagement, kami yang sediakan kontennya
        </p>
        <a
          href="#pricing"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Lihat Membership
        </a>
      </motion.div>
    </section>
  );
}
