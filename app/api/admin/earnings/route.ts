import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTemplateCommissionRate, getDigitalProductCommissionRate, normalizeTier, type MembershipTier } from '@/lib/membership-config';

// Check if user is admin from admin_session cookie (cookie stores admin.id)
async function isAdminFromCookie(cookie: string | null) {
  if (!cookie) return false;

  const admin = await prisma.admin.findFirst({
    where: { id: cookie },
  });

  return !!admin;
}

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie');
    const adminSession = cookies?.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];

    const isUserAdmin = await isAdminFromCookie(adminSession || null);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // ========================================
    // 1. TEMPLATE ORDERS (verified)
    // ========================================
    const templateOrders = await prisma.templateOrder.findMany({
      where: { status: 'verified' },
      include: {
        userTemplate: {
          include: {
            masterTemplate: {
              select: { price: true },
            },
          },
        },
      },
    });

    // ========================================
    // 2. DIGITAL PRODUCT ORDERS (verified)
    // ========================================
    const digitalProductOrders = await prisma.digitalProductOrder.findMany({
      where: { status: 'verified' },
      include: {
        userDigitalProduct: {
          include: {
            masterDigitalProduct: {
              select: { price: true },
            },
          },
        },
      },
    });

    // ========================================
    // 3. Pre-fetch affiliate subscriptions to avoid N+1 queries
    // ========================================
    const affiliateIds = [
      ...new Set([
        ...templateOrders.map((o) => o.affiliateId).filter(Boolean) as string[],
        ...digitalProductOrders.map((o) => o.affiliateId).filter(Boolean) as string[],
      ]),
    ];

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: { in: affiliateIds } },
    });
    const tierByUser = new Map<string, MembershipTier>();
    subscriptions.forEach((s) => {
      const tier = s.status === 'active' ? normalizeTier(s.plan) : 'free';
      tierByUser.set(s.userId, tier);
    });

    // ========================================
    // 4. Calculate revenue & commission per-tier
    // ========================================
    const tierBreakdown: Record<MembershipTier, { revenue: number; commission: number; orders: number }> = {
      free: { revenue: 0, commission: 0, orders: 0 },
      premium: { revenue: 0, commission: 0, orders: 0 },
    };

    let totalTemplateRevenue = 0;
    let totalDigitalRevenue = 0;
    let totalUserCommissions = 0;

    for (const order of templateOrders) {
      const price = order.userTemplate.masterTemplate.price || 0;
      const tier = order.affiliateId ? (tierByUser.get(order.affiliateId) || 'free') : 'free';
      const commission = order.affiliateId ? Math.floor(price * getTemplateCommissionRate(tier)) : 0;

      totalTemplateRevenue += price;
      totalUserCommissions += commission;
      tierBreakdown[tier].revenue += price;
      tierBreakdown[tier].commission += commission;
      tierBreakdown[tier].orders += 1;
    }

    for (const order of digitalProductOrders) {
      const price = order.userDigitalProduct.masterDigitalProduct.price || 0;
      const tier = order.affiliateId ? (tierByUser.get(order.affiliateId) || 'free') : 'free';
      const commission = order.affiliateId ? Math.floor(price * getDigitalProductCommissionRate(tier)) : 0;

      totalDigitalRevenue += price;
      totalUserCommissions += commission;
      tierBreakdown[tier].revenue += price;
      tierBreakdown[tier].commission += commission;
      tierBreakdown[tier].orders += 1;
    }

    const totalSalesRevenue = totalTemplateRevenue + totalDigitalRevenue;

    // ========================================
    // 5. Membership payments (Pro/Premium upgrades)
    // ========================================
    const membershipPayments = await prisma.payment.aggregate({
      where: { status: 'success' },
      _sum: { amount: true, referralFee: true, platformFee: true },
    });
    const totalMembershipRevenue = membershipPayments._sum.amount || 0;
    const totalReferralPayouts = membershipPayments._sum.referralFee || 0;
    const totalMembershipPlatformFee = membershipPayments._sum.platformFee || 0;

    // ========================================
    // 6. Withdrawals
    // ========================================
    const pendingWithdrawals = await prisma.withdrawRequest.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
    });
    const totalPendingWithdrawals = pendingWithdrawals._sum.amount || 0;

    const approvedWithdrawals = await prisma.withdrawRequest.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true },
    });
    const totalPaidWithdrawals = approvedWithdrawals._sum.amount || 0;

    const pendingWithdrawalCount = await prisma.withdrawRequest.count({
      where: { status: 'pending' },
    });

    // ========================================
    // 7. Final platform calculations
    // ========================================
    // Platform revenue from sales = total revenue - user commissions
    const salesPlatformRevenue = totalSalesRevenue - totalUserCommissions;

    // Total platform revenue = sales platform share + membership platform fee
    const platformRevenue = salesPlatformRevenue + totalMembershipPlatformFee;

    // Available balance = platform revenue - paid withdrawals - pending withdrawals
    const availableBalance = platformRevenue - totalPendingWithdrawals - totalPaidWithdrawals;

    const totalSales = templateOrders.length + digitalProductOrders.length;

    return NextResponse.json({
      // Sales (templates + digital products)
      totalSalesRevenue,
      totalTemplateRevenue,
      totalDigitalRevenue,
      totalUserCommissions,
      salesPlatformRevenue,

      // Per-tier breakdown
      tierBreakdown,

      // Membership upgrades
      totalMembershipRevenue,
      totalReferralPayouts,
      totalMembershipPlatformFee,

      // Withdrawals
      totalPendingWithdrawals,
      totalPaidWithdrawals,
      pendingWithdrawalCount,

      // Final
      platformRevenue,
      availableBalance,

      // Stats
      totalSales,
      totalTemplateSales: templateOrders.length,
      totalDigitalSales: digitalProductOrders.length,
    });
  } catch (error) {
    console.error('Error fetching admin earnings:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings data' }, { status: 500 });
  }
}
