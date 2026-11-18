import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCommissionRate, getTemplateCommissionRate, normalizeTier, getReferralCommission, type MembershipTier } from '@/lib/membership-config';
import midtransClient from 'midtrans-client';

export async function POST(request: NextRequest) {
  try {
    // Initialize Midtrans Core API for notification verification
    const coreApi = new midtransClient.CoreApi({
      isProduction: true,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    const notificationJson = await request.json();

    // Verify notification signature
    // @ts-expect-error - midtrans-client type definition is incomplete
    const statusResponse = await coreApi.transaction.notification(notificationJson);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;
    const transactionId = statusResponse.transaction_id;

    console.log('[Midtrans Webhook] Notification received:', {
      orderId,
      transactionStatus,
      fraudStatus,
      paymentType,
      transactionId,
    });

    // Check if this is a membership payment (starts with "MEMBERSHIP-")
    if (orderId.startsWith('MEMBERSHIP-')) {
      return await handleMembershipPayment(orderId, transactionStatus, fraudStatus, paymentType, transactionId);
    }

    // Check if this is a template order (starts with "TEMPLATE-")
    if (orderId.startsWith('TEMPLATE-')) {
      return await handleTemplatePayment(orderId, transactionStatus, fraudStatus, paymentType, transactionId);
    }

    // Find order by midtransOrderId
    const order = await prisma.digitalProductOrder.findFirst({
      where: { midtransOrderId: orderId },
      include: { userDigitalProduct: { include: { masterDigitalProduct: true } } },
    });

    if (!order) {
      console.error('[Midtrans Webhook] Order not found:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Handle transaction status
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        // Fraud challenge - keep order as pending
        await prisma.digitalProductOrder.update({
          where: { id: order.id },
          data: { 
            status: 'fraud_challenge',
            midtransTransactionId: transactionId,
            paymentMethod: paymentType,
          },
        });
      } else if (fraudStatus === 'accept') {
        // Payment successful - approve order
        await approveOrder(order, transactionId, paymentType);
      }
    } else if (transactionStatus === 'settlement') {
      // Payment successful - approve order
      await approveOrder(order, transactionId, paymentType);
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      // Payment failed or cancelled
      await prisma.digitalProductOrder.update({
        where: { id: order.id },
        data: { 
          status: 'cancelled',
          midtransTransactionId: transactionId,
          paymentMethod: paymentType,
        },
      });
    } else if (transactionStatus === 'pending') {
      // Payment pending
      await prisma.digitalProductOrder.update({
        where: { id: order.id },
        data: { 
          status: 'pending_payment',
          midtransTransactionId: transactionId,
          paymentMethod: paymentType,
        },
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Midtrans Webhook] Error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}

async function approveOrder(order: any, transactionId: string, paymentMethod: string) {
  // Update order status to verified and set download URL
  const updatedOrder = await prisma.digitalProductOrder.update({
    where: { id: order.id },
    data: {
      status: 'verified',
      downloadUrl: order.userDigitalProduct.masterDigitalProduct.downloadUrl,
      downloadExpireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      midtransTransactionId: transactionId,
      paymentMethod: paymentTypeToChannel(paymentMethod),
    },
    include: { userDigitalProduct: { include: { masterDigitalProduct: true, user: { select: { id: true, name: true, email: true } } } } },
  });

  // Credit commission to affiliate if exists - rate based on affiliate's tier
  if (order.affiliateId) {
    const affiliateSubscription = await prisma.subscription.findUnique({
      where: { userId: order.affiliateId },
    });
    const affiliateTier = affiliateSubscription?.status === 'active'
      ? normalizeTier(affiliateSubscription.plan)
      : 'free';
    const commissionRate = getCommissionRate(affiliateTier);
    const commission = Math.floor(order.userDigitalProduct.masterDigitalProduct.price * commissionRate);

    console.log('[Midtrans Webhook] Crediting commission:', {
      affiliateId: order.affiliateId,
      affiliateTier,
      commissionRate,
      commission,
    });

    await prisma.$executeRaw`
      UPDATE "User"
      SET "digital_product_earnings" = "digital_product_earnings" + ${commission}
      WHERE id = ${order.affiliateId}
    `;
  }

  // Send approval email to buyer with download link
  if (order.customerEmail && updatedOrder.downloadUrl) {
    const { sendOrderApprovalNotification } = await import('@/lib/email');
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

  // Send notification to admin
  const { sendAdminOrderNotification, sendAffiliateOrderNotification } = await import('@/lib/email');
  await sendAdminOrderNotification(
    updatedOrder.userDigitalProduct.user.email,
    updatedOrder.userDigitalProduct.user.name,
    order.customerName,
    order.customerEmail,
    order.userDigitalProduct.masterDigitalProduct.title,
    'digital-product',
    order.userDigitalProduct.masterDigitalProduct.price
  );

  // Send notification to affiliate (store owner)
  await sendAffiliateOrderNotification(
    updatedOrder.userDigitalProduct.user.email,
    updatedOrder.userDigitalProduct.user.name,
    order.customerName,
    order.customerEmail,
    order.userDigitalProduct.masterDigitalProduct.title,
    'digital-product',
    order.userDigitalProduct.masterDigitalProduct.price
  );
}

function paymentTypeToChannel(paymentType: string): string {
  const channelMap: Record<string, string> = {
    'credit_card': 'credit_card',
    'gopay': 'gopay',
    'qris': 'qris',
    'bank_transfer': 'bank_transfer',
    'echannel': 'mandiri',
    'bca_va': 'bca',
    'bni_va': 'bni',
    'bri_va': 'bri',
    'cimb_va': 'cimb',
    'permata_va': 'permata',
    'other_va': 'other_va',
    'alfamart': 'alfamart',
    'indomaret': 'indomaret',
  };
  return channelMap[paymentType] || paymentType;
}

async function handleMembershipPayment(
  orderId: string,
  transactionStatus: string,
  fraudStatus: string,
  paymentType: string,
  transactionId: string
) {
  console.log('[Midtrans Webhook] Processing membership payment:', orderId);

  // Find membership payment by midtransOrderId
  const payment = await prisma.membershipPayment.findFirst({
    where: { midtransOrderId: orderId },
  });

  if (!payment) {
    console.error('[Midtrans Webhook] Membership payment not found:', orderId);
    return NextResponse.json({ error: 'Membership payment not found' }, { status: 404 });
  }

  // Handle transaction status
  if (transactionStatus === 'capture') {
    if (fraudStatus === 'challenge') {
      // Fraud challenge - keep payment as pending
      await prisma.membershipPayment.update({
        where: { id: payment.id },
        data: {
          status: 'fraud_challenge',
          midtransTransactionId: transactionId,
        },
      });
    } else if (fraudStatus === 'accept') {
      // Payment successful - activate membership
      await activateMembership(payment, transactionId);
    }
  } else if (transactionStatus === 'settlement') {
    // Payment successful - activate membership
    await activateMembership(payment, transactionId);
  } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
    // Payment failed or cancelled
    await prisma.membershipPayment.update({
      where: { id: payment.id },
      data: {
        status: 'cancelled',
        midtransTransactionId: transactionId,
      },
    });
  } else if (transactionStatus === 'pending') {
    // Payment pending
    await prisma.membershipPayment.update({
      where: { id: payment.id },
      data: {
        status: 'pending_payment',
        midtransTransactionId: transactionId,
      },
    });
  }

  return NextResponse.json({ status: 'ok' });
}

async function activateMembership(payment: any, transactionId: string) {
  console.log('[Midtrans Webhook] Activating membership for user:', payment.userId, 'plan:', payment.plan);

  // Update payment status to verified
  await prisma.membershipPayment.update({
    where: { id: payment.id },
    data: {
      status: 'verified',
      midtransTransactionId: transactionId,
    },
  });

  // Handle referral commission
  const user = await prisma.user.findUnique({
    where: { id: payment.userId },
    select: { referredBy: true, email: true, name: true },
  });

  if (user?.referredBy) {
    const referral = await prisma.referral.findFirst({
      where: {
        referredId: payment.userId,
        referrerId: user.referredBy,
      },
    });

    if (referral) {
      const referrerSubscription = await prisma.subscription.findUnique({
        where: { userId: user.referredBy },
      });
      const referrerTier: MembershipTier = referrerSubscription?.status === 'active'
        ? normalizeTier(referrerSubscription.plan)
        : 'free';

      const plan = payment.plan as MembershipTier;
      const REFERRAL_AMOUNT = getReferralCommission(referrerTier, plan);

      if (REFERRAL_AMOUNT > 0) {
        // Create ReferralEarning
        await prisma.referralEarning.create({
          data: {
            referralId: referral.id,
            amount: REFERRAL_AMOUNT,
            status: 'pending',
          },
        });

        // Update referrer's earnings
        await prisma.user.update({
          where: { id: user.referredBy },
          data: {
            earnings: { increment: REFERRAL_AMOUNT },
          },
        });

        // Update Referral status to active
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: 'active' },
        });

        // Send notification to referrer about commission
        const referrer = await prisma.user.findUnique({
          where: { id: user.referredBy },
          select: { email: true, name: true }
        });
        if (referrer) {
          const { sendReferralCommissionNotification } = await import('@/lib/email');
          await sendReferralCommissionNotification(
            referrer.email,
            referrer.name,
            user.name,
            user.email,
            REFERRAL_AMOUNT,
            plan
          );
        }

        console.log('[Midtrans Webhook] Referral commission processed:', {
          referralId: referral.id,
          referrerId: user.referredBy,
          referrerTier,
          referredId: payment.userId,
          referredTier: plan,
          paymentAmount: payment.amount,
          referralFee: REFERRAL_AMOUNT,
        });
      }
    }
  }

  // Check if user already has an active subscription
  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId: payment.userId },
  });

  if (existingSubscription) {
    const finalPlan = existingSubscription.plan === 'premium' ? 'premium' : payment.plan;
    await prisma.subscription.update({
      where: { userId: payment.userId },
      data: {
        plan: finalPlan,
        status: 'active',
        updatedAt: new Date(),
      },
    });
    console.log('[Midtrans Webhook] Updated existing subscription for user:', payment.userId);
  } else {
    await prisma.subscription.create({
      data: {
        userId: payment.userId,
        plan: payment.plan,
        status: 'active',
      },
    });
    console.log('[Midtrans Webhook] Created new subscription for user:', payment.userId);
  }

  // Send activation email to user
  if (user?.email) {
    try {
      const { sendMembershipActivationNotification } = await import('@/lib/email');
      await sendMembershipActivationNotification(
        user.email,
        user.name,
        payment.plan,
        payment.amount
      );
      console.log('[Midtrans Webhook] Sent activation email to:', user.email);
    } catch (emailError) {
      console.error('[Midtrans Webhook] Failed to send activation email:', emailError);
    }
  }

  // Send notification to admin
  if (user?.email) {
    try {
      const { sendAdminMembershipNotification } = await import('@/lib/email');
      await sendAdminMembershipNotification(
        user.email,
        user.name,
        payment.plan,
        payment.amount,
        'Midtrans'
      );
      console.log('[Midtrans Webhook] Sent admin notification for membership upgrade');
    } catch (emailError) {
      console.error('[Midtrans Webhook] Failed to send admin notification:', emailError);
    }
  }
}

