import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCommissionRate, normalizeTier, type MembershipTier } from '@/lib/membership-config';

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.digitalProductOrder.findMany({
      where,
      include: {
        userDigitalProduct: {
          include: {
            masterDigitalProduct: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Batch-fetch affiliate users + subscriptions to enrich orders
    const affiliateIds = [...new Set(orders.map(o => o.affiliateId).filter(Boolean) as string[])];
    const [affiliates, subscriptions] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: affiliateIds } },
        select: { id: true, name: true, storeName: true, username: true, email: true },
      }),
      prisma.subscription.findMany({
        where: { userId: { in: affiliateIds } },
      }),
    ]);

    const affiliateMap = new Map(affiliates.map(a => [a.id, a]));
    const tierMap = new Map<string, MembershipTier>();
    subscriptions.forEach(s => {
      const tier = s.status === 'active' ? normalizeTier(s.plan) : 'free';
      tierMap.set(s.userId, tier);
    });

    const enrichedOrders = orders.map(order => {
      const affiliate = order.affiliateId ? affiliateMap.get(order.affiliateId) : null;
      const tier: MembershipTier = order.affiliateId ? (tierMap.get(order.affiliateId) || 'free') : 'free';
      const price = order.userDigitalProduct.masterDigitalProduct.price || 0;
      const commissionRate = getCommissionRate(tier);
      const commissionAmount = order.affiliateId ? Math.floor(price * commissionRate) : 0;

      return {
        ...order,
        affiliate: affiliate ? {
          id: affiliate.id,
          name: affiliate.name,
          storeName: affiliate.storeName,
          username: affiliate.username,
          email: affiliate.email,
          tier,
          commissionRate,
          commissionAmount,
        } : null,
      };
    });

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
