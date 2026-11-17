"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingBag,
  Globe,
  TrendingUp,
  Users,
  Crown,
  Sparkles,
  Check,
  Gift,
  ArrowRight,
  BookOpen,
  Video,
  PlayCircle,
} from "lucide-react";

interface BioGuideSectionProps {
  accentColor?: string;
}

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
  { from: "Premium", toPremium: "Rp 50K (85%)", color: "#FBBF24" },
];

const comparison = [
  { feat: "Komisi per Referral", others: "Kecil & Tidak Menentu", rysee: "Hingga Rp 50.000", ok: true },
  { feat: "Withdraw", others: "3-7 Hari Kerja", rysee: "Dashboard Request + Admin Approval", ok: true },
  { feat: "Batas Referral", others: "Terbatas", rysee: "Unlimited", ok: true },
  { feat: "Biaya Platform", others: "Tidak Transparan", rysee: "Transparan Rp 59.000", ok: true },
  { feat: "Tracking Data", others: "Tertutup", rysee: "Live Dashboard", ok: true },
];

const faqs = [
  { q: "Bagaimana cara dapat komisi referral?", a: "Semua tier bisa ikut. Bagikan link referral unik Anda. Komisi tergantung tier Anda dan yang direfer." },
  { q: "Berapa komisi per referral?", a: "Free tier dapat Rp 12K (20%), Premium tier dapat Rp 50K (85%) per referral upgrade." },
  { q: "Cara withdraw komisi?", a: "Ajukan request penarikan di dashboard earnings. Admin akan review dan proses transfer ke rekening/e-wallet kamu." },
  { q: "Ada batas referral?", a: "Tidak ada batas. Semakin banyak, semakin besar penghasilan." },
  { q: "User Free bisa ikut?", a: "Ya. Semua tier bisa, tapi Premium dapat komisi tertinggi." },
];

/* ─── Component ─── */
export default function BioGuideSection({
  accentColor = "#3E47A8",
}: BioGuideSectionProps) {
  const [activeTab, setActiveTab] = useState<"komisi" | "referral" | "materi">("komisi");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const secTitle = (label: string) => (
    <h3
      className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
      style={{ color: accentColor }}
    >
      {label}
    </h3>
  );

  return (
    <div className="w-full space-y-6">
      {/* ── Toggle Tabs ── */}
      <div className="flex rounded-2xl border border-gray-100 bg-white/60 overflow-hidden shadow-sm mx-4 md:mx-0">
        <button
          onClick={() => setActiveTab("komisi")}
          className={`flex-1 py-3 text-xs font-medium transition-all duration-300 ${
            activeTab === "komisi"
              ? "text-white"
              : "text-[#71717A] hover:text-[#18181B]"
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
            activeTab === "referral"
              ? "text-white"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
          style={{
            background: activeTab === "referral"
              ? "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)"
              : "transparent",
          }}
        >
          Komisi Referral
        </button>
        <button
          onClick={() => setActiveTab("materi")}
          className={`flex-1 py-3 text-xs font-medium transition-all duration-300 ${
            activeTab === "materi"
              ? "text-white"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
          style={{
            background: activeTab === "materi"
              ? "linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)"
              : "transparent",
          }}
        >
          Materi & Konten
        </button>
      </div>

      {activeTab === "komisi" ? (
        <>
          {/* ── Komisi Jualan Content ── */}

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

      {/* ── 2. Stats ── */}
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

      {/* ── 3. How It Works ── */}
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

      {/* ── 4. Commission Structure ── */}
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

      {/* ── 5. How to Start (6 steps) ── */}
      {secTitle("Mulai dalam 6 Langkah")}
      <div className="space-y-2">
        {stepsStart.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5 bg-white/60 rounded-xl p-3 border border-gray-100/50">
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {i + 1}
            </span>
            <p className="text-[11px] text-[#71717A] font-light leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      {/* ── 6. Philosophy / About ── */}
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
        </>
      ) : activeTab === "referral" ? (
        <>
          {/* ── Referral System Content ── */}

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
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Refer → Premium</p>
                  <p className={`text-sm font-bold ${row.from === "Premium" ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent" : "text-[#D946EF]"}`}>{row.toPremium}</p>
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
        </>
      ) : activeTab === "materi" ? (
        <>
          {/* ── Materi & Konten Content ── */}

          {/* Hero */}
          <div className="text-center py-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-medium tracking-wider text-[#18181B] mb-3">
              <BookOpen className="w-3 h-3 text-[#8B5CF6]" />
              Tim Rysee
            </span>
            <h2 className="text-xl font-light tracking-tight text-[#18181B] leading-snug mb-2">
              Materi &{" "}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent font-medium">
                Konten Siap Pakai
              </span>
            </h2>
            <p className="text-[11px] text-[#71717A] font-light leading-relaxed">
              Akses mentahan konten untuk referral dan tips jualan produk digital.
            </p>
          </div>

          {/* Materi Tersedia */}
          {secTitle("Materi Tersedia")}
          <div className="space-y-2">
            {[
              { title: "Video Promosi Referral", desc: "Video untuk promosi upgrade ke Premium", icon: Video },
              { title: "Caption Referral", desc: "Caption yang sudah terbukti convert untuk referral", icon: BookOpen },
              { title: "Hook & CTA", desc: "Opening dan closing yang menarik untuk upgrade", icon: Sparkles },
              { title: "Tutorial Edit", desc: "Panduan edit video promosi dengan mudah", icon: PlayCircle },
              { title: "Panduan Jualan Produk Digital", desc: "Strategi Profesional jualan produk digital", icon: TrendingUp },
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

          {/* Benefit */}
          {secTitle("Benefit")}
          <div className="bg-white/60 rounded-xl p-4 border border-gray-100/50 space-y-3">
            {[
              { text: "Akses selamanya untuk semua tier (Free, Premium)", ok: true },
              { text: "Mentahan video promosi referral berkualitas", ok: true },
              { text: "Caption referral yang sudah terbukti convert", ok: true },
              { text: "Akses komunitas untuk Q&A", ok: true },
              { text: "Panduan jualan produk", ok: true },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-[11px] text-[#71717A] font-light">{b.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center py-4 space-y-3">
            <p className="text-[11px] text-[#71717A] font-light">
              Materi lengkap • Anda dapat komisi referral
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
