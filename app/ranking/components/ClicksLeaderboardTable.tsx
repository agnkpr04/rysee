"use client";

import { useEffect, useState } from 'react';
import { Trophy, Crown, Sparkles, MousePointer2 } from 'lucide-react';
import Image from 'next/image';
import { getEliteBadgeGradient, getEliteBadgeBorder } from '@/lib/badge-colors';
import { getGlowEffectStyle } from '@/lib/profile-frame';

interface UserClicksRanking {
  rank: number;
  userId: string;
  clickCount: number;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
  } | null;
  userPlan: string;
  profileFrameType?: string;
  frameThickness?: number;
  eliteBadgeColor?: string;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const proBorderGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const eliteBorderGradient = "from-[#EC4899] via-[#F97316] to-[#EAB308]";

const getPlanBadgeStyle = (plan: string) => {
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

const getBadgeStyleRank = (rank: number) => {
  if (rank === 1) {
    return 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-white shadow-lg shadow-yellow-500/30';
  } else if (rank === 2) {
    return 'bg-gradient-to-r from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0] text-gray-800 shadow-lg shadow-gray-400/30';
  } else if (rank === 3) {
    return 'bg-gradient-to-r from-[#CD7F32] via-[#E6A15C] to-[#CD7F32] text-white shadow-lg shadow-orange-500/30';
  }
  return 'bg-gray-100 text-gray-600';
};

const getCrownStyle = (rank: number) => {
  if (rank === 1) {
    return {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
    };
  }
  if (rank === 2) {
    return {
      background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
      boxShadow: '0 4px 15px rgba(192, 192, 192, 0.4)',
    };
  }
  if (rank === 3) {
    return {
      background: 'linear-gradient(135deg, #CD7F32, #B87333)',
      boxShadow: '0 4px 15px rgba(205, 127, 50, 0.4)',
    };
  }
  return {};
};

export default function ClicksLeaderboardTable() {
  const [ranking, setRanking] = useState<UserClicksRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('/api/ranking/clicks');
        if (res.ok) {
          const data = await res.json();
          setRanking(data.ranking || []);
        }
      } catch (err) {
        console.error('Failed to fetch ranking:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <Crown className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
        <h2 className="text-lg font-light text-[#18181B]">Elite Performers</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {ranking.length === 0 ? (
          <div className="px-6 py-12 text-center text-[#A1A1AA] text-sm">
            No data available
          </div>
        ) : (
          ranking.map((item) => {
            return (
            <div
              key={item.userId}
              className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              {/* Avatar with Frame */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 ${item.userPlan === 'premium' ? 'p-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]' : ''} ${item.userPlan === 'elite' && item.profileFrameType && item.profileFrameType !== 'none' ? 'p-[2px]' : ''}`}
                  style={{
                    ...(item.userPlan === 'premium' ? getGlowEffectStyle('premium') : {}),
                    ...(item.userPlan === 'elite' && item.profileFrameType && item.profileFrameType !== 'none' ? {
                      background: item.profileFrameType === 'elite' ? `linear-gradient(to right, ${getEliteBadgeGradient(item.eliteBadgeColor || 'crimson').from}, ${getEliteBadgeGradient(item.eliteBadgeColor || 'crimson').via}, ${getEliteBadgeGradient(item.eliteBadgeColor || 'crimson').to})` :
                               item.profileFrameType === 'elite-yellow' ? 'linear-gradient(to right, #F59E0B, #FBBF24, #FDE68A)' :
                               item.profileFrameType === 'elite-orange' ? 'linear-gradient(to right, #F97316, #FB923C, #FDBA74)' :
                               item.profileFrameType === 'elite-pink' ? 'linear-gradient(to right, #EC4899, #F472B6, #FDA4AF)' : '',
                      ...(getGlowEffectStyle(item.profileFrameType, item.eliteBadgeColor) || {})
                    } : {})
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5" style={{ borderColor: item.userPlan === 'premium' || (item.userPlan === 'elite' && item.profileFrameType && item.profileFrameType !== 'none') ? (item.userPlan === 'premium' ? '#8B5CF6' : (item.profileFrameType === 'elite' ? getEliteBadgeBorder(item.eliteBadgeColor || 'crimson') : item.profileFrameType === 'elite-yellow' ? '#F59E0B' : item.profileFrameType === 'elite-orange' ? '#F97316' : '#EC4899')) : '#E5E7EB' }}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {item.user?.avatar_url ? (
                        <Image
                          src={item.user.avatar_url}
                          alt={item.user.name || 'User'}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F9F9FB]">
                          <span className="text-xs text-gray-400 font-medium">
                            {item.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crown Badge for Top 3 - Bottom Left */}
                {item.rank <= 3 && getCrownStyle(item.rank) && (
                  <div
                    className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={getCrownStyle(item.rank)}
                  >
                    <Crown className="w-3 h-3 text-white fill-current" strokeWidth={2} />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[#18181B] truncate">
                    {item.user?.name || 'Anonymous'}
                  </h3>
                  {item.userPlan && item.userPlan !== 'free' && (
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-light uppercase tracking-tight ${getPlanBadgeStyle(item.userPlan)}`}>
                      {item.userPlan !== 'free' && <Crown size={5} fill="currentColor" />}
                      {getBadgeText(item.userPlan)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#A1A1AA] truncate">
                  {item.user?.email || ''}
                </p>
              </div>

              {/* Click Count */}
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${getBadgeStyleRank(item.rank)}`}>
                  {item.clickCount.toLocaleString()}
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
