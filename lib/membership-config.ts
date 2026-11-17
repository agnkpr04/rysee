/**
 * Membership Tier Configuration
 *
 * Source of truth untuk semua harga, limit, komisi, dan referral.
 * Ubah di sini saja kalau ada perubahan harga/struktur.
 */

export type MembershipTier = 'free' | 'premium';

// ============================================================================
// TIER PRICES (Rupiah)
// ============================================================================
export const TIER_PRICES: Record<MembershipTier, number> = {
  free: 0,
  premium: 59000,
};

// ============================================================================
// PRODUCT LIMITS (Shopee products per user store)
// ============================================================================
export const TIER_PRODUCT_LIMIT: Record<MembershipTier, number> = {
  free: Infinity,
  premium: Infinity,
};

// ============================================================================
// COMMISSION RATE (untuk template & digital product sales di toko reseller)
// ============================================================================
export const TEMPLATE_COMMISSION_RATE: Record<MembershipTier, number> = {
  free: 0.15, // 15%
  premium: 0.35, // 35%
};

export const DIGITAL_PRODUCT_COMMISSION_RATE: Record<MembershipTier, number> = {
  free: 0.20, // 20%
  premium: 0.80, // 80%
};

// Legacy: for backward compatibility, default to digital product rate
export const TIER_COMMISSION_RATE = DIGITAL_PRODUCT_COMMISSION_RATE;

// ============================================================================
// REFERRAL COMMISSION MATRIX (Rupiah per upgrade)
// matrix[referrerTier][referredTier] = amount referrer dapat
// ============================================================================
// Referral commission: free referrer → 12K (20%)
// premium referrer → 50K (85%)
export const REFERRAL_MATRIX: Record<
  MembershipTier,
  { premium: number }
> = {
  free: { premium: 12000 },
  premium: { premium: 50000 },
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Normalize plan string to valid MembershipTier.
 * Defaults to 'free' if invalid.
 */
export function normalizeTier(plan: string | null | undefined): MembershipTier {
  if (plan === 'premium' || plan === 'free') {
    return plan;
  }
  return 'free';
}

/**
 * Get referral commission amount for a given referrer tier and referred tier.
 * Returns 0 if invalid combination (e.g., refer ke free).
 */
export function getReferralCommission(
  referrerTier: MembershipTier,
  referredTier: MembershipTier
): number {
  if (referredTier === 'free') return 0;
  return REFERRAL_MATRIX[referrerTier][referredTier] || 0;
}

/**
 * Get commission rate for product sales based on store owner's tier.
 */
export function getCommissionRate(tier: MembershipTier): number {
  return TIER_COMMISSION_RATE[tier];
}

/**
 * Get commission rate for template sales based on store owner's tier.
 */
export function getTemplateCommissionRate(tier: MembershipTier): number {
  return TEMPLATE_COMMISSION_RATE[tier];
}

/**
 * Get commission rate for digital product sales based on store owner's tier.
 */
export function getDigitalProductCommissionRate(tier: MembershipTier): number {
  return DIGITAL_PRODUCT_COMMISSION_RATE[tier];
}

/**
 * Get product limit for a tier. Returns Infinity for unlimited.
 */
export function getProductLimit(tier: MembershipTier): number {
  return TIER_PRODUCT_LIMIT[tier];
}

/**
 * Get expected price for a paid tier upgrade.
 */
export function getTierPrice(tier: MembershipTier): number {
  return TIER_PRICES[tier];
}

/**
 * Validate that an amount matches the expected tier price.
 */
export function isValidTierAmount(tier: MembershipTier, amount: number): boolean {
  return TIER_PRICES[tier] === amount;
}

/**
 * Display name for a tier (for UI).
 */
export function getTierDisplayName(tier: MembershipTier): string {
  const names: Record<MembershipTier, string> = {
    free: 'Free',
    premium: 'Premium',
  };
  return names[tier];
}

/**
 * Check if a tier is paid (Premium).
 */
export function isPaidTier(tier: MembershipTier): boolean {
  return tier === 'premium';
}

// ============================================================================
// PAYMENT MODE CONFIGURATION
// 'manual' = hanya transfer manual (admin approval)
// 'midtrans' = hanya Midtrans payment gateway (otomatis)
// 'both' = user bisa pilih manual atau midtrans
// ============================================================================
export type PaymentMode = 'manual' | 'midtrans' | 'both';

export function getPaymentMode(): PaymentMode {
  const mode = process.env.NEXT_PUBLIC_PAYMENT_MODE as PaymentMode;
  if (mode === 'manual' || mode === 'midtrans' || mode === 'both') {
    return mode;
  }
  return 'manual'; // Default to manual saat Midtrans belum diapprove
}

// ============================================================================
// MANUAL PAYMENT ACCOUNT INFO
// ============================================================================
export const PAYMENT_ACCOUNTS = [
  {
    id: 'bca',
    name: 'BCA',
    accountNumber: '5358178183',
    accountName: 'Agung Prayitno',
    icon: '🏦',
  },
  {
    id: 'dana',
    name: 'DANA',
    accountNumber: '082218455821',
    accountName: 'Agung Prayitno',
    icon: '💳',
  },
  {
    id: 'ovo',
    name: 'OVO',
    accountNumber: '082218455821',
    accountName: 'Agung Prayitno',
    icon: '💳',
  },
] as const;

export type PaymentAccountId = typeof PAYMENT_ACCOUNTS[number]['id'];
