"use client";

import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Zap, ShoppingBag, Globe, FileText, Users, Shield, Gift, ArrowRight, Star, TrendingUp } from 'lucide-react';
import PaymentModal from '../../about/components/PaymentModal';
import LoginModal from '../../affstore/components/LoginModal';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

type PlanKey = 'free' | 'premium';

interface PlanData {
  key: PlanKey;
  name: string;
  price: number;
  priceLabel: string;
  originalPrice?: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  features: { icon: any; text: string; bold?: boolean }[];
  cta: string;
}

const PLANS: PlanData[] = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Rp 0',
    tagline: 'Mulai jualan tanpa biaya',
    features: [
      { icon: Globe, text: 'Unlimited produk di toko' },
      { icon: TrendingUp, text: 'Komisi produk digital 20%' },
      { icon: TrendingUp, text: 'Komisi template 15%' },
      { icon: Gift, text: 'Refer Premium: Rp 12K (20%)' },
      { icon: Users, text: 'Akses Komunitas Rysee' },
      { icon: FileText, text: 'Edit nama & deskripsi toko' },
    ],
    cta: 'Mulai Gratis',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 59000,
    priceLabel: 'Rp 59.000',
    originalPrice: 'Rp 299.000',
    tagline: 'Penghasilan tanpa batas',
    badge: 'Best Value',
    highlighted: true,
    features: [
      { icon: Globe, text: 'Unlimited produk di toko' },
      { icon: TrendingUp, text: 'Komisi produk digital 80%', bold: true },
      { icon: TrendingUp, text: 'Komisi template 35%', bold: true },
      { icon: Gift, text: 'Refer Premium: Rp 50K (85%)', bold: true },
      { icon: Crown, text: 'Badge & Frame Premium eksklusif' },
      { icon: FileText, text: 'Mentahan, hook & caption siap pakai untuk referrer' },
      { icon: Sparkles, text: 'Kustomisasi warna (custom HEX)', bold: true },
      { icon: Sparkles, text: 'Gradient frames (all styles)', bold: true },
      { icon: Sparkles, text: 'Profile frame Elite (exclusive)', bold: true },
      { icon: Sparkles, text: 'Font kustomisasi' },
      { icon: Users, text: 'Akses Komunitas Rysee' },
      { icon: Users, text: 'Akses Grup Khusus Referrer & Produk Digital' },
      { icon: Users, text: 'Akses Panduan Jualan Produk Digital' },
    ],
    cta: 'Upgrade ke Premium',
  },
];

const REFERRAL_MATRIX = [
  { from: 'Free', toPremium: 'Rp 12K' },
  { from: 'Premium', toPremium: 'Rp 50K' },
];

const FAQS = [
  {
    q: 'Apakah ini sekali bayar atau langganan bulanan?',
    a: 'Sekali bayar untuk akses selamanya. Tidak ada biaya bulanan, tidak ada perpanjangan otomatis.',
  },
  {
    q: 'Bagaimana cara mendapatkan komisi referral?',
    a: 'Setiap teman yang Anda undang dan upgrade ke Premium melalui link referral Anda akan memberikan komisi sesuai tier Anda. Komisi dapat ditarik manual via WhatsApp.',
  },
  {
    q: 'Apakah komisi referral berlaku selamanya?',
    a: 'Ya, setiap referral baru yang berhasil upgrade akan memberikan komisi sesuai tier Anda saat itu.',
  },
  {
    q: 'Bagaimana sistem pembayarannya aman?',
    a: 'Pembayaran via BCA, DANA, atau OVO ke rekening resmi. Setelah konfirmasi pembayaran, akun Anda diaktifkan dalam waktu maksimal 1x24 jam.',
  },
];

