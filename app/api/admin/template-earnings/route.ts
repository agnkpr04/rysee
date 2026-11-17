import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTemplateCommissionRate, normalizeTier, type MembershipTier } from '@/lib/membership-config';

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

    // Get all verified template orders
    const verifiedOrders = await prisma.templateOrder.findMany({
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

    // Batch-fetch affiliate subscriptions to calculate tier-based commissions
    const affiliateIds = [...new Set(verifiedOrders.map(o => o.affiliateId).filter(Boolean) as string[])];
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: { in: affiliateIds } },
    });
    const tierMap = new Map<string, MembershipTier>();
    subscriptions.forEach(s => {
      const tier = s.status === 'active' ? normalizeTier(s.plan) : 'free';
      tierMap.set(s.userId, tier);
    });

    // Calculate totals
    const totalSalesRevenue = verifiedOrders.reduce(
      (sum, order) => sum + (order.userTemplate.masterTemplate.price || 0),
      0
    );

    const totalSales = verifiedOrders.length;

    // Calculate total user commissions based on affiliate's tier
    const totalUserCommissions = verifiedOrders.reduce(
      (sum, order) => {
        const price = order.userTemplate.masterTemplate.price || 0;
        const tier: MembershipTier = order.affiliateId ? (tierMap.get(order.affiliateId) || 'free') : 'free';
        const commission = order.affiliateId ? Math.floor(price * getTemplateCommissionRate(tier)) : 0;
        return sum + commission;
      },
      0
    );

    const platformRevenue = totalSalesRevenue - totalUserCommissions;

    // Get template-specific pending withdrawals (from template_earnings)
    const allUsers = await prisma.user.aggregate({
      _sum: { template_earnings: true },
    });
    const totalTemplateEarningsInSystem = allUsers._sum.template_earnings || 0;

    // Get all pending withdrawals
    const pendingWithdrawals = await prisma.withdrawRequest.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
    });
    const totalPendingWithdrawals = pendingWithdrawals._sum.amount || 0;

    // Get all paid withdrawals
    const paidWithdrawals = await prisma.withdrawRequest.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true },
    });
    const totalPaidWithdrawals = paidWithdrawals._sum.amount || 0;

    const pendingWithdrawalCount = await prisma.withdrawRequest.count({
      where: { status: 'pending' },
    });

    // Available balance for template = platform revenue from templates
    const availableBalance = platformRevenue;

    return NextResponse.json({
      totalSalesRevenue,
      totalUserCommissions,
      totalPendingWithdrawals,
      totalPaidWithdrawals,
      availableBalance,
      platformRevenue,
      totalSales,
      pendingWithdrawalCount,
    });
  } catch (error) {
    console.error('Error fetching template earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template earnings' },
      { status: 500 }
    );
  }
}
