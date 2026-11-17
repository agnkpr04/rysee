"use client";

import React from 'react';
import { Eye, Database, Lock, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "6 April 2026";

  const privacySections = [
    {
      title: "Informasi yang Kami Kumpulkan",
      icon: <Eye className="w-5 h-5" />,
      content: "Kami mengumpulkan informasi akun Anda (nama, email, avatar), data toko affiliate Anda (nama toko, deskripsi, link affiliate), dan preferensi membership. Informasi ini diperlukan untuk menyediakan layanan platform affiliate dan mempersonalisasi pengalaman Anda."
    },
    {
      title: "Penggunaan Data Anda",
      icon: <Database className="w-5 h-5" />,
      content: "Data Anda digunakan untuk mengelola akun, menyimpan konfigurasi toko, menampilkan analytics performa, dan mengirim update penting terkait layanan. Rysee tidak akan pernah menjual data Anda kepada pihak ketiga tanpa izin eksplisit."
    },
    {
      title: "Keamanan Tingkat Tinggi",
      icon: <Lock className="w-5 h-5" />,
      content: "Kami menggunakan enkripsi standar industri untuk melindungi data akun dan toko Anda. Akses terhadap informasi sensitif dibatasi hanya kepada personel yang membutuhkan untuk operasional platform."
    },
    {
      title: "Transparansi dan Kendali",
      icon: <Globe className="w-5 h-5" />,
      content: "Anda memiliki kendali penuh atas data Anda. Anda dapat mengedit profil, menghapus produk dari toko, atau menonaktifkan akun kapan saja melalui halaman settings. Data Anda akan dihapus secara permanen setelah permintaan penghapusan."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0A0A0A] font-sans antialiased selection:bg-black/5">
      
      {/* Header Section */}
      <section className="px-[5%] pt-32 pb-20 border-b border-black/[0.03]">
        <div className="max-w-4xl">
          <span className="text-[12px] font-medium tracking-widest text-black/40 uppercase mb-6 block">
            Data Protection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight mb-8">
            Kebijakan Privasi
          </h1>
          <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed max-w-2xl">
            Komitmen Rysee dalam melindungi privasi dan integritas data akun affiliate Anda melalui standar keamanan informasi yang transparan.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-[5%] py-20 md:py-32">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Status */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 p-8 bg-[#F9F9F9] rounded-3xl border border-black/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-black/40">Status: Active</span>
              </div>
              <p className="text-sm text-black/40 mb-2">Terakhir diperbarui</p>
              <p className="text-base font-medium mb-6">{lastUpdated}</p>
              <p className="text-sm text-black/60 leading-relaxed">
                Kebijakan ini dirancang untuk mematuhi regulasi perlindungan data global guna memberikan rasa aman bagi klien internasional maupun domestik.
              </p>
            </div>
          </div>

          {/* Policy Clauses */}
          <div className="lg:col-span-8 flex flex-col gap-12 md:gap-20">
            {privacySections.map((section, index) => (
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
            
            {/* Additional Note */}
            <div className="mt-10 p-10 bg-black/[0.02] rounded-[2rem] border border-black/[0.03]">
              <p className="text-sm text-black/40 italic font-serif">
                "Kepercayaan Anda adalah aset paling berharga bagi Rysee. Kami tidak hanya membangun platform affiliate, tapi juga membangun rasa aman dalam setiap kolaborasi."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Contact - Same Consistency */}
      <section className="px-[5%] py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Perlu detail teknis tentang keamanan data?</h2>
          <p className="text-white/60 mb-10 font-light max-w-xl mx-auto">Kami siap menjelaskan bagaimana arsitektur sistem kami bekerja melindungi informasi akun affiliate Anda.</p>
          <a 
            href="https://wa.me/6282218455821" 
            className="inline-block px-10 py-4 bg-white text-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-all active:scale-95"
          >
            Hubungi Tim Teknis
          </a>
        </div>
      </section>

      {/* Standard Footer */}
      <footer className="px-[5%] py-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-black/[0.03]">
        <span className="text-[10px] font-bold text-black/30 tracking-[0.2em] uppercase">
          Rysee © 2026 — Secure Operational System
        </span>
        <div className="flex gap-8 text-[10px] font-bold text-black/40 tracking-widest uppercase">
          <a href="/terms-of-service" className="hover:text-black transition-colors">Terms</a>
          <a href="#" className="hover:text-black transition-colors">Security</a>
        </div>
      </footer>

    </div>
  );
};

export default PrivacyPolicy;