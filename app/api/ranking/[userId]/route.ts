import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Fetch all users with their product count and latest product creation time
    const users = await prisma.user.findMany({
      include: {
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
    });

    // Filter users who have at least 1 product and calculate ranking
    const rankedUsers = users
      .filter((user) => user._count.userProducts > 0)
      .map((user) => ({
        id: user.id,
        name: user.name,
        storeName: user.storeName,
        productCount: user._count.userProducts,
        latestProductCreatedAt: user.userProducts[0]?.createdAt || new Date(),
      }))
      // Sort by product count (descending), then by latest product creation time (ascending)
      // User yang lebih dulu add produk akan di atas jika jumlah produk sama
      .sort((a, b) => {
        if (b.productCount !== a.productCount) {
          return b.productCount - a.productCount;
        }
        // If product count is equal, sort by latest product creation time (earlier = higher rank)
        // User yang sudah lama punya produk ini akan di atas user yang baru menyusul
        return new Date(a.latestProductCreatedAt).getTime() - new Date(b.latestProductCreatedAt).getTime();
      });

    // Find the ranking of the specific user
    const userRanking = rankedUsers.findIndex((user) => user.id === userId) + 1;

    // If user not found in ranking (has 0 products), return 0
    const ranking = userRanking > 0 ? userRanking : 0;
    const totalUsers = rankedUsers.length;

    return NextResponse.json({ ranking, totalUsers });
  } catch (error) {
    console.error('Failed to fetch user ranking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
