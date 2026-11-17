"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Globe,
  TrendingUp,
  Users,
  Crown,
  Sparkles,
  Check,
  Gift,
  ArrowRight,
  Plus,
  Minus,
  Smartphone,
  Zap,
} from "lucide-react";

/* ─── Data: Komisi Jualan ─── */
const howItWorks = [
  { icon: ShoppingBag, title: "Pilih Produk", desc: "Browse katalog produk digital & jasa website dari Rysee." },
  { icon: Globe, title: "Add ke Toko", desc: "Tambahkan ke toko pribadi Anda dengan satu klik." },
  { icon: TrendingUp, title: "Share & Jual", desc: "Bagikan link toko ke sosial media dan mulai jualan." },
  { icon: Users, title: "Terima Komisi", desc: "Setiap pembelian = komisi masuk ke akun Anda." },
];

const stepsStart = [
  "Daftar & Login — Buat akun gratis, tidak perlu kartu kredit.",
  "Pilih Produk — Browse katalog produk digital & jasa website.",
  "Add ke Toko — Klik Add to Store, produk muncul di toko Anda.",
  "Share Link — Copy link toko ke Instagram, TikTok, WhatsApp.",
  "Mulai Jualan — Setiap penjualan = komisi sesuai tier.",
  "Tarik Komisi — Request penarikan di dashboard, proses 1x24 jam.",
];

const commissionTiers = [
  { name: "Free", digital: "20%", template: "15%", color: "#A1A1AA" },
  { name: "Premium", digital: "80%", template: "35%", color: "#FBBF24" },
];

const referralMatrix = [
  { from: "Free", toPremium: "Rp 12K (20%)", color: "#A1A1AA" },
  { from: "Premium", toPremium: "Rp 50K (80%)", color: "#FBBF24" },
];

const comparison = [
  { feat: "Komisi per Referral", others: "Kecil & Tidak Menentu", rysee: "Hingga Rp 50.000", ok: true },
  { feat: "Withdraw", others: "3-7 Hari Kerja", rysee: "Dashboard Request + Admin Approval", ok: true },
  { feat: "Batas Referral", others: "Terbatas", rysee: "Unlimited", ok: true },
  { feat: "Biaya Platform", others: "Tidak Transparan", rysee: "Transparan Rp 59K", ok: true },
  { feat: "Tracking Data", others: "Tertutup", rysee: "Live Dashboard", ok: true },
];

const faqs = [
  { q: "Bagaimana cara dapat komisi referral?", a: "Semua tier bisa ikut. Bagikan link referral unik Anda. Komisi tergantung tier Anda dan yang direfer." },
  { q: "Berapa komisi per referral?", a: "Matrix tier: Free Rp 12K, Premium Rp 50K." },
  { q: "Cara withdraw komisi?", a: "Ajukan request penarikan di dashboard earnings. Admin akan review dan proses transfer ke rekening/e-wallet kamu." },
  { q: "Ada batas referral?", a: "Tidak ada batas. Semakin banyak, semakin besar penghasilan." },
  { q: "User Free bisa ikut?", a: "Ya. Semua tier bisa, tapi Premium dapat komisi tertinggi." },
];

