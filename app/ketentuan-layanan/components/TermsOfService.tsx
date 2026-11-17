"use client";

import React from 'react';
import { ShieldCheck, Scale, FileText, Lock, Gift } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "29 Mei 2026";

  const sections = [
    {
      title: "Persetujuan Ketentuan",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: "Dengan mengakses dan menggunakan layanan Rysee, Anda secara otomatis menyetujui untuk terikat oleh ketentuan layanan ini. Rysee adalah platform digital yang menyediakan akses ke katalog digital products (ebook, template, website) dengan sistem 3-tier membership dan program referral."
    },
    {
      title: "Ruang Lingkup Layanan",
      icon: <FileText className="w-5 h-5" />,
      content: "Layanan Rysee mencakup: (1) Akses ke katalog digital products untuk dijual di toko Anda, (2) Pembuatan toko digital custom dengan kustomisasi tema, (3) Analytics performa toko dan produk, (4) Akses konten marketing (Konten Kit) untuk membership Pro dan Premium, (5) Program referral dengan komisi berbasis matrix tier. Semua fitur mengikuti ketentuan membership (Free, Pro, Premium)."
    },
    {
      title: "Struktur Membership & Biaya",
      icon: <Scale className="w-5 h-5" />,
      content: "Rysee menawarkan 3 tier membership: Free (Rp 0), Pro (Rp 49.000 sekali bayar), dan Premium (Rp 99.000 sekali bayar). Biaya Rp 99.000 untuk Premium adalah pembelian layanan/produk berupa lisensi akses toko digital dengan semua keuntungan termasuk fitur premium, support priority, dan aset konten lengkap. Ini adalah transaksi pembelian layanan nyata dengan value yang jelas, bukan investasi atau skema bagi hasil."
    },
    {
      title: "Komisi Produk Digital",
      icon: <Scale className="w-5 h-5" />,
      content: "Affiliator mendapat komisi dari penjualan digital products (ebook, template, website) berdasarkan tier membership: Free (20%), Pro (30%), Premium (40%). Komisi ini adalah hadiah sales atas keberhasilan affiliator dalam melakukan akuisisi pembeli ke ekosistem Rysee, bukan bagi hasil investasi. Platform mempertahankan bagian platform fee untuk operasional."
    },
    {
      title: "Biaya Platform & Transparansi",
      icon: <Scale className="w-5 h-5" />,
      content: "Biaya platform yang diperoleh Rysee dari setiap transaksi digunakan secara transparan untuk: (1) Biaya operasional dan maintenance sistem, (2) Hosting dan infrastruktur server, (3) Pengembangan fitur baru dan improvement, (4) Support dan layanan pelanggan. Ini memastikan keberlanjutan platform dan kualitas layanan bagi semua pengguna."
    },
    {
      title: "Program Referral",
      icon: <Gift className="w-5 h-5" />,
      content: "Rysee menyediakan program referral dengan komisi berbasis matrix tier. Komisi referral diberikan sebagai hadiah sales kepada referrer yang berhasil mengajak pengguna baru untuk upgrade membership. Matrix komisi: Free → Pro/Premium (Rp 10K-20K), Pro → Pro/Premium (Rp 20K-40K), Premium → Pro/Premium (Rp 30K-60K). Komisi referral dapat ditarik secara manual melalui WhatsApp/Transfer setelah disetujui admin."
    },
    {
      title: "Hak Kekayaan Intelektual",
      icon: <Scale className="w-5 h-5" />,
      content: "Digital products dalam katalog (ebook, template, website) adalah milik pemilik masing-masing. Rysee menyediakan platform untuk affiliator mempromosikan dan menjual produk tersebut. Konten marketing yang di-download (Konten Kit) sebagai benefit membership dapat digunakan untuk promosi sesuai ketentuan yang berlaku. Pengguna tidak memiliki hak atas intellectual property produk digital, hanya hak lisensi untuk menjual."
    },
    {
      title: "Privasi dan Keamanan Data",
      icon: <Lock className="w-5 h-5" />,
      content: "Kami menjaga kerahasiaan data akun dan toko digital Anda dengan standar keamanan digital yang ketat. Informasi yang Anda berikan hanya digunakan untuk operasional platform dan tidak akan dibagikan kepada pihak ketiga tanpa izin tertulis. Data transaksi dan earnings disimpan dengan enkripsi dan proteksi yang memadai."
    },
    {
      title: "Pembayaran & Penarikan",
      icon: <Scale className="w-5 h-5" />,
      content: "Pembayaran membership dilakukan melalui Midtrans (QRIS, GoPay, OVO, Dana, Bank Transfer). Penarikan komisi (produk digital dan referral) dilakukan secara manual melalui WhatsApp/Transfer dengan persetujuan admin. Admin berhak menyetujui atau menolak request penarikan berdasarkan verifikasi data dan kepatuhan terhadap ketentuan layanan."
    },
    {
      title: "Kebijakan Refund",
      icon: <Scale className="w-5 h-5" />,
      content: "Karena membership Rysee adalah pembelian layanan digital dengan akses lifetime, refund tidak diberikan setelah akun diaktifkan dan fitur telah diakses. Pengguna disarankan untuk mempelajari fitur dan benefit sebelum melakukan upgrade. Kasus khusus dapat ditinjau oleh tim support dengan bukti yang valid."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] font-sans antialiased selection:bg-black/5">
      
      {/* Header Section */}
      <section className="px-[5%] pt-32 pb-20 border-b border-black/[0.03]">
        <div className="max-w-4xl">
          <span className="text-[12px] font-medium tracking-widest text-black/40 uppercase mb-6 block">
            Legal Documentation
          </span>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight mb-8">
            Ketentuan Layanan
          </h1>
          <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed max-w-2xl">
            Standar operasional dan komitmen legal Rysee untuk memastikan transparansi, profesionalisme, dan kejelasan dalam setiap transaksi layanan digital dan program referral.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-[5%] py-20 md:py-32">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-[#F9F9F9] rounded-3xl border border-black/[0.02]">
              <p className="text-sm text-black/40 mb-2">Terakhir diperbarui</p>
              <p className="text-base font-medium">{lastUpdated}</p>
              <div className="h-[1px] w-full bg-black/5 my-6" />
              <p className="text-sm text-black/60 leading-relaxed">
                Ketentuan ini berlaku untuk seluruh affiliator yang menggunakan platform Rysee.
              </p>
            </div>
          </div>

          {/* Clauses List */}
          <div className="lg:col-span-8 flex flex-col gap-12 md:gap-20">
            {sections.map((section, index) => (
              <div key={index} className="group border-b border-black/[0.05] pb-12 last:border-0">
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex w-12 h-12 items-center justify-center rounded-full bg-black/[0.02] text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-6">
                      {section.title}
                    </h2>
                    <p className="text-base md:text-lg text-black/50 leading-relaxed font-light">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer Contact */}
      <section className="px-[5%] py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ada pertanyaan mengenai ketentuan ini?</h2>
          <p className="text-white/60 mb-10 font-light">Tim legal kami siap membantu menjelaskan detail teknis yang Anda butuhkan.</p>
          <a 
            href="https://wa.me/6282218455821" 
            className="inline-block px-10 py-4 bg-white text-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-all active:scale-95"
          >
            Hubungi Konsultan
          </a>
        </div>
      </section>

      {/* Copyright Footer */}
      <footer className="px-[5%] py-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-black/[0.03]">
        <span className="text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">
          Rysee 2026 — Indonesia
        </span>
        <div className="flex gap-8 text-[10px] font-bold text-black/40 tracking-widest uppercase">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Cookies</a>
        </div>
      </footer>

    </div>
  );
};

export default TermsOfService;