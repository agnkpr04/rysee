"use client";

import { motion } from 'framer-motion';
import { Check, Crown, ArrowRight, Gift, Users, Zap } from 'lucide-react';
import PaymentModal from './PaymentModal';
import LoginModal from '../../affstore/components/LoginModal';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const WHATSAPP_LINK = "https://wa.me/628xxxxxxxx?text=Halo%20Agung,%20saya%20mau%20aktivasi%20membership%20Rysee";

export default function MembershipSection() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string; planName: string; price: number }>({
    plan: 'premium',
    planName: 'Premium',
    price: 59000,
  });
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlan();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserPlan();
      } else {
        setUser(null);
        setCurrentPlan('free');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const planOrder = ['free', 'premium'];
  const currentPlanIndex = planOrder.indexOf(currentPlan);

  const canUpgrade = (plan: string) => {
    const planIndex = planOrder.indexOf(plan);
    return planIndex > currentPlanIndex;
  };

  const handleUpgradeClick = () => {
    if (!user) {
      // User not logged in, show login modal
      setIsLoginModalOpen(true);
    } else {
      // User logged in, show payment modal
      setSelectedPlan({ plan: 'premium', planName: 'Premium', price: 59000 });
      setIsPaymentModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // After successful login, show payment modal
    setSelectedPlan({ plan: 'premium', planName: 'Premium', price: 59000 });
    setIsPaymentModalOpen(true);
  };
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-[#18181B] mb-3">
          Model Membership
        </h2>
        <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`bg-white border rounded-2xl p-6 md:p-8 shadow-sm relative ${currentPlan === 'free' ? 'border-[#8B5CF6]' : 'border-gray-50'}`}
        >
          {currentPlan === 'free' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider z-10">
              Current Plan
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-[#18181B] mb-2">Free</h3>
            <p className="text-sm font-light text-[#A1A1AA]">Mulai bisnis affiliate tanpa biaya</p>
          </div>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#8B5CF6]" strokeWidth={2} />
              <span className="text-sm font-light text-[#18181B]">Hingga 20 produk di toko</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#8B5CF6]" strokeWidth={2} />
              <span className="text-sm font-light text-[#18181B]">Download konten tanpa batas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-[#8B5CF6]" strokeWidth={2} />
              <span className="text-sm font-light text-[#18181B]">Kustomisasi toko standar</span>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-50">
            <p className="text-2xl font-light text-[#18181B]">Rp 0</p>
            <p className="text-xs font-light text-[#A1A1AA] mt-1">Selamanya gratis</p>
          </div>
          {currentPlan === 'free' ? (
            <button
              disabled
              className="mt-6 block w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium text-center cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              disabled
              className="mt-6 block w-full py-3 bg-gray-50 text-gray-300 rounded-xl text-sm font-medium text-center cursor-not-allowed"
            >
              Downgrade
            </button>
          )}
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-2xl p-6 md:p-8 shadow-lg relative ${currentPlan === 'premium' ? 'bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#FBBF24]' : 'bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#FBBF24]'}`}
        >
          <div className="absolute top-4 right-4">
            <Crown className="w-6 h-6 text-white/80" strokeWidth={1.5} />
          </div>
          {currentPlan === 'premium' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-[#8B5CF6] px-4 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider z-10">
              Current Plan
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-white mb-2">Premium</h3>
            <p className="text-sm font-light text-white/80">Akses penuh selamanya - sekali bayar</p>
          </div>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Produk tanpa batas di toko</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Download konten tanpa batas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Kustomisasi premium (warna, font)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Dukungan prioritas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Badge Premium eksklusif</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Frame profil Premium eksklusif</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Akses komunitas dan member eksklusif</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-sm font-light text-white">Referral System Untuk penghasilan tambahan</span>
            </div>
          </div>
          <div className="pt-6 border-t border-white/20">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">Rp 99.000</p>
              <p className="text-sm font-medium text-white/90 mt-1">sekali bayar</p>
              <p className="text-xs font-normal text-white/70 mt-1">Selamanya aktif tanpa biaya bulanan</p>
            </div>
          </div>
          {currentPlan === 'premium' ? (
            <button
              disabled
              className="mt-6 block w-full py-3 bg-white text-[#8B5CF6] rounded-xl text-sm font-medium text-center cursor-not-allowed opacity-80"
            >
              Current Plan
            </button>
          ) : canUpgrade('premium') ? (
            <button
              onClick={handleUpgradeClick}
              className="mt-6 block w-full py-3 bg-white text-[#8B5CF6] rounded-xl text-sm font-medium text-center hover:bg-white/90 transition-colors"
            >
              Upgrade ke Premium
            </button>
          ) : (
            <button
              disabled
              className="mt-6 block w-full py-3 bg-white/20 text-white/50 rounded-xl text-sm font-medium text-center cursor-not-allowed"
            >
              Downgrade
            </button>
          )}
        </motion.div>
      </div>

      {/* Referral Program Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 md:mt-16 bg-gradient-to-br from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#FBBF24]/5 rounded-3xl p-6 md:p-8 lg:p-12 border border-[#8B5CF6]/10 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#D946EF]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
            <h3 className="text-2xl font-medium text-[#18181B]">Program Referral</h3>
          </div>
          <p className="text-sm font-light text-[#A1A1AA] mb-8 text-center max-w-2xl mx-auto">
            Dapatkan penghasilan tambahan dengan mengajak teman bergabung. Setiap referral yang berhasil upgrade ke Premium akan memberikan Anda komisi!
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
                <p className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">Rp 25.000</p>
              </div>
              <p className="text-xs font-light text-[#A1A1AA]">per referral</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#D946EF]" strokeWidth={1.5} />
                <p className="text-3xl font-bold bg-gradient-to-r from-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">Unlimited</p>
              </div>
              <p className="text-xs font-light text-[#A1A1AA]">referral</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ArrowRight className="w-5 h-5 text-[#EC4899]" strokeWidth={1.5} />
                <p className="text-3xl font-bold bg-gradient-to-r from-[#EC4899] to-[#FBBF24] bg-clip-text text-transparent">Manual</p>
              </div>
              <p className="text-xs font-light text-[#A1A1AA]">withdraw</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-[#8B5CF6]/20"
            >
              Pelajari Cara Kerja Referral
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <p className="text-xs font-light text-[#A1A1AA] mt-3">
              Pelajari sistem referral dan cara memaksimalkan penghasilan Anda
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan.plan}
        planName={selectedPlan.planName}
        price={selectedPlan.price}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </section>
  );
}
