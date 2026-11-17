import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getReferralCommission, normalizeTier } from '@/lib/membership-config';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const referralId = params.id;

    // Get referral details
    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        referred: {
          select: {
            email: true,
            name: true
          }
        },
        referrer: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    if (referral.status === 'completed') {
      return NextResponse.json({ error: 'Referral already completed' }, { status: 400 });
    }

    // Lookup referrer's tier to calculate correct commission
    const referrerSubscription = await prisma.subscription.findUnique({
      where: { userId: referral.referrerId },
    });
    const referrerTier = referrerSubscription?.status === 'active'
      ? normalizeTier(referrerSubscription.plan)
      : 'free';

    // Lookup referred user's tier (the plan they upgraded to)
    const referredSubscription = await prisma.subscription.findUnique({
      where: { userId: referral.referredId },
    });
    const referredTier = referredSubscription?.status === 'active'
      ? normalizeTier(referredSubscription.plan)
      : 'pro'; // Default to pro if can't determine (minimum paid tier)

    const commissionAmount = getReferralCommission(referrerTier, referredTier);

    if (commissionAmount <= 0) {
      return NextResponse.json({ error: 'No commission applicable for this referral combination' }, { status: 400 });
    }

    // Update referral status to completed
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: 'completed' }
    });

    // Create ReferralEarning
    await prisma.referralEarning.create({
      data: {
        referralId: referral.id,
        amount: commissionAmount,
        status: 'pending'
      }
    });

    // Update referrer's earnings
    await prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        earnings: { increment: commissionAmount }
      }
    });

    console.log('[Referral Approval] Referral approved:', {
      referralId: referral.id,
      referrerId: referral.referrerId,
      referredId: referral.referredId,
      referrerTier,
      referredTier,
      referralFee: commissionAmount
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Referral approved and commission credited' 
    });
  } catch (error) {
    console.error('Approve referral error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