async function handleTemplatePayment(
  orderId: string,
  transactionStatus: string,
  fraudStatus: string,
  paymentType: string,
  transactionId: string
) {
  console.log('[Midtrans Webhook] Processing template payment:', orderId);

  const order = await prisma.templateOrder.findFirst({
    where: { midtransOrderId: orderId },
    include: { userTemplate: { include: { masterTemplate: true } } },
  });

  if (!order) {
    console.error('[Midtrans Webhook] Template order not found:', orderId);
    return NextResponse.json({ error: 'Template order not found' }, { status: 404 });
  }

  if (transactionStatus === 'capture') {
    if (fraudStatus === 'challenge') {
      await prisma.templateOrder.update({
        where: { id: order.id },
        data: {
          status: 'fraud_challenge',
          midtransTransactionId: transactionId,
          paymentMethod: paymentType,
        },
      });
    } else if (fraudStatus === 'accept') {
      await markTemplatePaid(order, transactionId, paymentType);
    }
  } else if (transactionStatus === 'settlement') {
    await markTemplatePaid(order, transactionId, paymentType);
  } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
    await prisma.templateOrder.update({
      where: { id: order.id },
      data: {
        status: 'cancelled',
        midtransTransactionId: transactionId,
        paymentMethod: paymentType,
      },
    });
  } else if (transactionStatus === 'pending') {
    await prisma.templateOrder.update({
      where: { id: order.id },
      data: {
        status: 'pending_payment',
        midtransTransactionId: transactionId,
        paymentMethod: paymentType,
      },
    });
  }

  return NextResponse.json({ status: 'ok' });
}

