import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCommissionRate, normalizeTier } from '@/lib/membership-config';
import { sendOrderApprovalNotification, sendAffiliateOrderNotification } from '@/lib/email';

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

    const order = await prisma.digitalProductOrder.findUnique({
      where: { id },
      include: { userDigitalProduct: { include: { masterDigitalProduct: true } } },
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
      const commissionRate = getCommissionRate(affiliateTier);
      commissionAmount = Math.floor(order.userDigitalProduct.masterDigitalProduct.price * commissionRate);

      console.log('[Digital Product Order Approve] Crediting commission:', {
        affiliateId: order.affiliateId,
        affiliateTier,
        commissionRate,
        commission: commissionAmount,
      });
    }

    // Atomic transaction: update order status + credit commission
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.digitalProductOrder.update({
        where: { id },
        data: {
          status: 'verified',
          downloadUrl: order.userDigitalProduct.masterDigitalProduct.downloadUrl,
          downloadExpireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        include: { userDigitalProduct: { include: { masterDigitalProduct: true } } },
      });

      if (order.affiliateId && commissionAmount > 0) {
        await tx.$executeRaw`
          UPDATE "User"
          SET "digital_product_earnings" = "digital_product_earnings" + ${commissionAmount}
          WHERE id = ${order.affiliateId}
        `;
      }

      return updated;
    });

    // Send approval email to buyer with download link
    if (order.customerEmail && updatedOrder.downloadUrl) {
      await sendOrderApprovalNotification(
        order.customerEmail,
        order.customerName,
        order.userDigitalProduct.masterDigitalProduct.title,
        'digital-product',
        updatedOrder.downloadUrl,
        updatedOrder.downloadExpireAt,
        order.userDigitalProduct.masterDigitalProduct.price
      );
    }

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
          order.userDigitalProduct.masterDigitalProduct.title,
          'digital-product',
          order.userDigitalProduct.masterDigitalProduct.price
        );
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error approving order:', error);
    return NextResponse.json(
      { error: 'Failed to approve order' },
      { status: 500 }
    );
  }
}
