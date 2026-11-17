import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch users with their product count and latest product creation time
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        storeName: true,
        storeLogo: true,
        avatar_url: true,
        eliteBadgeColor: true,
        storeTheme: true,
        _count: {
          select: {
            userProducts: true,
          },
        },
        userProducts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      take: 100, // Fetch more to ensure we have enough for sorting
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

    // Filter users who have at least 1 product and calculate ranking
    const rankings = users
      .filter((user) => user._count.userProducts > 0)
      .map((user) => {
        const storeTheme = user.storeTheme as any;
        return {
          id: user.id,
          name: user.name,
          storeName: user.storeName,
          productCount: user._count.userProducts,
          storeLogo: user.storeLogo,
          avatar_url: user.avatar_url,
          eliteBadgeColor: user.eliteBadgeColor || 'crimson',
          latestProductCreatedAt: user.userProducts[0]?.createdAt || new Date(),
          userPlan: subscriptionMap.get(user.id) || 'free',
          profileFrameType: storeTheme?.profileFrameType || 'none',
          frameThickness: storeTheme?.frameThickness || 2,
        };
      })
      // Sort by product count (descending), then by latest product creation time (ascending)
      // User yang lebih dulu add produk akan di atas jika jumlah produk sama
      .sort((a, b) => {
        if (b.productCount !== a.productCount) {
          return b.productCount - a.productCount;
        }
        // If product count is equal, sort by latest product creation time (earlier = higher rank)
        // User yang sudah lama punya produk ini akan di atas user yang baru menyusul
        return new Date(a.latestProductCreatedAt).getTime() - new Date(b.latestProductCreatedAt).getTime();
      })
      .slice(0, 10); // Take top 10

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
