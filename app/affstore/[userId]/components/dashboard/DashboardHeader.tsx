"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Share2,
  Trophy,
  Settings,
  ExternalLink,
  User,
  Crown,
  LogOut,
  MoreVertical,
  MessageCircle,
  Lock,
  Edit,
  Package,
  Link2,
} from 'lucide-react';
import { getProfileFrameClasses, getGlowEffectClasses, getEliteFrameStyle, getGlowEffectStyle, getCrownBadgeStyle } from '@/lib/profile-frame';
import { getEliteBadgeGradient, getEliteBadgeBorder } from '@/lib/badge-colors';
import TierBadge from '@/components/TierBadge';

interface DashboardHeaderProps {
  isPremium: boolean;
  userPlan: string;
  userId: string;
  userName: string;
  fullName?: string;
  userAvatar: string;
  username?: string;
  onShare: () => void;
  profileFrameType?: string;
  frameThickness?: number;
  accentColor?: string;
  onUpgradeModalOpen?: () => void;
  eliteBadgeColor?: string;
  onBioClick?: () => void;
  onKontenKitClick?: () => void;
  activeTab?: 'products' | 'referral' | 'earnings' | 'bio' | 'konten-kit';
}

export default function DashboardHeader({ isPremium, userPlan, userId, userName, fullName, userAvatar, username, onShare, profileFrameType = 'none', frameThickness = 2, accentColor = '#8B5CF6', onUpgradeModalOpen, eliteBadgeColor = 'crimson', onBioClick, onKontenKitClick, activeTab }: DashboardHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPcMenuOpen, setIsPcMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pcMenuRef = useRef<HTMLDivElement>(null);
  const [avatarError, setAvatarError] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close PC menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pcMenuRef.current && !pcMenuRef.current.contains(event.target as Node)) {
        setIsPcMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleViewStore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (username) {
      router.push(`/${username}`);
    } else if (userId) {
      router.push(`/user/${userId}`);
    }
  };

  const handlePrivateGroupClick = () => {
    const WHATSAPP_PRIVATE_LINK = "https://chat.whatsapp.com/KcDZOO592FK1SIkXOyWVj6";
    if (isPremium) {
      window.open(WHATSAPP_PRIVATE_LINK, '_blank');
    }
  };

  const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

  return (
    <header className="w-full bg-white relative border-b border-gray-50 font-light overflow-visible">
      {/* SHARE ICON - Mobile Only */}
      <div className="md:hidden absolute top-5 right-5 z-10 flex items-center gap-2">
        <button onClick={onShare} className="p-2.5 text-neutral-400 bg-neutral-50 rounded-full active:scale-90 transition-all">
          <Share2 size={18} strokeWidth={1.5} />
        </button>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 text-neutral-400 bg-neutral-50 rounded-full active:scale-90 transition-all"
          >
            <MoreVertical size={18} strokeWidth={1.5} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[140px] z-20">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-xs text-[#18181B] hover:bg-[#F9F9FB] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={14} strokeWidth={1.5} />
                Pengaturan
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* PROFILE INFO GROUP */}
          <div className="flex items-center gap-5 md:gap-8">
            {/* AVATAR */}
            <div className="relative flex-shrink-0">
              {(() => {
                const hasFrame = userPlan === 'premium' && profileFrameType && profileFrameType !== 'none';
                const frameStyle: React.CSSProperties = hasFrame ? {
                  borderColor: 'transparent',
                  ...(profileFrameType === 'pro' ? {
                    background: 'linear-gradient(135deg, #8B5CF6, #D946EF, #EC4899)',
                    border: '3px solid #8B5CF6',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(217, 70, 239, 0.2)',
                  } : {}),
                  ...(profileFrameType === 'elite' ? {
                    background: `linear-gradient(135deg, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').via}, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').to})`,
                    border: `3px solid ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}`,
                    boxShadow: `0 0 20px ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}66, 0 0 40px ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}33`,
                  } : {}),
                  ...(profileFrameType === 'elite-yellow' ? {
                    background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #FDE68A)',
                    border: '3px solid #F59E0B',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
                  } : {}),
                  ...(profileFrameType === 'elite-orange' ? {
                    background: 'linear-gradient(135deg, #F97316, #FB923C, #FDBA74)',
                    border: '3px solid #F97316',
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(251, 146, 60, 0.2)',
                  } : {}),
                  ...(profileFrameType === 'elite-pink' ? {
                    background: 'linear-gradient(135deg, #EC4899, #F472B6, #FDA4AF)',
                    border: '3px solid #EC4899',
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
                  } : {}),
                } : {};

                return (
                  <div
                    className={`w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center ${hasFrame ? 'p-[3px]' : ''}`}
                    style={frameStyle}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#F9F9FB] flex items-center justify-center">
                      {userAvatar && !avatarError ? (
                        <Image
                          src={userAvatar}
                          alt={userName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <User className="w-8 h-8 md:w-10 md:h-10 text-[#D1D1D6]" strokeWidth={1} />
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* TEXT INFO */}
            <div className="flex flex-col gap-1.5 md:gap-2 overflow-visible">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-medium text-[#18181B] tracking-tight">{fullName || userName}</h1>
                <div className="hidden md:block">
                  <TierBadge tier={userPlan} size="md" variant="solid" />
                </div>
              </div>

              {/* STATS & BADGE MOBILE */}
              <div className="flex items-center gap-5 overflow-visible">
                {/* Mobile Status Badge */}
                <div className="md:hidden">
                  <TierBadge tier={userPlan} size="sm" variant="solid" />
                </div>
              </div>
            </div>
          </div>

          {/* PC SHARE PROFILE */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={onShare} className="flex items-center gap-2 px-5 py-2 border border-gray-100 rounded-full text-[12px] font-light text-[#18181B] bg-white hover:shadow-sm transition-all active:scale-95">
              <Share2 size={14} strokeWidth={1.5} className="text-[#8B5CF6]" />
              Bagikan Toko
            </button>
            <div className="relative" ref={pcMenuRef}>
              <button
                onClick={() => setIsPcMenuOpen(!isPcMenuOpen)}
                className="p-2.5 text-neutral-400 bg-neutral-50 rounded-full active:scale-90 transition-all"
              >
                <MoreVertical size={18} strokeWidth={1.5} />
              </button>
              {isPcMenuOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[140px] z-20">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#18181B] hover:bg-[#F9F9FB] transition-colors"
                    onClick={() => setIsPcMenuOpen(false)}
                  >
                    <Settings size={14} strokeWidth={1.5} />
                    Pengaturan
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsPcMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA BUTTONS BAR (Satu Baris Persegi Panjang) */}
        <div className="mt-8 md:mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:flex md:justify-end md:gap-3 font-light">
            <button
              onClick={handleViewStore}
              disabled={!userId}
              className={`flex items-center justify-center gap-2 px-1 py-3 md:px-6 md:py-2 bg-white border border-gray-100 rounded-xl md:rounded-full text-[10px] md:text-xs text-[#18181B] shadow-sm active:scale-95 transition-all ${!userId ? 'opacity-30' : ''}`}
            >
              <Edit size={14} strokeWidth={1.5} className="text-[#8B5CF6]" />
              <span>Edit Toko</span>
            </button>

            <button
              onClick={() => {
                if (isPremium) {
                  handlePrivateGroupClick();
                } else {
                  onUpgradeModalOpen?.();
                }
              }}
              className={`flex items-center justify-center gap-2 px-1 py-3 md:px-6 md:py-2 rounded-xl md:rounded-full text-[10px] md:text-xs shadow-sm active:scale-95 transition-all ${
                isPremium
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {isPremium ? <MessageCircle size={14} strokeWidth={1.5} /> : <Lock size={14} strokeWidth={1.5} />}
              <span>Kelas Digital</span>
            </button>

            <button
              onClick={onBioClick}
              className={`flex items-center justify-center gap-2 px-1 py-3 md:px-6 md:py-2 rounded-xl md:rounded-full text-[10px] md:text-xs shadow-sm active:scale-95 transition-all ${
                activeTab === 'bio'
                  ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 border-[#8B5CF6]/30 text-[#8B5CF6]'
                  : 'bg-white border border-gray-100 text-[#18181B]'
              }`}
            >
              <Link2 size={14} strokeWidth={1.5} className={activeTab === 'bio' ? 'text-[#8B5CF6]' : 'text-[#8B5CF6]'} />
              <span>Bio Link</span>
            </button>

            <button
              onClick={onKontenKitClick}
              className={`flex items-center justify-center gap-2 px-1 py-3 md:px-6 md:py-2 rounded-xl md:rounded-full text-[10px] md:text-xs shadow-sm active:scale-95 transition-all ${
                activeTab === 'konten-kit'
                  ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 border-[#8B5CF6]/30 text-[#8B5CF6]'
                  : 'bg-white border border-gray-100 text-[#18181B]'
              }`}
            >
              <Package size={14} strokeWidth={1.5} className={activeTab === 'konten-kit' ? 'text-[#8B5CF6]' : 'text-[#8B5CF6]'} />
              <span>Konten Kit</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}