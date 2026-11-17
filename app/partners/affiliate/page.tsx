"use client";

import React from 'react';
import { Handshake, TrendingUp, Shield, Zap, CheckCircle, ArrowRight, DollarSign, Users, Target } from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/GlobalNavbar';
import MinimalFooter from '@/components/MinimalFooter';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const benefits = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Komisi Menarik',
    description: 'Dapatkan komisi dari setiap penjualan yang berhasil melalui link affiliate Anda.'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Analytics Real-time',
    description: 'Pantau performa affiliate Anda dengan dashboard analytics yang lengkap.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Marketing Assets',
    description: 'Akses konten marketing siap pakai untuk promosi (hanya Pro member).'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Support',
    description: 'Bergabung dengan community affiliate untuk berbagi tips dan strategi.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure Platform',
    description: 'Platform yang aman dan terpercaya untuk mengelola bisnis affiliate Anda.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Target Audience',
    description: 'Jangkau audience yang tepat dengan produk berkualitas dari merchant terpercaya.'
  }
];

const steps = [
  {
    step: '1',
    title: 'Daftar Akun',
    description: 'Buat akun gratis di Rysee dalam hitungan detik.'
  },
  {
    step: '2',
    title: 'Pilih Produk',
    description: 'Jelajahi katalog produk dan pilih yang sesuai dengan niche Anda.'
  },
  {
    step: '3',
    title: 'Buat Toko',
    description: 'Buat toko affiliate custom dan tambahkan produk pilihan Anda.'
  },
  {
    step: '4',
    title: 'Promosikan',
    description: 'Share link affiliate Anda dan mulai dapatkan komisi.'
  }
];

const faqs = [
  {
    q: 'Apa itu Affiliate Program Rysee?',
    a: 'Affiliate Program Rysee adalah program yang memungkinkan Anda untuk mempromosikan produk digital dari merchant dan mendapatkan komisi dari setiap penjualan yang berhasil.'
  },
  {
    q: 'Berapa komisi yang bisa saya dapatkan?',
    a: 'Komisi bervariasi tergantung produk dan merchant. Rata-rata komisi berkisar antara 10-30% dari harga produk.'
  },
  {
    q: 'Apakah ada biaya untuk bergabung?',
    a: 'Tidak, bergabung sebagai affiliate Rysee gratis. Anda hanya perlu membuat akun dan mulai mempromosikan produk.'
  },
  {
    q: 'Bagaimana cara pembayaran komisi?',
    a: 'Komisi akan ditransfer ke rekening Anda setelah mencapai minimum payout. Detail pembayaran akan diinformasikan di dashboard.'
  },
  {
    q: 'Apakah saya perlu website sendiri?',
    a: 'Tidak perlu. Rysee menyediakan toko affiliate yang bisa Anda custom sesuai kebutuhan. Cukup share link affiliate Anda.'
  }
];

export default function AffiliateProgramPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      {/* Hero Section */}
      <section className="px-8 py-20 bg-white border-b border-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F9FB] rounded-full mb-6">
            <Handshake className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-medium tracking-wider text-[#8B5CF6]">AFFILIATE PROGRAM</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#18181B] mb-4">
            Mulai Hasilkan Komisi dengan Rysee
          </h1>
          <p className="text-base text-[#A1A1AA] mb-8 max-w-2xl mx-auto">
            Bergabung dengan program affiliate kami dan promosikan produk digital berkualitas. Dapatkan komisi menarik dari setiap penjualan yang berhasil.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/affstore"
              className="px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium tracking-wider hover:opacity-90 transition"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="/help"
              className="px-8 py-3 bg-white border border-gray-50 text-[#18181B] rounded-full text-sm font-medium tracking-wider hover:bg-gray-50 transition"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light tracking-tight text-[#18181B] mb-3">
              Mengapa Bergabung?
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-50 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#8B5CF6] mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-sm font-medium tracking-wider text-[#18181B] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 bg-white border-t border-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light tracking-tight text-[#18181B] mb-3">
              Cara Kerja
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center text-white text-xl font-medium mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-sm font-medium tracking-wider text-[#18181B] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light tracking-tight text-[#18181B] mb-3">
              Pertanyaan Umum
            </h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-50 p-6">
                <h3 className="text-sm font-medium tracking-wider text-[#18181B] mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-light tracking-tight mb-4">
            Siap Mulai Hasilkan Komisi?
          </h2>
          <p className="text-base font-light opacity-90 mb-8">
            Bergabung dengan ribuan affiliate lain dan mulai promosikan produk digital berkualitas hari ini.
          </p>
          <Link
            href="/affstore"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#8B5CF6] rounded-full text-sm font-medium tracking-wider hover:bg-white/90 transition"
          >
            Daftar Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
