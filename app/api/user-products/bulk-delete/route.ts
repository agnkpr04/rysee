import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Auto-create user if not exists (from Supabase auth)
    if (!user) {
      console.log('[user-products bulk-delete] User not found in database, creating...');
      const defaultName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
      
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email,
          name: defaultName,
          storeName: defaultName,
          avatar_url: session.user.user_metadata?.avatar_url || null,
        },
      });
      console.log('[user-products bulk-delete] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    console.log('BULK DELETE - User ID:', user.id, 'Product IDs:', productIds);

    // Find all user products to delete
    const userProducts = await prisma.userProduct.findMany({
      where: {
        userId: user.id,
        productId: { in: productIds },
      },
    });

    if (userProducts.length === 0) {
      return NextResponse.json(
        { error: 'No products found to delete' },
        { status: 404 }
      );
    }

    const userProductIds = userProducts.map((up) => up.id);

    // Delete related ClickTracking records first
    await prisma.clickTracking.deleteMany({
      where: {
        userProductId: { in: userProductIds },
      },
    });

    // Delete user products
    await prisma.userProduct.deleteMany({
      where: {
        id: { in: userProductIds },
      },
    });

    console.log('BULK DELETE - Deleted', userProducts.length, 'products');

    return NextResponse.json({
      success: true,
      deletedCount: userProducts.length,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
