"use client";

import { useState } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import ClicksLeaderboardTable from './components/ClicksLeaderboardTable';
import ReferralLeaderboardTable from './components/ReferralLeaderboardTable';
import GlobalNavbar from '@/components/GlobalNavbar';
import MinimalFooter from '@/components/MinimalFooter';
import { Trophy, MousePointer2, Package, Crown, Users } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'referral'>('products');

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar isSticky={true} />

      <div className="max-w-5xl mx-auto px-8 py-12 pb-24 md:pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-[#18181B] mb-3">
            Top Performers
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
          <p className="text-sm font-light text-[#A1A1AA]">
            Lihat siapa yang memimpin dalam produk dan referral
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-50">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-light transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                  : 'text-[#A1A1AA] hover:text-[#18181B]'
              }`}
            >
              <Package size={16} strokeWidth={1.5} />
              Most Products
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-light transition-all ${
                activeTab === 'referral'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                  : 'text-[#A1A1AA] hover:text-[#18181B]'
              }`}
            >
              <Users size={16} strokeWidth={1.5} />
              Top Referrals
            </button>
            {/* Elite Performers tab hidden for now - uncomment to re-enable */}
            {/* <button
              onClick={() => setActiveTab('clicks')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-light transition-all ${
                activeTab === 'clicks'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                  : 'text-[#A1A1AA] hover:text-[#18181B]'
              }`}
            >
              <Crown size={16} strokeWidth={1.5} />
              Elite Performers
            </button> */}
          </div>
        </div>

        {activeTab === 'products' && <LeaderboardTable />}
        {activeTab === 'referral' && <ReferralLeaderboardTable />}
        {/* <ClicksLeaderboardTable /> - Hidden for now, uncomment to re-enable Elite Performers tab */}
      </div>
      <MinimalFooter />
    </div>
  );
}
