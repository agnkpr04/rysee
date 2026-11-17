"use client";

import React, { useState } from 'react';
import { BookOpen, ArrowRight, Play, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/GlobalNavbar';
import MinimalFooter from '@/components/MinimalFooter';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const guides = [
  {
    id: 1,
    title: 'Cara Membuat Akun',
    description: 'Langkah demi langkah membuat akun Rysee dan memulai perjalanan digital product seller Anda.',
    category: 'Getting Started',
    icon: <CheckCircle className="w-5 h-5" />,
    steps: [
      'Klik tombol "Join" di navbar',
      'Masukkan email Anda',
      'Akun dan toko anda otomatis terdaftar dengan nama default Google',
      'Anda dapat mengubahnya di Profile setting kapan saja',
      'Anda dapat melihat toko anda di Profile',
      'Anda dapat langsung Mulai jelajahi produk'
    ],
    readTime: '3 min'
  },
  {
    id: 2,
    title: 'Cara Membuat Toko',
    description: 'Panduan lengkap membuat toko custom dan menambahkan produk pertama Anda.',
    category: 'Getting Started',
    icon: <BookOpen className="w-5 h-5" />,
    steps: [
      'Login akan secara otomatis membuat toko',
      'Klik Profil dan pilih "Store" untuk melihatnya',
      'Anda dapat Edit Nama & Deskripsi toko serta tampilan toko anda',
      'Logo Store akan mengikuti profile yang anda pakai',
      'Pilih tema tampilan'
    ],
    readTime: '5 min'
  },
  {
    id: 3,
    title: 'Cara Menambahkan Digital Products',
    description: 'Cara menambahkan ebook, template, dan website dari katalog digital ke toko Anda.',
    category: 'Digital Products',
    icon: <FileText className="w-5 h-5" />,
    steps: [
      'Buka halaman "Digital Products" atau dari profile pilih "Add Digital Product"',
      'Browse katalog digital products (ebook, design templates, notion templates, dll)',
      'Filter berdasarkan kategori yang Anda inginkan',
      'Klik tombol "+" pada produk yang ingin ditambahkan',
      'Produk akan tersimpan di toko Anda dan siap dijual',
      'Customer bisa langsung beli dan download dari toko Anda'
    ],
    readTime: '4 min'
  },
  {
    id: 4,
    title: 'Cara Menjual Digital Products',
    description: 'Panduan menjual ebook, template, dan website dari toko Anda.',
    category: 'Digital Products',
    icon: <BookOpen className="w-5 h-5" />,
    steps: [
      'Pastikan digital products sudah ditambahkan ke toko Anda',
      'Share link toko Anda ke social media (Instagram, TikTok, WhatsApp)',
      'Customer klik link dan pilih digital product yang diinginkan',
      'Customer akan melakukan pembayaran via Midtrans',
      'Setelah pembayaran berhasil, customer bisa download produk',
      'Anda mendapat komisi sesuai tier membership (20%/30%/40%)'
    ],
    readTime: '5 min'
  },
  {
    id: 5,
    title: 'Cara Upgrade ke Pro/Premium',
    description: 'Panduan upgrade membership untuk akses fitur premium dan unlimited produk.',
    category: 'Membership',
    icon: <CheckCircle className="w-5 h-5" />,
    steps: [
      'Klik tombol "Upgrade" di navbar atau di halaman pricing',
      'Review benefit dan harga (Pro Rp 49.000, Premium Rp 99.000)',
      'Pilih plan yang Anda inginkan',
      'Pilih metode pembayaran (Midtrans: QRIS, GoPay, OVO, Dana, Bank Transfer)',
      'Selesaikan pembayaran - otomatis diproses dalam hitungan detik',
      'Membership Anda akan langsung aktif setelah pembayaran berhasil'
    ],
    readTime: '3 min'
  }
];

export default function GuidesPage() {
  const categories = ['All', ...Array.from(new Set(guides.map(g => g.category)))];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [expandedGuide, setExpandedGuide] = React.useState<number | null>(null);

  const filteredGuides = selectedCategory === 'All' 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  const toggleGuide = (id: number) => {
    setExpandedGuide(expandedGuide === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-[#18181B] mb-3">
            Guides & Tutorials
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          <p className="text-sm font-light text-[#A1A1AA]">
            Panduan lengkap cara menggunakan platform Rysee
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider transition ${
                selectedCategory === category
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-white text-[#A1A1AA] hover:text-[#18181B] border border-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl border border-gray-50 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#8B5CF6]">
                  {guide.icon}
                </div>
                <span className="text-[10px] font-medium tracking-wider text-[#A1A1AA] bg-[#F9F9FB] px-3 py-1 rounded-full">
                  {guide.readTime}
                </span>
              </div>
              
              <h3 className="text-sm font-medium tracking-wider text-[#18181B] mb-2">
                {guide.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed">
                {guide.description}
              </p>
              
              <div className="mb-4">
                <p className="text-[10px] font-medium tracking-wider text-[#8B5CF6] mb-2">
                  {guide.category}
                </p>
                <div className="space-y-2">
                  {(expandedGuide === guide.id ? guide.steps : guide.steps.slice(0, 1)).map((step, index) => (
                    <div key={index} className="flex items-start gap-2 text-[10px] text-[#18181B] leading-relaxed">
                      <span className="text-[#8B5CF6] font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                  {guide.steps.length > 1 && expandedGuide !== guide.id && (
                    <button
                      onClick={() => toggleGuide(guide.id)}
                      className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition font-medium"
                    >
                      Lihat selengkapnya
                    </button>
                  )}
                  {guide.steps.length > 1 && expandedGuide === guide.id && (
                    <button
                      onClick={() => toggleGuide(guide.id)}
                      className="text-[10px] text-[#8B5CF6] hover:text-[#7C3AED] transition font-medium"
                    >
                      Tutup
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium tracking-wider mb-2">Baru di Rysee?</h3>
              <p className="text-sm font-light opacity-90">
                Mulai dengan panduan Quick Start untuk pemula
              </p>
            </div>
            <Link
              href="/affstore"
              className="px-6 py-3 bg-white text-[#8B5CF6] rounded-full text-xs font-medium tracking-wider hover:bg-white/90 transition"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
}
