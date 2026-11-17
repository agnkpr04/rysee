import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json();
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Find the referrer by their referral code (User.referralCode)
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Check if the referred user is authenticated
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

    // Check if user already has a subscription (is already premium)
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (existingSubscription && existingSubscription.status === 'active' && existingSubscription.plan === 'premium') {
      return NextResponse.json({ error: 'User is already a premium member' }, { status: 400 });
    }

    // Check if user already has a referral (prevent duplicate referral)
    const existingReferral = await prisma.referral.findUnique({
      where: { referredId: userId }
    });

    if (existingReferral) {
      return NextResponse.json({ error: 'User already has a referral' }, { status: 400 });
    }

    // Check if user already has referredBy set (even if referral record was deleted)
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredBy: true }
    });

    if (userRecord?.referredBy) {
      return NextResponse.json({ error: 'User already has a referrer' }, { status: 400 });
    }

    // Check if user is trying to refer themselves
    if (referrer.id === userId) {
      return NextResponse.json({ error: 'Self-referral not allowed' }, { status: 400 });
    }

    // Create new Referral record
    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: userId,
        referralCode: referralCode,
        status: 'pending'
      }
    });

    // Update user with referredBy
    await prisma.user.update({
      where: { id: userId },
      data: { referredBy: referrer.id }
    });

    console.log('[Referral Track] Created referral:', {
      referralId: referral.id,
      referrerId: referrer.id,
      referredId: userId,
      referralCode
    });

    return NextResponse.json({ 
      success: true, 
      referrer: referrer 
    });
  } catch (error) {
    console.error('Track referral error:', error);
    return NextResponse.json({ error: 'Failed to track referral' }, { status: 500 });
  }
}
