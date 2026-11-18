import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { getTemplateCommissionRate, normalizeTier } from '@/lib/membership-config';

export async function POST(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentProof } = body;

    // Update order with payment proof
    const order = await prisma.templateOrder.update({
      where: { id: params.id },
      data: {
        paymentProof,
        status: 'verified',
      },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    // Generate download URL
    const downloadToken = Math.random().toString(36).substring(2, 15);
    const downloadExpireAt = new Date();
    downloadExpireAt.setHours(downloadExpireAt.getHours() + 24); // 24 hours

    const updatedOrder = await prisma.templateOrder.update({
      where: { id: params.id },
      data: {
        downloadUrl: `/api/template-order/${params.id}/download?token=${downloadToken}`,
        downloadExpireAt,
      },
    });

    // Update affiliate earnings if applicable - rate based on affiliate's tier
    if (order.affiliateId) {
      const affiliateSubscription = await prisma.subscription.findUnique({
        where: { userId: order.affiliateId },
      });
      const affiliateTier = affiliateSubscription?.status === 'active'
        ? normalizeTier(affiliateSubscription.plan)
        : 'free';
      const commissionRate = getTemplateCommissionRate(affiliateTier);
      const commission = Math.floor(order.userTemplate.masterTemplate.price * commissionRate);

      console.log('[Template Order Verify] Crediting commission:', {
        affiliateId: order.affiliateId,
        affiliateTier,
        commissionRate,
        commission,
      });

      await prisma.$executeRaw`
        UPDATE "User"
        SET "template_earnings" = "template_earnings" + ${commission}
        WHERE id = ${order.affiliateId}
      `;
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error verifying order:', error);
    return NextResponse.json(
      { error: 'Failed to verify order' },
      { status: 500 }
    );
  }
}
