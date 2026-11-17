import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { canUserAddProduct } from '@/lib/membership';

export async function POST(request: NextRequest) {
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
      console.log('[user-products POST] User not found in database, creating...');
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
      console.log('[user-products POST] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { productId, affiliateLink } = await request.json();

    if (!productId || !affiliateLink) {
      return NextResponse.json(
        { error: 'Product ID and affiliate link are required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.masterProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already has this product (for limit checking)
    const existingUserProduct = await prisma.userProduct.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    // Get current product count for limit validation
    const currentProductCount = await prisma.userProduct.count({
      where: { userId: user.id },
    });

    // Check membership limit (only for new products, not updates)
    if (!existingUserProduct) {
      const canAdd = await canUserAddProduct(user.id, currentProductCount);
      if (!canAdd.canAdd) {
        return NextResponse.json(
          { error: canAdd.reason || 'Product limit reached' },
          { status: 403 }
        );
      }
    }

    // Create or update user product
    const userProduct = await prisma.userProduct.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
      update: {
        affiliateLink: affiliateLink,
      },
      create: {
        userId: user.id,
        productId: productId,
        affiliateLink: affiliateLink,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      userProduct 
    });

  } catch (error) {
    console.error('Error in user products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');

    // If userId is provided (for public store view), fetch without auth
    if (userId) {
      // Get total count first
      const totalCount = await prisma.userProduct.count({
        where: { userId },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userProducts: {
            include: {
              product: true,
            },
            skip: offset,
            take: limit,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        products: user.userProducts,
        hasMore: offset + user.userProducts.length < totalCount,
        totalCount,
      });
    }

    // Otherwise, require authentication
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
      include: {
        userProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    // Auto-create user if not exists (from Supabase auth)
    if (!user) {
      console.log('[user-products] User not found in database, creating...');
      const defaultName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
      
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email,
          name: defaultName,
          storeName: defaultName,
          avatar_url: session.user.user_metadata?.avatar_url || null,
        },
        include: {
          userProducts: {
            include: {
              product: true,
            },
          },
        },
      });
      console.log('[user-products] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      products: user.userProducts,
      totalCount: user.userProducts.length,
    });

  } catch (error) {
    console.error('Error fetching user products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      console.log('[user-products DELETE] User not found in database, creating...');
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
      console.log('[user-products DELETE] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('DELETE - User ID:', user.id, 'Product ID:', productId);

    // Check if user product exists before deleting
    const existingUserProduct = await prisma.userProduct.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    console.log('DELETE - Existing user product:', existingUserProduct);

    if (!existingUserProduct) {
      return NextResponse.json(
        { error: 'Product not found in your store' },
        { status: 404 }
      );
    }

    // Delete related ClickTracking records first using UserProduct.id
    await prisma.clickTracking.deleteMany({
      where: {
        userProductId: existingUserProduct.id,
      },
    });

    // Delete user product
    await prisma.userProduct.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product removed from your store' 
    });

  } catch (error) {
    console.error('Error deleting user product:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
