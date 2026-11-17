import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total products (master products)
    const totalProducts = await prisma.masterProduct.count();

    // Get total user products (products added to stores)
    const totalUserProducts = await prisma.userProduct.count();

    // Get total stores (users with at least 1 product)
    const totalStores = await prisma.user.count({
      where: {
        userProducts: {
          some: {},
        },
      },
    });

    // Get total clicks across platform
    const totalClicks = await prisma.clickTracking.count();

    // Get active users (users with products added in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await prisma.user.count({
      where: {
        userProducts: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    });

    // Get top performing users (by total clicks)
    const topUsersRaw = await prisma.user.findMany({
      include: {
        clickTrackings: true,
        userProducts: true,
      },
      orderBy: {
        userProducts: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const topUsers = topUsersRaw.map((user) => ({
      id: user.id,
      name: user.name || user.email,
      storeName: user.storeName,
      productCount: user.userProducts.length,
      clickCount: user.clickTrackings.length,
    }));

    // Get clicks in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksLast7Days = await prisma.clickTracking.count({
      where: {
        clickedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get clicks in last 30 days
    const clicksLast30Days = await prisma.clickTracking.count({
      where: {
        clickedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalUserProducts,
      totalStores,
      totalClicks,
      activeUsers,
      topUsers,
      clicksLast7Days,
      clicksLast30Days,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
