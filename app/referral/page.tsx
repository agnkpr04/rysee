"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Handshake, Users, Gift, CheckCircle, Copy, Share2, Lock, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReferralPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    activeReferrals: 0,
  });
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/');
        return;
      }
      setUser(session.user);

      // Fetch membership status
      try {
        const membershipRes = await fetch('/api/membership/status', {
          headers: {
            'Authorization': `Bearer ${session.access_token || ''}`,
          },
        });
        if (membershipRes.ok) {
          const membershipData = await membershipRes.json();
          setIsPremium(membershipData.isPremium || false);
        }
      } catch (err) {
        console.error('Failed to fetch membership status:', err);
      }

      // Fetch referral code and stats from API (only if premium)
      try {
        const res = await fetch('/api/referral/earnings', {
          headers: {
            'Authorization': `Bearer ${session.access_token || ''}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setReferralCode(data.referralCode || '');
          setReferralStats({
            totalReferrals: data.totalReferrals || 0,
            totalEarnings: data.totalEarnings || 0,
            activeReferrals: data.activeReferrals || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch referral data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, [router]);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://rysee.com'}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gabung Rysee',
        text: `Halo! Aku mau share platform affiliate keren nih - Rysee. Kamu bisa pilih produk dari catalog dan buat toko affiliate sendiri.`,
        url: referralLink,
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Locked state for FREE users
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9FB] to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-50">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl">
                <Handshake className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light text-[#18181B]">Program Referral</h1>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-2xl">
              Program referral adalah fitur premium. Upgrade ke Premium untuk mulai menghasilkan dari referral.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Locked State */}
          <div className="bg-white p-12 rounded-xl border border-gray-50 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#8B5CF6]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-light text-[#18181B] mb-3">Fitur Premium</h2>
            <p className="text-sm text-[#A1A1AA] mb-8 max-w-md mx-auto">
              Program referral memungkinkan kamu mendapatkan Rp 30.000 untuk setiap teman yang kamu ajak dan upgrade ke Premium membership.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full hover:opacity-90 transition text-sm font-medium"
            >
              <Crown className="w-4 h-4" strokeWidth={1.5} />
              Upgrade to Premium
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-[#D946EF]" strokeWidth={1.5} />
                <span className="text-xs text-[#A1A1AA]">Rp 30.000 per Referral</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
                <span className="text-xs text-[#A1A1AA]">Unlimited Referral</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-[#10B981]" strokeWidth={1.5} />
                <span className="text-xs text-[#A1A1AA]">Withdraw Kapan Saja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9FB] to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl">
              <Handshake className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-light text-[#18181B]">Program Referral</h1>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-2xl">
            Ajak teman bergabung ke Rysee dan dapatkan penghasilan. Setiap teman yang kamu ajak dan upgrade ke Premium membership, kamu akan mendapatkan Rp 30.000!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
              <span className="text-xs text-[#A1A1AA]">Total Referral</span>
            </div>
            <p className="text-2xl font-bold text-[#18181B]">{referralStats.totalReferrals}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-5 h-5 text-[#D946EF]" strokeWidth={1.5} />
              <span className="text-xs text-[#A1A1AA]">Total Penghasilan</span>
            </div>
            <p className="text-2xl font-bold text-[#18181B]">Rp {referralStats.totalEarnings.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" strokeWidth={1.5} />
              <span className="text-xs text-[#A1A1AA]">Referral Aktif</span>
            </div>
            <p className="text-2xl font-bold text-[#18181B]">{referralStats.activeReferrals}</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white p-8 rounded-xl border border-gray-50 shadow-sm mb-8">
          <h2 className="text-lg font-medium text-[#18181B] mb-4">Link Referral Kamu</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#F9F9FB] border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm text-[#A1A1AA] break-all">{referralLink}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
            <button
              onClick={shareLink}
              className="flex items-center gap-2 px-4 py-3 bg-[#D946EF] text-white rounded-lg hover:bg-[#C026D3] transition"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white p-8 rounded-xl border border-gray-50 shadow-sm">
          <h2 className="text-lg font-medium text-[#18181B] mb-6">Cara Kerja</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold text-sm">1</div>
              <div>
                <h3 className="text-sm font-medium text-[#18181B] mb-1">Bagikan Link Kamu</h3>
                <p className="text-xs text-[#A1A1AA]">Bagikan link referral unik kamu ke teman via WhatsApp, Telegram, atau media sosial.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D946EF]/10 flex items-center justify-center text-[#D946EF] font-bold text-sm">2</div>
              <div>
                <h3 className="text-sm font-medium text-[#18181B] mb-1">Teman Bergabung</h3>
                <p className="text-xs text-[#A1A1AA]">Teman kamu daftar menggunakan link kamu dan upgrade ke Premium membership.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-bold text-sm">3</div>
              <div>
                <h3 className="text-sm font-medium text-[#18181B] mb-1">Dapatkan Penghasilan</h3>
                <p className="text-xs text-[#A1A1AA]">Ketika teman kamu upgrade ke Premium, kamu dapat Rp 30.000! Withdraw penghasilan kapan saja secara manual.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 p-6 bg-[#F9F9FB] rounded-xl border border-gray-50">
          <h3 className="text-sm font-medium text-[#18181B] mb-3">Syarat & Ketentuan</h3>
          <ul className="text-xs text-[#A1A1AA] space-y-2">
            <li>• Unlimited referral - tidak ada batas jumlah referral</li>
            <li>• Rp 30.000 per referral yang berhasil upgrade ke Premium</li>
            <li>• Reward diberikan ketika user yang direfer upgrade ke Premium membership</li>
            <li>• Withdraw penghasilan secara manual via WhatsApp/Transfer</li>
            <li>• Self-referral tidak diperbolehkan</li>
            <li>• Rysee berhak mengubah syarat program kapan saja</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
