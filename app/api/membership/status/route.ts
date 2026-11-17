import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { getUserMembership } from '@/lib/membership';
import { getProductLimit, getCommissionRate } from '@/lib/membership-config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    // If userId is provided (for public view), fetch that user's membership without auth
    if (userIdParam) {
      const userId = userIdParam;
      
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.plan === 'free') {
        return NextResponse.json({
          isPremium: false,
          isPaid: false,
          status: 'free',
          plan: 'free',
          productLimit: getProductLimit('free'),
          downloadLimit: Infinity,
          commissionRate: getCommissionRate('free'),
        });
      }

      const membershipInfo = await getUserMembership(userId);

      return NextResponse.json({
        isPremium: membershipInfo.isPremium,
        isPaid: membershipInfo.isPaid,
        status: membershipInfo.status,
        plan: membershipInfo.plan,
        productLimit: membershipInfo.productLimit,
        downloadLimit: membershipInfo.downloadLimit,
        commissionRate: membershipInfo.commissionRate,
      });
    }
    
    // Otherwise, require auth (for owner view)
    if (!accessToken) {
      return NextResponse.json({
        isPremium: false,
        isPaid: false,
        status: 'free',
        plan: 'free',
        productLimit: getProductLimit('free'),
        downloadLimit: Infinity,
        commissionRate: getCommissionRate('free'),
      });
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
      return NextResponse.json({
        isPremium: false,
        isPaid: false,
        status: 'free',
        plan: 'free',
        productLimit: getProductLimit('free'),
        downloadLimit: Infinity,
        commissionRate: getCommissionRate('free'),
      });
    }

    const userId = user.id;

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.plan === 'free') {
      // Get user referral earnings
      const userWithEarnings = await prisma.user.findUnique({
        where: { id: userId },
        select: { earnings: true, referralCode: true }
      });

      return NextResponse.json({
        isPremium: false,
        isPaid: false,
        status: 'free',
        plan: 'free',
        productLimit: getProductLimit('free'),
        downloadLimit: Infinity,
        commissionRate: getCommissionRate('free'),
        earnings: userWithEarnings?.earnings || 0,
        referralCode: userWithEarnings?.referralCode || null
      });
    }

    // Get full membership info including limits
    const membershipInfo = await getUserMembership(userId);

    // Get user referral earnings
    const userWithEarnings = await prisma.user.findUnique({
      where: { id: userId },
      select: { earnings: true, referralCode: true }
    });

    return NextResponse.json({
      isPremium: membershipInfo.isPremium,
      isPaid: membershipInfo.isPaid,
      status: membershipInfo.status,
      plan: membershipInfo.plan,
      productLimit: membershipInfo.productLimit,
      downloadLimit: membershipInfo.downloadLimit,
      commissionRate: membershipInfo.commissionRate,
      earnings: userWithEarnings?.earnings || 0,
      referralCode: userWithEarnings?.referralCode || null
    });
  } catch (error) {
    console.error('Get membership status error:', error);
    return NextResponse.json({
      isPremium: false,
      isPaid: false,
      status: 'free',
      plan: 'free',
      productLimit: getProductLimit('free'),
      downloadLimit: Infinity,
      commissionRate: getCommissionRate('free'),
    });
  }
}
