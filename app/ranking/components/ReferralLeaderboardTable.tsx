"use client";

import { useEffect, useState } from 'react';
import { Users, Crown, Store } from 'lucide-react';
import Image from 'next/image';
import { getEliteBadgeGradient, getEliteBadgeBorder } from '@/lib/badge-colors';
import { getGlowEffectStyle, getCrownBadgeStyle } from '@/lib/profile-frame';

interface ReferralRanking {
  id: string;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  activeReferrals: number;
  rank: number;
  userPlan: string;
  profileFrameType?: string;
  frameThickness?: number;
  eliteBadgeColor?: string;
  accentColor?: string;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const proBorderGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const eliteBorderGradient = "from-[#EC4899] via-[#F97316] to-[#EAB308]";

const getBadgeStyle = (plan: string) => {
  switch (plan) {
    case 'premium':
      return `bg-gradient-to-r ${proBorderGradient} text-white border-2 border-transparent bg-clip-padding`;
    default:
      return 'bg-white border border-gray-200 text-[#A1A1AA]';
  }
};

const getBadgeText = (plan: string) => {
  switch (plan) {
    case 'premium':
      return 'PREMIUM';
    default:
      return 'FREE';
  }
};

export default function ReferralLeaderboardTable() {
  const [rankings, setRankings] = useState<ReferralRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch('/api/referral/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setRankings(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to fetch referral rankings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // Listen for profile updates from settings page
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Refresh rankings to get updated avatar
      fetch('/api/referral/leaderboard')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.leaderboard) {
            setRankings(data.leaderboard);
          }
        })
        .catch(err => console.error('Failed to refresh rankings on profile update:', err));
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          background: '#FFD700',
          color: '#1F2937',
          border: '2px solid #FFD700',
        };
      case 2:
        return {
          background: '#C0C0C0',
          color: '#1F2937',
          border: '2px solid #C0C0C0',
        };
      case 3:
        return {
          background: '#CD7F32',
          color: '#1F2937',
          border: '2px solid #CD7F32',
        };
      default:
        return {
          background: '#F3F4F6',
          color: '#6B7280',
          border: '1px solid #E5E7EB',
        };
    }
  };

  const getRankLabel = (rank: number) => {
    return `#${rank}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-light text-[#A1A1AA] tracking-widest">LOADING REFERRAL RANKINGS...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-50">
        {rankings.map((user) => {
          const rank = user.rank;
          const badgeStyle = getRankBadgeStyle(rank);

          return (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] transition-all duration-200"
            >
              {/* Avatar with Frame */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200 ${user.userPlan === 'premium' ? 'p-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]' : ''} ${user.userPlan === 'premium' && user.profileFrameType && user.profileFrameType !== 'none' ? 'p-[2px]' : ''}`}
                  style={{
                    ...(user.userPlan === 'premium' ? getGlowEffectStyle('premium') : {}),
                    ...(user.userPlan === 'premium' && user.profileFrameType && user.profileFrameType !== 'none' ? {
                      background: user.profileFrameType === 'elite' ? `linear-gradient(to right, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').from}, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').via}, ${getEliteBadgeGradient(user.eliteBadgeColor || 'crimson').to})` :
                               user.profileFrameType === 'elite-yellow' ? 'linear-gradient(to right, #F59E0B, #FBBF24, #FDE68A)' :
                               user.profileFrameType === 'elite-orange' ? 'linear-gradient(to right, #F97316, #FB923C, #FDBA74)' :
                               user.profileFrameType === 'elite-pink' ? 'linear-gradient(to right, #EC4899, #F472B6, #FDA4AF)' : '',
                      ...(getGlowEffectStyle(user.profileFrameType, user.eliteBadgeColor) || {})
                    } : {})
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5" style={{ borderColor: user.userPlan === 'premium' || (user.userPlan === 'premium' && user.profileFrameType && user.profileFrameType !== 'none') ? (user.userPlan === 'premium' ? '#8B5CF6' : (user.profileFrameType === 'elite' ? getEliteBadgeBorder(user.eliteBadgeColor || 'crimson') : user.profileFrameType === 'elite-yellow' ? '#F59E0B' : user.profileFrameType === 'elite-orange' ? '#F97316' : '#EC4899')) : '#E5E7EB' }}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F3F4F6]">
                          <Store className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crown Badge for ALL PREMIUM users */}
                {user.userPlan === 'premium' ? (
                  <div
                    className="absolute -top-1 -right-1 rounded-full p-1 shadow-lg"
                    style={getCrownBadgeStyle(user.profileFrameType, user.eliteBadgeColor || 'crimson')}
                  >
                    <Crown className="w-3 h-3 text-white fill-current" strokeWidth={2} />
                  </div>
                ) : null}

                {/* Rank Badge - Bottom Left */}
                <div
                  className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={badgeStyle}
                >
                  {getRankLabel(rank)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[#18181B] truncate">{user.username || user.name || 'Anonymous'}</h3>
                  {user.userPlan && user.userPlan !== 'free' && (
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-light uppercase tracking-tight ${getBadgeStyle(user.userPlan)}`}>
                      {user.userPlan !== 'free' && <Crown size={5} fill="currentColor" />}
                      {getBadgeText(user.userPlan)}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Referrals Count */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-2 justify-end">
                  <Users className="w-4 h-4" strokeWidth={1.5} style={{ color: '#8B5CF6' }} />
                  <span
                    className="text-xl font-light"
                    style={{
                      background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {user.activeReferrals}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider font-light text-[#A1A1AA]">Upgrades</p>
              </div>
            </div>
          );
        })}
      </div>

      {rankings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-light text-[#A1A1AA]">No referral rankings available yet</p>
        </div>
      )}
    </div>
  );
}
