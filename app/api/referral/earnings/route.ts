import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Get user's referral earnings
    const userWithEarnings = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        earnings: true,
        template_earnings: true,
        digital_product_earnings: true,
        referralCode: true,
        withdrawBankName: true,
        withdrawAccountNumber: true,
        withdrawAccountName: true,
        referrals: {
          include: {
            referred: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            earnings: true
          }
        }
      }
    });

    if (!userWithEarnings) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch subscriptions for all referred users
    const referredUserIds = userWithEarnings.referrals.map((r: any) => r.referred.id);
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: { in: referredUserIds }
      },
      select: {
        userId: true,
        plan: true,
        status: true
      }
    });

    // Create a map for quick lookup
    const subscriptionMap = new Map(
      subscriptions.map((sub: any) => [sub.userId, { plan: sub.plan, status: sub.status }])
    );

    // Auto-generate referral code if it doesn't exist
    let referralCode = userWithEarnings.referralCode;
    if (!referralCode) {
      console.log('[Referral Earnings] Generating referral code for user:', userId);
      // Generate referral code (8 characters from user ID, uppercase)
      const generatedCode = userId.substring(0, 8).toUpperCase();
      
      try {
        // Update user with referral code
        await prisma.user.update({
          where: { id: userId },
          data: { referralCode: generatedCode }
        });
        referralCode = generatedCode;
        console.log('[Referral Earnings] Referral code generated successfully:', referralCode);
      } catch (updateError) {
        console.error('[Referral Earnings] Failed to update with generated code, trying timestamp fallback:', updateError);
        // If update fails (e.g., code already exists), try with timestamp
        const timestampCode = `${userId.substring(0, 6)}${Date.now().toString().slice(-2)}`.toUpperCase();
        await prisma.user.update({
          where: { id: userId },
          data: { referralCode: timestampCode }
        });
        referralCode = timestampCode;
        console.log('[Referral Earnings] Referral code generated with timestamp fallback:', referralCode);
      }
    } else {
      console.log('[Referral Earnings] User already has referral code:', referralCode);
    }

    // Calculate total referral earnings (all earnings regardless of status)
    const totalReferralEarnings = userWithEarnings.referrals
      .flatMap((r: any) => r.earnings)
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    // Calculate referral earnings by status
    const pendingReferralEarnings = userWithEarnings.referrals
      .flatMap((r: any) => r.earnings)
      .filter((e: any) => e.status === 'pending')
      .reduce((sum: number, e: any) => sum + e.amount, 0);
    const paidReferralEarnings = userWithEarnings.referrals
      .flatMap((r: any) => r.earnings)
      .filter((e: any) => e.status === 'paid')
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    // Template earnings (commission)
    const templateEarnings = userWithEarnings.template_earnings || 0;

    // Digital product earnings (commission)
    const digitalProductEarnings = userWithEarnings.digital_product_earnings || 0;

    // Referral earnings only (for display as "Penghasilan Referral")
    const referralEarnings = totalReferralEarnings;

    // Total earnings = referral earnings + template earnings + digital product earnings (history total)
    const totalEarnings = totalReferralEarnings + templateEarnings + digitalProductEarnings;

    // Get withdraw requests
    const withdrawRequests = await prisma.withdrawRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total pending withdrawals
    const totalPendingWithdrawals = withdrawRequests
      .filter((w: any) => w.status === 'pending')
      .reduce((sum: number, w: any) => sum + w.amount, 0);

    // Calculate total approved (paid) withdrawals
    const totalApprovedWithdrawals = withdrawRequests
      .filter((w: any) => w.status === 'approved')
      .reduce((sum: number, w: any) => sum + w.amount, 0);

    // Available balance = all earnings - all withdrawals (pending + approved)
    // This is the actual balance user can still withdraw
    const availableBalance = (totalReferralEarnings + templateEarnings + digitalProductEarnings) - totalPendingWithdrawals - totalApprovedWithdrawals;

    return NextResponse.json({
      totalEarnings,
      referralEarnings,
      pendingEarnings: pendingReferralEarnings,
      paidEarnings: paidReferralEarnings,
      availableBalance,
      templateEarnings,
      digitalProductEarnings,
      referralCode: referralCode,
      totalReferrals: userWithEarnings.referrals.length,
      referrals: userWithEarnings.referrals.map((r: any) => {
        const subscription = subscriptionMap.get(r.referred.id) || { plan: 'free', status: 'inactive' };
        return {
          id: r.id,
          status: r.status,
          referred: r.referred,
          subscription,
          earnings: r.earnings
        };
      }),
      withdrawRequests,
      savedPaymentMethod: {
        bankName: userWithEarnings.withdrawBankName || '',
        accountNumber: userWithEarnings.withdrawAccountNumber || '',
        accountName: userWithEarnings.withdrawAccountName || '',
      },
    });
  } catch (error) {
    console.error('Get referral earnings error:', error);
    return NextResponse.json({ error: 'Failed to get referral earnings' }, { status: 500 });
  }
}
