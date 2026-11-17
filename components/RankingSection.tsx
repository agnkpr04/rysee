"use client";

import { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, Award, Store, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getEliteBadgeGradient, getEliteBadgeShadow, getEliteBadgeBorder } from '@/lib/badge-colors';

interface UserRanking {
  id: string;
  name: string;
  storeName: string | null;
  productCount: number;
  storeLogo: string | null;
  profileFrameType?: string;
  frameThickness?: number;
  eliteBadgeColor?: string;
  userPlan?: string;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const proBorderGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const eliteBorderGradient = "from-[#DC143C] via-[#C41E3A] to-[#8B0000]";
const textGradient = {
  background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const getBadgeStyle = (plan: string) => {
  switch (plan) {
    case 'elite':
      return `bg-gradient-to-r ${eliteBorderGradient} text-white border-2 border-transparent bg-clip-padding`;
    case 'pro':
      return `bg-gradient-to-r ${proBorderGradient} text-white border-2 border-transparent bg-clip-padding`;
    default:
      return 'bg-white border border-gray-200 text-[#A1A1AA]';
  }
};

const getBadgeText = (plan: string) => {
  switch (plan) {
    case 'elite':
      return 'ELITE';
    case 'pro':
      return 'PRO';
    default:
      return 'FREE';
  }
};

export default function RankingSection() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch('/api/ranking');
        if (res.ok) {
          const data = await res.json();
          setRankings((data.rankings || []).slice(0, 5)); // Top 5 only
        }
      } catch (err) {
        console.error('Failed to fetch rankings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-[#D946EF]" strokeWidth={1.5} />;
      case 2:
        return <Medal className="w-3.5 h-3.5 text-[#A1A1AA]" strokeWidth={1.5} />;
      case 3:
        return <Award className="w-3.5 h-3.5 text-[#8B5CF6]" strokeWidth={1.5} />;
      default:
        return <span className="text-xs font-light text-[#A1A1AA]">#{rank}</span>;
    }
  };

  // Helper function to get profile frame classes (from UserStore.tsx)
  const getProfileFrameClasses = (frameType: string, thickness: number, eliteBadgeColor: string = 'crimson') => {
    const padding = `${thickness}px`;
    switch (frameType) {
      case 'elite':
        return `p-[${padding}] rounded-full shadow-lg ${getEliteBadgeShadow(eliteBadgeColor)}`;
      case 'pro':
        return `from-[#8B5CF6] via-[#D946EF] to-[#EC4899] p-[${padding}] rounded-full shadow-lg shadow-purple-500/40`;
      default:
        return '';
    }
  };

  // Helper function to get glow effect classes (from UserStore.tsx)
  const getGlowEffectClasses = (frameType: string, eliteBadgeColor: string = 'crimson') => {
    switch (frameType) {
      case 'elite':
        return `shadow-lg ${getEliteBadgeShadow(eliteBadgeColor)}`;
      case 'pro':
        return 'shadow-lg shadow-purple-500/40';
      default:
        return '';
    }
  };

  if (isLoading || rankings.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-[#18181B] mb-1">
            Top Affiliators
          </h2>
          <p className="text-xs text-[#A1A1AA] font-light">
            User paling aktif di Rysee
          </p>
        </div>
        <Link
          href="/ranking"
          className="flex items-center gap-2 text-xs text-[#8B5CF6] hover:text-[#D946EF] transition-colors font-light tracking-wider"
        >
          View All <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {rankings.map((user, index) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm hover:shadow-purple-500/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F9F9FB] flex items-center justify-center border border-gray-50">
                {getRankIcon(index + 1)}
              </div>
              <div
                className={`relative flex-shrink-0 ${getProfileFrameClasses(user.profileFrameType || 'none', user.frameThickness || 2, user.eliteBadgeColor)} ${getGlowEffectClasses(user.profileFrameType || 'none', user.eliteBadgeColor)}`}
                style={user.profileFrameType === 'elite' ? {
                  background: `linear-gradient(to right, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').from}, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').via}, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').to})`
                } : user.profileFrameType === 'premium' ? {
                  background: 'linear-gradient(to right, #8B5CF6, #D946EF, #EC4899)'
                } : {}}
              >
                <div className="w-10 h-10 rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#F9F9FB] flex items-center justify-center">
                    {user.storeLogo ? (
                      <img src={user.storeLogo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-medium text-[#18181B] truncate">{user.name || 'Anonymous'}</h3>
              {user.userPlan && user.userPlan !== 'free' && (
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-light uppercase tracking-tight ${getBadgeStyle(user.userPlan)}`}>
                  {user.userPlan !== 'free' && <Crown size={5} fill="currentColor" />}
                  {getBadgeText(user.userPlan)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-[#8B5CF6]" strokeWidth={1.5} />
              <span className="text-lg font-light" style={textGradient}>{user.productCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
