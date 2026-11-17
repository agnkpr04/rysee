import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDigitalProductCommissionRate, normalizeTier, type MembershipTier } from '@/lib/membership-config';

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

    // Get all verified digital product orders
    const verifiedOrders = await prisma.digitalProductOrder.findMany({
      where: { status: 'verified' },
      include: {
        userDigitalProduct: {
          include: {
            masterDigitalProduct: true,
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
      (sum, order) => sum + order.userDigitalProduct.masterDigitalProduct.price,
      0
    );

    const totalSales = verifiedOrders.length;

    // Calculate total user commissions based on affiliate's tier
    const totalUserCommissions = verifiedOrders.reduce(
      (sum, order) => {
        const price = order.userDigitalProduct.masterDigitalProduct.price;
        const tier: MembershipTier = order.affiliateId ? (tierMap.get(order.affiliateId) || 'free') : 'free';
        const commission = order.affiliateId ? Math.floor(price * getDigitalProductCommissionRate(tier)) : 0;
        return sum + commission;
      },
      0
    );

    const platformRevenue = totalSalesRevenue - totalUserCommissions;

    // Get all pending withdrawals for ebook earnings
    const pendingWithdrawals = await prisma.$queryRaw`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM "WithdrawRequest"
      WHERE status = 'pending'
    `;

    const totalPendingWithdrawals = (pendingWithdrawals as any)[0]?.total || 0;

    // Get all paid withdrawals for ebook earnings
    const paidWithdrawals = await prisma.$queryRaw`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM "WithdrawRequest"
      WHERE status = 'approved'
    `;

    const totalPaidWithdrawals = (paidWithdrawals as any)[0]?.total || 0;

    // Calculate available balance
    const availableBalance = totalUserCommissions - totalPendingWithdrawals - totalPaidWithdrawals;

    const pendingWithdrawalCount = await prisma.withdrawRequest.count({
      where: {
        status: 'pending',
      },
    });

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
    console.error('Error fetching digital product earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital product earnings' },
      { status: 500 }
    );
  }
}
