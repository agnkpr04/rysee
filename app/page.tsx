// BACKUP: Original homepage with StoreSection
// import React from "react";
// import StoreSection from "./affstore/components/StoreSection";
// import { prisma } from "@/lib/prisma";
//
// export const metadata = {
//   title: "Rysee | Solusi digital untuk personal atau bisnis",
//   description: "Toko dan jasa digital – Hubungi kami untuk konsultasi lebih lanjut tentang kebutuhan digital anda",
// };
//
// export default async function Home() {
//   const products = await prisma.masterProduct.findMany({
//     orderBy: { createdAt: 'desc' }
//   });
//
//   const uniqueCategories = await prisma.masterProduct.findMany({
//     where: { category: { not: null } },
//     select: { category: true },
//     distinct: ['category'],
//   });
//
//   const categories = ['All', ...uniqueCategories.map(p => p.category).filter((c): c is string => Boolean(c))];
//
//   return (
//     <main className="bg-[#0A0A0A] min-h-screen">
//       <StoreSection initialProducts={products} categories={categories} />
//     </main>
//   );
// }

"use client";

import GlobalNavbar from '@/components/GlobalNavbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Wallet, TrendingUp, Rocket, BookOpen } from 'lucide-react';

export default function Home() {

  const categories = [
    {
      id: 'templates',
      name: 'Jasa Website',
      description: 'Jasa pembuatan website profesional untuk bisnis Anda. Jual dan dapatkan komisi dari setiap penjualan.',
      imageUrl: '/images/web.jpg',
      link: '/templates',
      stats: 'Premium Website'
    },
    {
      id: 'digital-products',
      name: 'Produk Digital',
      description: 'Notion, Canva, E-books, dan lebih banyak lagi. Jual tanpa stok dan dapatkan komisi.',
      imageUrl: '/images/digital.jpg',
      link: '/digital-products',
      stats: '40+ Produk'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      {/* Hero Section */}
      <section className="w-full px-8 py-16 md:py-24 bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#EC4899]/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-light text-[#18181B] mb-4">
              Discover Premium <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Digital Products</span>
            </h1>
            <p className="text-sm md:text-base text-[#A1A1AA] font-light mb-6">
              Platform affiliate untuk jualan produk digital dan jasa website tanpa stok. Dapatkan komisi dari setiap penjualan.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-8 py-3 rounded-full hover:opacity-90 transition-all font-medium text-sm md:text-base"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#8B5CF6] px-8 py-3 rounded-full hover:bg-[#F9F9FB] transition-all font-medium text-sm md:text-base border border-[#8B5CF6]"
              >
                Pelajari Dulu
              </Link>
            </div>
          </motion.div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              >
                <Link href={category.link} className="block">
                  <div className="bg-white rounded-[3px] p-6 border border-gray-50 hover:border-[#8B5CF6] transition-all group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="relative aspect-[16/9] rounded-[3px] overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                      <Image src={category.imageUrl} alt={category.name} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
                      <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-medium text-white">{category.stats}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-light text-[#18181B] mb-2">{category.name}</h3>
                    <p className="text-xs text-[#A1A1AA] font-light">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-8 py-16 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-light text-[#18181B] mb-4">
              Kenapa <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Rysee?</span>
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] font-light">
              Platform affiliate yang memudahkan Anda memulai bisnis digital tanpa modal stok
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Wallet className="w-8 h-8 text-[#8B5CF6]" strokeWidth={1.5} />,
                title: 'Tanpa Modal Stok',
                description: 'Jual produk digital dan jasa website tanpa perlu stok barang. Akses selamanya dengan full profit tanpa resiko.'
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-[#D946EF]" strokeWidth={1.5} />,
                title: 'Komisi Tinggi',
                description: 'Dapatkan komisi hingga 80% dari produk digital dan 35% dari jasa website. Semakin banyak jual, semakin besar income.'
              },
              {
                icon: <Rocket className="w-8 h-8 text-[#EC4899]" strokeWidth={1.5} />,
                title: 'Mudah Dimulai',
                description: 'Daftar gratis, pilih produk, dan mulai jualan dalam hitungan menit. Fokus jualan tanpa perlu skill teknis atau stok.'
              },
              {
                icon: <BookOpen className="w-8 h-8 text-[#8B5CF6]" strokeWidth={1.5} />,
                title: 'Kelas Digital',
                description: 'Akses kelas konten edukasi selamanya bahkan di tier Free. Belajar strategi digital marketing, copywriting, dan promosi untuk berkembang.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              >
                <div className="bg-white rounded-[3px] p-8 border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-medium text-[#18181B] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#A1A1AA] font-light">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="w-full px-8 py-16 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-4xl font-light text-[#18181B] mb-4">
              Tingkatkan Bisnis Anda dengan <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Premium</span>
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] font-light mb-8">
              Akses semua fitur premium dan jual produk digital serta jasa website untuk dapatkan komisi tanpa modal stok
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-8 py-4 rounded-full hover:opacity-90 transition-all font-medium text-sm md:text-base"
            >
              Lihat Harga
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}