"use client";

import { Crown, Sparkles, User } from 'lucide-react';
import type { MembershipTier } from '@/lib/membership-config';

interface TierBadgeProps {
  tier: MembershipTier | string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'solid' | 'outline' | 'soft';
  showIcon?: boolean;
  className?: string;
}

/**
 * Reusable tier badge for displaying user's membership tier (Free/Pro/Premium)
 * with consistent styling across the app.
 */
export default function TierBadge({
  tier,
  size = 'sm',
  variant = 'solid',
  showIcon = true,
  className = '',
}: TierBadgeProps) {
  const normalizedTier = (tier === 'free' || tier === 'premium')
    ? tier
    : 'free';

  // Size classes
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };
  const iconSize = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  // Tier-specific styling
  const tierStyles: Record<
    MembershipTier,
    { solid: string; outline: string; soft: string; icon: any; label: string }
  > = {
    free: {
      solid: 'bg-gray-200 text-gray-700',
      outline: 'border border-gray-300 text-gray-600 bg-white',
      soft: 'bg-gray-100 text-gray-600',
      icon: User,
      label: 'Free',
    },
    premium: {
      solid: 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#FBBF24] text-white shadow-sm',
      outline: 'border border-[#D946EF] text-[#D946EF] bg-white',
      soft: 'bg-gradient-to-r from-[#8B5CF6]/10 via-[#D946EF]/10 to-[#FBBF24]/10 text-[#8B5CF6]',
      icon: Crown,
      label: 'Premium',
    },
  };

  const style = tierStyles[normalizedTier];
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-full ${sizeClasses[size]} ${style[variant]} ${className}`}
    >
      {showIcon && <Icon className={iconSize[size]} strokeWidth={2} />}
      <span>{style.label}</span>
    </span>
  );
}
