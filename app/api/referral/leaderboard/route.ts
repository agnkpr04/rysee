import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch all users with their referral counts (only completed referrals)
    const usersWithReferralCount = await prisma.user.findMany({
      where: {
        referralCode: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar_url: true,
        storeLogo: true,
        storeTheme: true,
        referrals: {
          where: {
            status: 'completed'
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        referrals: {
          _count: 'desc'
        }
      },
      take: 20 // Top 20
    });

    // Fetch all subscriptions to match with users
    const subscriptions = await prisma.subscription.findMany({
      select: {
        userId: true,
        plan: true,
        status: true,
      },
    });

    // Create a map of userId to plan
    const subscriptionMap = new Map();
    subscriptions.forEach(sub => {
      const isActive = sub.status === 'active';
      if (isActive) {
        subscriptionMap.set(sub.userId, sub.plan);
      }
    });

    // Format the data
    const leaderboard = usersWithReferralCount
      .map(user => {
        const theme = user.storeTheme as any;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.storeLogo || user.avatar_url,
          activeReferrals: user.referrals.length,
          rank: 0, // Will be calculated below
          userPlan: subscriptionMap.get(user.id) || 'free', // Get actual plan from subscription
          profileFrameType: theme?.profileFrameType || 'none',
          frameThickness: theme?.frameThickness || 2,
          eliteBadgeColor: theme?.eliteBadgeColor || 'crimson',
          accentColor: theme?.accentColor || '#8B5CF6'
        };
      })
      .filter(user => user.activeReferrals > 0) // Only include users with referrals
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Failed to fetch referral leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch referral leaderboard' }, { status: 500 });
  }
}