async function markTemplatePaid(order: any, transactionId: string, paymentMethod: string) {
  // Template is a service (jasa) - payment confirmed, set to "paid"
  // Commission is credited immediately on payment success
  const updatedOrder = await prisma.templateOrder.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      midtransTransactionId: transactionId,
      paymentMethod: paymentTypeToChannel(paymentMethod),
    },
    include: { userTemplate: { include: { masterTemplate: true } } },
  });

  // Credit commission immediately on payment success
  if (order.affiliateId) {
    const affiliateSubscription = await prisma.subscription.findUnique({
      where: { userId: order.affiliateId },
    });
    const affiliateTier = affiliateSubscription?.status === 'active'
      ? normalizeTier(affiliateSubscription.plan)
      : 'free';
    const commissionRate = getTemplateCommissionRate(affiliateTier);
    const commission = Math.floor(order.userTemplate.masterTemplate.price * commissionRate);

    await prisma.$executeRaw`
      UPDATE "User"
      SET "template_earnings" = "template_earnings" + ${commission}
      WHERE id = ${order.affiliateId}
    `;

    console.log('[Midtrans Webhook] Template commission credited:', {
      orderId: order.id,
      affiliateId: order.affiliateId,
      affiliateTier,
      commissionRate,
      commission,
    });
  }

  // Get user info (affiliate/store owner)
  const user = await prisma.user.findUnique({
    where: { id: order.affiliateId },
    select: { id: true, name: true, email: true }
  });

  console.log('[Midtrans Webhook] Template order marked as paid:', {
    orderId: order.id,
    affiliateId: order.affiliateId,
    price: order.userTemplate.masterTemplate.price,
  });

  // Send notification to admin
  if (user) {
    const { sendAdminOrderNotification, sendAffiliateOrderNotification } = await import('@/lib/email');
    await sendAdminOrderNotification(
      user.email,
      user.name,
      order.customerName,
      order.customerEmail,
      order.userTemplate.masterTemplate.title,
      'template',
      order.userTemplate.masterTemplate.price
    );

    // Send notification to affiliate (store owner)
    await sendAffiliateOrderNotification(
      user.email,
      user.name,
      order.customerName,
      order.customerEmail,
      order.userTemplate.masterTemplate.title,
      'template',
      order.userTemplate.masterTemplate.price
    );
  }
}
