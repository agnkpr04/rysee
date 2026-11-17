import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTemplateCommissionRate, normalizeTier } from '@/lib/membership-config';
import { sendAffiliateOrderNotification } from '@/lib/email';

// Check if user is admin from admin_session cookie (cookie stores admin.id)
async function isAdminFromCookie(cookie: string | null) {
  if (!cookie) return false;

  const admin = await prisma.admin.findFirst({
    where: { id: cookie },
  });

  return !!admin;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookies = request.headers.get('cookie');
    const adminSession = cookies?.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];

    const isUserAdmin = await isAdminFromCookie(adminSession || null);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const order = await prisma.templateOrder.findUnique({
      where: { id },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Pre-calculate commission before transaction
    let commissionAmount = 0;
    if (order.affiliateId) {
      const affiliateSubscription = await prisma.subscription.findUnique({
        where: { userId: order.affiliateId },
      });
      const affiliateTier = affiliateSubscription?.status === 'active'
        ? normalizeTier(affiliateSubscription.plan)
        : 'free';
      const commissionRate = getTemplateCommissionRate(affiliateTier);
      commissionAmount = Math.floor(order.userTemplate.masterTemplate.price * commissionRate);

      console.log('[Template Order Approve] Commission calculated:', {
        orderId: order.id,
        affiliateId: order.affiliateId,
        affiliateTier,
        commissionRate,
        commission: commissionAmount,
      });
    }

    // Atomic transaction: update order status + credit commission
    await prisma.$transaction(async (tx) => {
      await tx.templateOrder.update({
        where: { id },
        data: {
          status: 'paid',
        },
      });

      if (order.affiliateId && commissionAmount > 0) {
        await tx.$executeRaw`
          UPDATE "User"
          SET "template_earnings" = "template_earnings" + ${commissionAmount}
          WHERE id = ${order.affiliateId}
        `;
        console.log('[Template Order Approve] Commission credited:', {
          orderId: order.id,
          affiliateId: order.affiliateId,
          commission: commissionAmount,
        });
      }
    });

    console.log('[Template Order Approve] Payment approved and commission credited:', {
      orderId: order.id,
      affiliateId: order.affiliateId,
      price: order.userTemplate.masterTemplate.price,
    });

    // Send notification to affiliate (store owner)
    if (order.affiliateId) {
      const affiliate = await prisma.user.findUnique({
        where: { id: order.affiliateId },
        select: { email: true, name: true }
      });
      if (affiliate) {
        await sendAffiliateOrderNotification(
          affiliate.email,
          affiliate.name,
          order.customerName || 'Customer',
          order.customerEmail || '',
          order.userTemplate.masterTemplate.title,
          'template',
          order.userTemplate.masterTemplate.price
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving order:', error);
    return NextResponse.json(
      { error: 'Failed to approve order' },
      { status: 500 }
    );
  }
}
