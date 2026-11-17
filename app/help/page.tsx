"use client";

import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import GlobalNavbar from '@/components/GlobalNavbar';
import MinimalFooter from '@/components/MinimalFooter';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const WHATSAPP_LINK = "https://wa.me/6282218455821?text=Halo%20Agung,%20saya%20butuh%20bantuan";

const faqCategories = [
  {
    id: 'payment',
    name: 'Payment & Billing',
    icon: <HelpCircle className="w-4 h-4" />,
    questions: [
      {
        q: 'Metode pembayaran apa yang tersedia?',
        a: 'Kami menerima pembayaran via Midtrans (QRIS, GoPay, OVO, Dana, BCA, Mandiri, BRI, dan lainnya). Pembayaran diproses otomatis dan instan.'
      },
      {
        q: 'Berapa lama konfirmasi pembayaran diproses?',
        a: 'Pembayaran via Midtrans diproses otomatis dalam hitungan detik. Setelah pembayaran berhasil, membership Anda akan langsung aktif.'
      },
      {
        q: 'Bagaimana jika pembayaran gagal?',
        a: 'Cek koneksi internet dan pastikan saldo mencukupi. Jika masih gagal, hubungi support via WhatsApp dengan bukti transfer.'
      },
      {
        q: 'Apakah ada biaya admin tambahan?',
        a: 'Tidak ada biaya admin tambahan. Harga yang tertera adalah harga final yang harus dibayar.'
      },
      {
        q: 'Apakah membership berlangganan atau sekali bayar?',
        a: 'Membership Rysee bersifat one-time payment (sekali bayar, lifetime access). Tidak ada biaya perpanjangan bulanan atau tahunan.'
      }
    ]
  },
  {
    id: 'commission',
    name: 'Commission & Earnings',
    icon: <HelpCircle className="w-4 h-4" />,
    questions: [
      {
        q: 'Berapa persen komisi yang saya dapatkan dari digital products?',
        a: 'Komisi digital products ditentukan oleh tier membership Anda: Free 20%, Pro 30%, Premium 40% dari harga produk.'
      },
      {
        q: 'Berapa komisi referral yang saya dapatkan?',
        a: 'Komisi referral menggunakan matrix tier: Free dapat Rp 10K, Pro dapat Rp 20K-40K, Premium dapat Rp 30K-60K tergantung tier yang direfer.'
      },
      {
        q: 'Kapan komisi dibayarkan?',
        a: 'Komisi digital products dibayarkan setelah order disetujui oleh admin. Komisi referral dibayarkan setelah referred user berhasil upgrade membership.'
      },
      {
        q: 'Bagaimana cara melihat total earnings?',
        a: 'Anda dapat melihat total earnings di tab Earnings di Profile dashboard Anda.'
      },
      {
        q: 'Bagaimana cara withdraw komisi?',
        a: 'Withdraw dilakukan secara manual via WhatsApp atau transfer bank. Ajukan request withdraw di dashboard, dan admin akan memprosesnya setelah verifikasi.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Issues',
    icon: <HelpCircle className="w-4 h-4" />,
    questions: [
      {
        q: 'Bagaimana jika saya mengalami error?',
        a: 'Refresh halaman terlebih dahulu. Jika error berlanjut, coba clear browser cache atau gunakan browser lain. Hubungi support jika masih berlanjut.'
      },
      {
        q: 'Browser apa yang didukung?',
        a: 'Kami mendukung Chrome, Firefox, Safari, dan Edge versi terbaru. Pastikan browser Anda selalu diupdate.'
      },
      {
        q: 'Apakah data saya aman?',
        a: 'Ya, kami menggunakan enkripsi standar industri untuk melindungi data Anda. Data Anda tidak akan dibagikan kepada pihak ketiga tanpa izin.'
      },
      {
        q: 'Bagaimana jika saya lupa password?',
        a: 'Klik "Forgot Password" di halaman login, masukkan email Anda, dan ikuti instruksi reset password yang dikirim ke email.'
      }
    ]
  },
  {
    id: 'policies',
    name: 'Policies',
    icon: <HelpCircle className="w-4 h-4" />,
    questions: [
      {
        q: 'Apakah saya bisa membatalkan membership?',
        a: 'Membership Rysee bersifat one-time payment (sekali bayar, lifetime access). Setelah upgrade, Anda akan memiliki akses penuh selamanya tanpa perpanjangan. Tidak ada refund.'
      },
      {
        q: 'Bagaimana kebijakan penggunaan content assets?',
        a: 'Content assets yang didownload hanya boleh digunakan untuk promosi produk Rysee. Dilarang menjual assets tersebut.'
      },
      {
        q: 'Apakah toko saya dapat dilihat publik?',
        a: 'Ya, toko Anda bersifat publik dan dapat diakses oleh siapa saja melalui link toko Anda. Namun, Dashboard Anda bersifat privat.'
      },
      {
        q: 'Berapa batas produk yang bisa saya tambahkan?',
        a: 'Free: 15 produk, Pro: 100 produk, Premium: Unlimited produk. Semua tier memiliki unlimited stok per produk.'
      }
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-[#18181B] mb-3">
            Help Center
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          <p className="text-sm font-light text-[#A1A1AA]">
            Temukan jawaban untuk pertanyaan umum tentang Rysee
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-50 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] transition"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F9F9FB] flex items-center justify-center text-[#8B5CF6]">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium tracking-wider">{category.name}</span>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-4 h-4 text-[#A1A1AA]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                )}
              </button>

              {expandedCategory === category.id && (
                <div className="px-6 pb-4 border-t border-gray-50">
                  <div className="space-y-3 pt-4">
                    {category.questions.map((item, index) => (
                      <div key={index} className="border border-gray-50 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedQuestion(expandedQuestion === `${category.id}-${index}` ? null : `${category.id}-${index}`)}
                          className="w-full px-4 py-3 text-left text-xs font-medium text-[#18181B] hover:bg-gray-50 transition flex items-center justify-between"
                        >
                          {item.q}
                          {expandedQuestion === `${category.id}-${index}` ? (
                            <ChevronUp className="w-3 h-3 text-[#A1A1AA]" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-[#A1A1AA]" />
                          )}
                        </button>
                        {expandedQuestion === `${category.id}-${index}` && (
                          <div className="px-4 py-3 bg-[#F9F9FB] text-xs text-[#A1A1AA] leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#A1A1AA]">Tidak ada hasil untuk pencarian Anda.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-[#18181B] mb-4">Masih butuh bantuan?</p>
          <div className="flex items-center justify-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white rounded-full text-xs font-medium tracking-wider hover:bg-[#7C3AED] transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
}
