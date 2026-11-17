import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all users with their click counts
    const clickCounts = await prisma.clickTracking.groupBy({
      by: ['userId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Fetch user data from Supabase
    const usersMap = new Map();
    await Promise.all(
      clickCounts.map(async (item) => {
        try {
          const { data: { user } } = await supabase.auth.admin.getUserById(item.userId);
          if (user) {
            usersMap.set(item.userId, {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || null,
              avatar_url: user.user_metadata?.avatar_url || null,
            });
          }
        } catch (err) {
          console.error(`Failed to fetch user ${item.userId}:`, err);
        }
      })
    );

    // Get user plans and store theme data
    const userIds = clickCounts.map(item => item.userId);
    const [subscriptions, users] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: { in: userIds } },
      }),
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          eliteBadgeColor: true,
          storeTheme: true,
        },
      }),
    ]);

    const planMap = new Map();
    const storeThemeMap = new Map();
    const now = new Date();
    subscriptions.forEach(sub => {
      const isExpired = sub.endDate && new Date(sub.endDate) < now;
      const isActive = sub.status === 'active' && !isExpired;
      planMap.set(sub.userId, isActive ? sub.plan : 'free');
    });
    users.forEach(user => {
      const storeTheme = user.storeTheme as any;
      storeThemeMap.set(user.id, {
        profileFrameType: storeTheme?.profileFrameType || 'none',
        frameThickness: storeTheme?.frameThickness || 2,
        eliteBadgeColor: user.eliteBadgeColor || 'crimson',
      });
    });

    // Combine data
    const ranking = clickCounts.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      clickCount: item._count.id,
      user: usersMap.get(item.userId) || null,
      userPlan: planMap.get(item.userId) || 'free',
      profileFrameType: storeThemeMap.get(item.userId)?.profileFrameType || 'none',
      frameThickness: storeThemeMap.get(item.userId)?.frameThickness || 2,
      eliteBadgeColor: storeThemeMap.get(item.userId)?.eliteBadgeColor || 'crimson',
    }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Get clicks ranking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
