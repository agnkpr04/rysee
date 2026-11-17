import { prisma } from './prisma';
import { getUserMembership } from './membership';

export interface AnalyticsData {
  totalClicks: number;
  totalProducts: number;
  clicksByProduct: Array<{
    productId: string;
    productTitle: string;
    clicks: number;
  }>;
  recentClicks: Array<{
    id: string;
    productId: string;
    productTitle: string;
    ipAddress: string;
    clickedAt: Date;
  }>;
  totalStoreVisits?: number;
  storeVisitsLast7Days?: number;
  storeVisitsLast30Days?: number;
  plan?: string;
  canViewAdvancedAnalytics?: boolean;
}

export async function getUserAnalytics(userId: string): Promise<AnalyticsData> {
  try {
    // Get user membership for tier validation
    const membership = await getUserMembership(userId);
    const canViewAdvancedAnalytics = membership.plan === 'premium';

    // Get total clicks for user
    const totalClicks = await prisma.clickTracking.count({
      where: { userId },
    });

    // Get total products for user
    const totalProducts = await prisma.userProduct.count({
      where: { userId },
    });

    // Get clicks grouped by product
    const clicksByProductRaw = await prisma.clickTracking.groupBy({
      by: ['productId'],
      where: { userId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Fetch product titles
    const productIds = clicksByProductRaw.map((item) => item.productId);
    const products = await prisma.masterProduct.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p.title]));

    const clicksByProduct = clicksByProductRaw.map((item) => ({
      productId: item.productId,
      productTitle: productMap.get(item.productId) || 'Unknown Product',
      clicks: item._count.id,
    }));

    // Get recent clicks
    const recentClicksRaw = await prisma.clickTracking.findMany({
      where: { userId },
      include: {
        userProduct: {
          include: {
            product: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: { clickedAt: 'desc' },
      take: 10,
    });

    const recentClicks = recentClicksRaw.map((click) => ({
      id: click.id,
      productId: click.productId,
      productTitle: click.userProduct.product.title,
      ipAddress: click.ipAddress || 'unknown',
      clickedAt: click.clickedAt,
    }));

    // Store visit analytics (only for STARTER and PRO)
    let totalStoreVisits: number | undefined;
    let storeVisitsLast7Days: number | undefined;
    let storeVisitsLast30Days: number | undefined;

    if (canViewAdvancedAnalytics) {
      // Get total store visits
      totalStoreVisits = await prisma.storeVisitTracking.count({
        where: { userId },
      });

      // Get store visits in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      storeVisitsLast7Days = await prisma.storeVisitTracking.count({
        where: {
          userId,
          visitedAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      // Get store visits in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      storeVisitsLast30Days = await prisma.storeVisitTracking.count({
        where: {
          userId,
          visitedAt: {
            gte: thirtyDaysAgo,
          },
        },
      });
    }

    return {
      totalClicks,
      totalProducts,
      clicksByProduct,
      recentClicks,
      totalStoreVisits,
      storeVisitsLast7Days,
      storeVisitsLast30Days,
      plan: membership.plan,
      canViewAdvancedAnalytics,
    };
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return {
      totalClicks: 0,
      totalProducts: 0,
      clicksByProduct: [],
      recentClicks: [],
      plan: 'free',
      canViewAdvancedAnalytics: false,
    };
  }
}

export async function getProductClicks(userId: string, productId: string): Promise<number> {
  try {
    const count = await prisma.clickTracking.count({
      where: {
        userId,
        productId,
      },
    });
    return count;
  } catch (error) {
    console.error('Error fetching product clicks:', error);
    return 0;
  }
}
