import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipUpgradeNotification } from '@/lib/email';
import {
  getReferralCommission,
  normalizeTier,
  type MembershipTier,
} from '@/lib/membership-config';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: sessionCookie.value },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: paymentId } = await params;

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'Payment is not pending' }, { status: 400 });
    }

    // Extract plan from description
    // Description format: "Membership upgrade to {plan} plan via {method}"
    const planMatch = payment.description?.match(/upgrade to (\w+) plan/i);
    if (!planMatch) {
      return NextResponse.json({ error: 'Could not determine plan from payment description' }, { status: 400 });
    }
    const plan = planMatch[1].toLowerCase() as MembershipTier;

    // Validate plan (premium only)
    const validPlans: MembershipTier[] = ['premium'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan in payment description' }, { status: 400 });
    }

    // Check if user has a referral
    const user = await prisma.user.findUnique({
      where: { id: payment.userId },
      select: { referredBy: true, email: true, name: true }
    });

    let referralId = null;
    let referralFee = null;
    let platformFee = payment.amount;

    if (user?.referredBy) {
      // Find the referral relationship
      const referral = await prisma.referral.findFirst({
        where: {
          referredId: payment.userId,
          referrerId: user.referredBy
        }
      });

      if (referral) {
        // Lookup commission via REFERRAL_MATRIX based on referrer tier × referred tier (plan being purchased)
        // matrix[referrerTier][referredTier] gives commission amount
        const referrerSubscription = await prisma.subscription.findUnique({
          where: { userId: user.referredBy },
        });
        const referrerTier: MembershipTier = referrerSubscription?.status === 'active'
          ? normalizeTier(referrerSubscription.plan)
          : 'free';

        const REFERRAL_AMOUNT = getReferralCommission(referrerTier, plan);

        if (REFERRAL_AMOUNT > 0) {
          referralId = referral.id;
          referralFee = REFERRAL_AMOUNT;
          platformFee = payment.amount - REFERRAL_AMOUNT;

          console.log('[Payment Approval] Matrix referral commission processed:', {
            referralId: referral.id,
            referrerId: user.referredBy,
            referrerTier,
            referredId: payment.userId,
            referredTier: plan,
            paymentAmount: payment.amount,
            referralFee: REFERRAL_AMOUNT,
            platformFee
          });
        } else {
          console.log('[Payment Approval] No referral commission (matrix returned 0)', {
            referrerTier,
            plan,
          });
        }
      }
    }

    // Fetch existing subscription before transaction
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: payment.userId },
    });

    // Wrap all DB writes in a single transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      if (referralId && referralFee && referralFee > 0 && user?.referredBy) {
        await tx.referralEarning.create({
          data: { referralId, amount: referralFee, status: 'pending' }
        });
        await tx.user.update({
          where: { id: user.referredBy },
          data: { earnings: { increment: referralFee } }
        });
        await tx.referral.update({
          where: { id: referralId },
          data: { status: 'active' }
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
            referralFee,
            plan
          );
        }
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'success', referralFee, platformFee, referralId },
      });

      if (existingSubscription) {
        const finalPlan: MembershipTier =
          existingSubscription.plan === 'premium' ? 'premium' : plan;
        await tx.subscription.update({
          where: { userId: payment.userId },
          data: { plan: finalPlan, status: 'active' },
        });
      } else {
        await tx.subscription.create({
          data: { userId: payment.userId, plan, status: 'active' },
        });
      }
    });

    // Send email notification to admin
    if (user) {
      await sendMembershipUpgradeNotification(user.email, user.name);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment approved and subscription activated' 
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
