import { prisma } from '@/lib/prisma';
import {
  normalizeTier,
  getProductLimit,
  getCommissionRate,
  isPaidTier,
  type MembershipTier,
} from '@/lib/membership-config';

export interface MembershipInfo {
  isPremium: boolean;
  isPaid: boolean;
  status: string;
  plan: MembershipTier;
  endDate: Date | null;
  productLimit: number;
  downloadLimit: number;
  commissionRate: number;
}

export async function getUserMembership(userId: string): Promise<MembershipInfo> {
  try {
    console.log('[getUserMembership] userId:', userId);
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    console.log('[getUserMembership] subscription:', subscription);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { eliteBadgeColor: true },
    });

    if (!subscription) {
      console.log('[getUserMembership] No subscription found, returning free');
      return {
        isPremium: false,
        isPaid: false,
        status: 'free',
        plan: 'free',
        endDate: null,
        productLimit: getProductLimit('free'),
        downloadLimit: Infinity,
        commissionRate: getCommissionRate('free'),
      };
    }

    // Check if subscription is active (one-time payment model - no expiration)
    const isActive = subscription.status === 'active';
    const tier: MembershipTier = isActive ? normalizeTier(subscription.plan) : 'free';
    console.log('[getUserMembership] subscription status:', subscription.status, 'isActive:', isActive, 'tier:', tier);

    const productLimit = getProductLimit(tier);
    const downloadLimit = Infinity; // All tiers get unlimited download (per new spec)
    const commissionRate = getCommissionRate(tier);

    const result: MembershipInfo = {
      isPremium: tier === 'premium',
      isPaid: isPaidTier(tier),
      status: isActive ? 'active' : subscription.status,
      plan: tier,
      endDate: null,
      productLimit,
      downloadLimit,
      commissionRate,
    };
    console.log('[getUserMembership] result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get user membership:', error);
    // Default to free on error
    return {
      isPremium: false,
      isPaid: false,
      status: 'free',
      plan: 'free',
      endDate: null,
      productLimit: getProductLimit('free'),
      downloadLimit: Infinity,
      commissionRate: getCommissionRate('free'),
    };
  }
}

export async function canUserAddProduct(userId: string, currentProductCount: number): Promise<{ canAdd: boolean; reason?: string }> {
  const membership = await getUserMembership(userId);

  if (currentProductCount >= membership.productLimit) {
    const tierLabel = membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1);
    return {
      canAdd: false,
      reason: membership.plan === 'premium'
        ? 'Unlimited products allowed for Premium members'
        : `Limit tier ${tierLabel} tercapai (${membership.productLimit} produk). Upgrade ke Premium untuk lebih banyak slot!`,
    };
  }

  return { canAdd: true };
}

export async function canUserDownload(userId: string, currentDownloadCount: number): Promise<{ canDownload: boolean; reason?: string }> {
  const membership = await getUserMembership(userId);

  if (currentDownloadCount >= membership.downloadLimit) {
    return {
      canDownload: false,
      reason: membership.isPremium
        ? 'Unlimited downloads allowed for Premium members'
        : `Free account download limit reached (${membership.downloadLimit} downloads). Upgrade to Premium for unlimited downloads!`,
    };
  }

  return { canDownload: true };
}

export async function canUserAddTemplate(userId: string): Promise<{ canAdd: boolean; reason?: string }> {
  // All tiers (free, pro, premium) can add templates unlimited
  return { canAdd: true };
}