/* ─── Component ─── */
export default function DetailPage() {
  const [activeTab, setActiveTab] = useState<"komisi" | "referral" | "tentang">("komisi");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const accentColor = "#3E47A8";

  const secTitle = (label: string) => (
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#8B5CF6" }}>
      {label}
    </h3>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #fdf4ff 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="w-full max-w-lg">
        {/* ── Hero Badge ── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-xs font-medium text-purple-600">Platform Affiliate Digital</span>
          </div>

          {/* ── Headline ── */}
          <h1 className="text-2xl font-light tracking-tight text-[#18181B] leading-snug mb-3">
            Bangun Bisnis Digital{" "}
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
              Tanpa Modal Stok
            </span>
          </h1>
          <p className="text-xs text-[#71717A] font-light leading-relaxed max-w-sm mx-auto mb-6">
            Jual produk digital & jasa website tanpa stok. Komisi hingga{" "}
            <span className="text-[#18181B] font-medium">80%</span> per penjualan.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium shadow-lg shadow-[#8B5CF6]/20 hover:opacity-90 transition-all"
            >
              <Zap className="w-4 h-4" strokeWidth={1.5} />
              Gabung Rysee
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#18181B] border border-gray-200 rounded-full text-sm font-medium hover:border-[#8B5CF6] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
              Lihat Produk
            </Link>
          </div>
        </div>

        {/* ── 3-Tab Toggle ── */}
        <div className="flex rounded-2xl border border-gray-100 bg-white/60 overflow-hidden shadow-sm mb-6">
          <button
            onClick={() => setActiveTab("komisi")}
            className={`flex-1 py-3 text-xs font-medium transition-all duration-300 ${
              activeTab === "komisi" ? "text-white" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            style={{
              background: activeTab === "komisi"
                ? "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)"
                : "transparent",
            }}
          >
            Komisi Jualan
          </button>
          <button
            onClick={() => setActiveTab("referral")}
            className={`flex-1 py-3 text-xs font-medium transition-all duration-300 ${
              activeTab === "referral" ? "text-white" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            style={{
              background: activeTab === "referral"
                ? "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)"
                : "transparent",
            }}
          >
            Referral System
          </button>
          <button
            onClick={() => setActiveTab("tentang")}
            className={`flex-1 py-3 text-xs font-medium transition-all duration-300 ${
              activeTab === "tentang" ? "text-white" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            style={{
              background: activeTab === "tentang"
                ? "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)"
                : "transparent",
            }}
          >
            Tentang Rysee
          </button>
        </div>

        {/* ── Tab: Komisi Jualan ── */}
        {activeTab === "komisi" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-medium tracking-wider text-[#18181B] mb-3">
                <ShoppingBag className="w-3 h-3 text-[#8B5CF6]" />
                Platform Affiliate Digital
              </span>
              <h2 className="text-xl font-light tracking-tight text-[#18181B] leading-snug mb-2">
                Mulai Bisnis Digital{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                  Tanpa Modal Stok
                </span>
              </h2>
              <p className="text-[11px] text-[#71717A] font-light leading-relaxed">
                Jual produk digital & jasa website tanpa stok. Komisi hingga{" "}
                <span className="text-[#18181B] font-medium">80%</span> per penjualan.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { val: "80%", lab: "Max Komisi" },
                { val: "Unlimited", lab: "Stok Produk" },
                { val: "Gratis", lab: "Mulai Jualan" },
              ].map((s, i) => (
                <div key={i} className="bg-white/60 rounded-xl p-3 border border-gray-100/50">
                  <div className="text-lg font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                    {s.val}
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">{s.lab}</div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            {secTitle("Cara Kerja")}
            <div className="space-y-2">
              {howItWorks.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100/50">
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-medium text-[#18181B]">{item.title}</p>
                    <p className="text-[11px] text-[#A1A1AA] font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Commission Structure */}
            {secTitle("Struktur Komisi")}
            <div className="space-y-2">
              {commissionTiers.map((t, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 border ${t.name === "Premium" ? "border-[#FBBF24]/30 bg-[#FBBF24]/5" : "border-gray-100/50 bg-white/60"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {t.name === "Premium" ? <Crown className="w-3 h-3" style={{ color: t.color }} /> : null}
                    <span className="text-xs font-semibold" style={{ color: t.color }}>{t.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Digital</p>
                      <p className="text-sm font-bold" style={{ color: t.color }}>{t.digital}</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Jasa Web</p>
                      <p className="text-sm font-bold" style={{ color: t.color }}>{t.template}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How to Start */}
            {secTitle("Mulai dalam 6 Langkah")}
            <div className="space-y-2">
              {stepsStart.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/60 rounded-xl p-3 border border-gray-100/50">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: accentColor }}>
                    {i + 1}
                  </span>
                  <p className="text-[11px] text-[#71717A] font-light leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Philosophy */}
            {secTitle("Tentang Program")}
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50 space-y-3">
              <p className="text-xs font-light leading-relaxed text-[#3F3F46]">
                Rysee adalah platform affiliate yang menghubungkan Anda dengan produk digital berkualitas.
                Tanpa stok, tanpa ribet — cukup pilih, jual, dan dapatkan komisi.
              </p>
              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#18181B] mb-1">Tanpa Stok</h4>
                  <p className="text-[11px] text-[#71717A] font-light">Produk digital siap jual kapan saja.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#18181B] mb-1">Transparan</h4>
                  <p className="text-[11px] text-[#71717A] font-light">Semua transaksi tercatat di dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Referral System ── */}
        {activeTab === "referral" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-medium tracking-wider text-[#18181B] mb-3">
                <Gift className="w-3 h-3 text-[#8B5CF6]" />
                Program Referral
              </span>
              <h2 className="text-xl font-light tracking-tight text-[#18181B] leading-snug mb-2">
                Dapatkan{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                  Penghasilan Tambahan
                </span>
              </h2>
              <p className="text-[11px] text-[#71717A] font-light leading-relaxed">
                Ajak teman upgrade dan dapatkan komisi hingga{" "}
                <span className="text-[#18181B] font-medium">Rp 50.000</span> per referral.
              </p>
            </div>

            {/* Cara Kerja Referral */}
            {secTitle("Cara Kerja")}
            <div className="space-y-2">
              {[
                { icon: Gift, title: "Daftar & Dapatkan Link", desc: "Setiap user punya link referral unik. Semua tier bisa ikut." },
                { icon: Users, title: "Ajak Teman Upgrade", desc: "Bagikan link ke teman atau followers Anda." },
                { icon: ArrowRight, title: "Teman Upgrade", desc: "Saat teman upgrade ke Premium via link Anda." },
                { icon: TrendingUp, title: "Komisi Masuk", desc: "Komisi langsung tercatat di dashboard Anda." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100/50">
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8B5CF6]" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-medium text-[#18181B]">{item.title}</p>
                    <p className="text-[11px] text-[#A1A1AA] font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Komisi Referral */}
            {secTitle("Matrix Komisi Referral")}
            <div className="space-y-2">
              {referralMatrix.map((row, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 border ${row.from === "Premium" ? "border-[#FBBF24]/30 bg-[#FBBF24]/5" : "border-gray-100/50 bg-white/60"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {row.from === "Premium" ? <Crown className="w-3 h-3" style={{ color: row.color }} /> : null}
                    <span className="text-xs font-semibold" style={{ color: row.color }}>Anda di tier {row.from}</span>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Refer → Premium</p>
                    <p className="text-sm font-bold text-[#D946EF]">{row.toPremium}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Proyeksi */}
            {secTitle("Proyeksi Penghasilan")}
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50 space-y-3">
              {[
                { label: "10 Referrals (Premium)", amount: "Rp 500.000" },
                { label: "50 Referrals (Premium)", amount: "Rp 2.500.000" },
                { label: "100 Referrals (Premium)", amount: "Rp 5.000.000", hl: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="text-[11px] text-[#71717A] font-light">{p.label}</span>
                  <span className={`text-sm font-medium ${p.hl ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent" : "text-[#18181B]"}`}>{p.amount}</span>
                </div>
              ))}
              <p className="text-[10px] text-[#A1A1AA] italic">*Asumsi Premium tier, refer ke Premium = Rp 50K/referral</p>
            </div>

            {/* Keunggulan */}
            {secTitle("Keunggulan Rysee")}
            <div className="bg-white/60 rounded-xl border border-gray-100/50 overflow-hidden">
              {comparison.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] text-[#18181B] font-medium flex-1">{c.feat}</span>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-medium text-[#18181B]">{c.rysee}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            {secTitle("FAQ")}
            <div className="space-y-1">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/60 rounded-xl border border-gray-100/50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className={`text-xs font-medium transition-colors ${openFaq === i ? "text-[#8B5CF6]" : "text-[#18181B]"}`}>
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <Minus className="w-3 h-3 text-[#8B5CF6] flex-shrink-0 ml-2" />
                    ) : (
                      <Plus className="w-3 h-3 text-gray-300 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3">
                      <p className="text-[11px] text-[#71717A] font-light leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center py-4 space-y-3">
              <p className="text-[11px] text-[#71717A] font-light">
                Request penarikan di dashboard • Proses 1x24 jam
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: Tentang Rysee ── */}
        {activeTab === "tentang" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-medium tracking-wider text-[#18181B] mb-3">
                <Globe className="w-3 h-3 text-[#8B5CF6]" />
                Tentang Kami
              </span>
              <h2 className="text-xl font-light tracking-tight text-[#18181B] leading-snug mb-2">
                Kenalan dengan{" "}
                <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                  Rysee
                </span>
              </h2>
              <p className="text-[11px] text-[#71717A] font-light leading-relaxed">
                Platform yang membantu kamu membangun bisnis digital tanpa ribet.
              </p>
            </div>

            {/* Apa itu Rysee */}
            {secTitle("Apa itu Rysee?")}
            <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50 space-y-3">
              <p className="text-xs font-light leading-relaxed text-[#3F3F46]">
                Rysee adalah platform affiliate untuk produk digital dan jasa website.
                Kami percaya setiap orang bisa punya bisnis digital — tanpa perlu bikin produk sendiri,
                tanpa stok, dan tanpa modal besar.
              </p>
              <p className="text-xs font-light leading-relaxed text-[#3F3F46]">
                Cukup pilih produk dari katalog kami, tambahkan ke toko pribadi kamu,
                lalu bagikan link ke sosial media. Setiap penjualan = komisi masuk ke akun kamu.
              </p>
            </div>

            {/* Kenapa Rysee */}
            {secTitle("Kenapa Rysee?")}
            <div className="space-y-2">
              {[
                { icon: Zap, title: "Tanpa Modal Stok", desc: "Produk digital siap jual. Tidak perlu beli stok atau inventory." },
                { icon: TrendingUp, title: "Komisi Tinggi", desc: "Hingga 80% per penjualan, tergantung tier membership kamu." },
                { icon: Users, title: "Referral Bonus", desc: "Ajak teman upgrade dan dapatkan komisi hingga Rp 50.000 per orang." },
                { icon: Smartphone, title: "Bisa dari HP", desc: "Kelola toko dan track penghasilan langsung dari handphone." },
                { icon: Check, title: "Transparan", desc: "Semua transaksi tercatat di dashboard. No hidden fee." },
                { icon: Gift, title: "Unlimited Produk", desc: "Tambah produk ke toko sepuasnya sesuai batas tier." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3 border border-gray-100/50">
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8B5CF6]" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-medium text-[#18181B]">{item.title}</p>
                    <p className="text-[11px] text-[#A1A1AA] font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cara Kerja Singkat */}
            {secTitle("Cara Kerja")}
            <div className="bg-white/60 rounded-xl border border-gray-100/50 overflow-hidden">
              {[
                { step: "1", title: "Daftar Gratis", desc: "Buat akun tanpa kartu kredit." },
                { step: "2", title: "Pilih Produk", desc: "Browse dan tambahkan ke toko." },
                { step: "3", title: "Bagikan Link", desc: "Share ke IG, TikTok, atau WA." },
                { step: "4", title: "Dapat Komisi", desc: "Komisi masuk otomatis ke dashboard." },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: "#8B5CF6" }}>
                    {s.step}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#18181B]">{s.title}</p>
                    <p className="text-[11px] text-[#71717A] font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center py-4 space-y-3">
              <p className="text-[11px] text-[#71717A] font-light">
                Siap mulai bisnis digital?
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium shadow-lg shadow-[#8B5CF6]/20 hover:opacity-90 transition-all"
              >
                <Zap className="w-4 h-4" strokeWidth={1.5} />
                Gabung Sekarang
              </Link>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="text-center pt-8 mt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-light">Powered by Rysee</p>
        </div>
      </div>
    </div>
  );
}