export default function PricingTiers() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string; planName: string; price: number }>({
    plan: 'premium',
    planName: 'Premium',
    price: 59000,
  });
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [user, setUser] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const res = await fetch('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session.access_token || ''}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentPlan(data.plan || 'free');
          }
        }
      } catch (err) {
        console.error('Failed to fetch user plan:', err);
      }
    };

    fetchUserPlan();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserPlan();
      } else {
        setUser(null);
        setCurrentPlan('free');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const planOrder: PlanKey[] = ['free', 'premium'];
  const currentPlanIndex = planOrder.indexOf(currentPlan as PlanKey);

  const canUpgrade = (plan: PlanKey) => {
    return planOrder.indexOf(plan) > currentPlanIndex;
  };

  const handleUpgradeClick = (plan: PlanData) => {
    if (plan.key === 'free') return;
    if (!user) {
      setSelectedPlan({ plan: plan.key, planName: plan.name, price: plan.price });
      setIsLoginModalOpen(true);
    } else {
      setSelectedPlan({ plan: plan.key, planName: plan.name, price: plan.price });
      setIsPaymentModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan, idx) => {
            const isCurrent = currentPlan === plan.key;
            const isPremium = plan.key === 'premium';

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative rounded-2xl p-6 md:p-7 shadow-sm flex flex-col ${
                  isPremium
                    ? `bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#FBBF24] text-white`
                    : 'bg-white border border-gray-100'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        isPremium
                          ? 'bg-white text-[#8B5CF6] shadow-md'
                          : `bg-gradient-to-r ${accentGradient} text-white shadow-md`
                      }`}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider ${
                        isPremium ? 'bg-white/20 text-white border border-white/30' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Aktif
                    </div>
                  </div>
                )}

                {/* Crown for Premium */}
                {isPremium && !isCurrent && (
                  <div className="absolute top-4 right-4">
                    <Crown className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                  </div>
                )}

                {/* Header */}
                <div className="mb-5">
                  <h3 className={`text-xl font-semibold mb-1 ${isPremium ? 'text-white' : 'text-[#18181B]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-light ${isPremium ? 'text-white/80' : 'text-[#A1A1AA]'}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className={`mb-6 pb-5 border-b ${isPremium ? 'border-white/20' : 'border-gray-50'}`}>
                  {plan.originalPrice && (
                    <p className={`text-xs font-light line-through mb-0.5 ${isPremium ? 'text-white/50' : 'text-[#A1A1AA]'}`}>
                      {plan.originalPrice}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <p className={`text-3xl font-bold ${isPremium ? 'text-white' : 'text-[#18181B]'}`}>
                      {plan.priceLabel}
                    </p>
                    {plan.price > 0 && (
                      <span className={`text-xs font-light ${isPremium ? 'text-white/70' : 'text-[#A1A1AA]'}`}>
                        / sekali
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-light mt-1 ${isPremium ? 'text-white/70' : 'text-[#A1A1AA]'}`}>
                    {plan.price === 0 ? 'Selamanya gratis' : 'Bayar sekali, akses selamanya'}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isPremium ? 'bg-white/20' : 'bg-[#8B5CF6]/10'
                          }`}
                        >
                          <Check
                            className={`w-2.5 h-2.5 ${isPremium ? 'text-white' : 'text-[#8B5CF6]'}`}
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={`text-xs leading-relaxed ${
                            feature.bold ? 'font-semibold' : 'font-light'
                          } ${isPremium ? 'text-white' : 'text-[#18181B]'}`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                {plan.key === 'free' ? (
                  isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed"
                    >
                      Plan Aktif
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-50 text-gray-300 rounded-xl text-sm font-medium cursor-not-allowed"
                    >
                      Tidak Tersedia
                    </button>
                  )
                ) : isCurrent ? (
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl text-sm font-medium cursor-not-allowed ${
                      isPremium ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Plan Aktif
                  </button>
                ) : canUpgrade(plan.key) ? (
                  <button
                    onClick={() => handleUpgradeClick(plan)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                      isPremium
                        ? 'bg-white text-[#8B5CF6] hover:bg-white/90 shadow-md'
                        : 'bg-[#18181B] text-white hover:bg-[#27272A]'
                    }`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl text-sm font-medium cursor-not-allowed ${
                      isPremium ? 'bg-white/20 text-white/50' : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    Sudah di tier lebih tinggi
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Shield, label: 'Pembayaran Aman' },
            { icon: Zap, label: 'Aktivasi Cepat 1x24 Jam' },
            { icon: Crown, label: 'Akses Selamanya' },
            { icon: Users, label: 'Komunitas Aktif' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-center gap-2 bg-white rounded-xl p-3 border border-gray-50">
                <Icon className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
                <span className="text-xs font-light text-[#18181B]">{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Referral Commission Matrix */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#FBBF24]/5 rounded-3xl p-6 md:p-10 border border-[#8B5CF6]/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D946EF]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-[#8B5CF6]/10">
                <Gift className="w-3.5 h-3.5 text-[#8B5CF6]" strokeWidth={2} />
                <span className="text-[11px] font-medium text-[#8B5CF6] tracking-wider uppercase">Penghasilan Tambahan</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-[#18181B] mb-3">
                Matrix Komisi <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent font-medium`}>Referral</span>
              </h2>
              <p className="text-sm font-light text-[#A1A1AA] max-w-2xl mx-auto">
                Semakin tinggi tier Anda, semakin besar komisi yang didapat dari setiap referral yang upgrade
              </p>
            </div>

            {/* Matrix Table - Desktop */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F9F9FB] to-[#F0F0F2]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#18181B] uppercase tracking-wider">Tier Anda</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-[#18181B] uppercase tracking-wider">
                      Refer ke Premium
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-[#18181B] uppercase tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REFERRAL_MATRIX.map((row, i) => (
                    <tr key={i} className={`border-t border-gray-50 ${row.from === 'Premium' ? 'bg-gradient-to-r from-[#8B5CF6]/5 to-[#FBBF24]/5' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-[#18181B]">
                        <div className="flex items-center gap-2">
                          {row.from === 'Premium' && <Crown className="w-4 h-4 text-[#FBBF24]" strokeWidth={1.5} />}
                          {row.from}
                        </div>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span className={`text-sm font-bold ${row.from === 'Premium' ? `bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent` : 'text-[#D946EF]'}`}>
                          {row.toPremium}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span className={`text-xs font-semibold ${row.from === 'Premium' ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`}>
                          {row.from === 'Free' ? '20%' : '85%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Matrix Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {REFERRAL_MATRIX.map((row, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-4 border ${
                    row.from === 'Premium' ? 'border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/5 to-[#FBBF24]/5' : 'border-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {row.from === 'Premium' && <Crown className="w-4 h-4 text-[#FBBF24]" strokeWidth={1.5} />}
                      <span className="text-sm font-semibold text-[#18181B]">Tier {row.from}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.from === 'Premium' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-gray-100 text-[#A1A1AA]'}`}>
                      {row.from === 'Free' ? '20%' : '85%'}
                    </span>
                  </div>
                  <div className="bg-[#F9F9FB] rounded-lg p-3">
                    <p className="text-[10px] font-medium text-[#A1A1AA] uppercase mb-1">→ Premium</p>
                    <p className={`text-sm font-bold ${row.from === 'Premium' ? `bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent` : 'text-[#D946EF]'}`}>
                      {row.toPremium}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Link
                href="/guide"
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${accentGradient} text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20`}
              >
                Pelajari Cara Kerja Platform
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <p className="text-[11px] font-light text-[#A1A1AA] mt-3">
                Withdraw manual via WhatsApp • Tanpa minimum penarikan
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-light text-[#18181B] mb-3">
            Pertanyaan <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent font-medium`}>Umum</span>
          </h2>
          <p className="text-sm font-light text-[#A1A1AA]">Hal yang sering ditanyakan tentang membership</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-50 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-[#F9F9FB] transition-colors"
              >
                <span className="text-sm font-medium text-[#18181B] pr-4">{faq.q}</span>
                <ArrowRight
                  className={`w-4 h-4 text-[#A1A1AA] flex-shrink-0 transition-transform ${
                    openFaq === i ? 'rotate-90' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs font-light text-[#A1A1AA] leading-relaxed">{faq.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan.plan}
        planName={selectedPlan.planName}
        price={selectedPlan.price}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
