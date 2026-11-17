import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { canUserAddTemplate } from '@/lib/membership';

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
      console.log('[user-digital-products POST] User not found in database, creating...');
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
      console.log('[user-digital-products POST] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { masterDigitalProductId } = await request.json();

    if (!masterDigitalProductId) {
      return NextResponse.json(
        { error: 'Master digital product ID is required' },
        { status: 400 }
      );
    }

    // Validate master digital product exists
    const masterDigitalProduct = await prisma.masterDigitalProduct.findUnique({
      where: { id: masterDigitalProductId, status: 'active' },
    });

    if (!masterDigitalProduct) {
      return NextResponse.json(
        { error: 'Master digital product not found or inactive' },
        { status: 404 }
      );
    }

    // Check if user already has this digital product
    const existingUserDigitalProduct = await prisma.userDigitalProduct.findUnique({
      where: {
        userId_masterDigitalProductId: {
          userId: user.id,
          masterDigitalProductId: masterDigitalProductId,
        },
      },
    });

    // Check if user is premium (digital products are premium-only)
    if (!existingUserDigitalProduct) {
      const canAdd = await canUserAddTemplate(user.id);
      if (!canAdd.canAdd) {
        return NextResponse.json(
          { error: canAdd.reason || 'Premium required to add digital products' },
          { status: 403 }
        );
      }
    }

    // Generate affiliate link
    const affiliateLink = `/digital-products/${masterDigitalProductId}?ref=${user.id}`;

    // Create or update user digital product
    const userDigitalProduct = await prisma.userDigitalProduct.upsert({
      where: {
        userId_masterDigitalProductId: {
          userId: user.id,
          masterDigitalProductId: masterDigitalProductId,
        },
      },
      update: {
        affiliateLink,
      },
      create: {
        userId: user.id,
        masterDigitalProductId,
        affiliateLink,
      },
      include: { masterDigitalProduct: true },
    });

    return NextResponse.json({ userDigitalProduct });
  } catch (error) {
    console.error('Error creating user digital product:', error);
    return NextResponse.json(
      { error: 'Failed to create user digital product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateId = searchParams.get('affiliateId');
    const masterDigitalProductId = searchParams.get('masterDigitalProductId');
    const userIdParam = searchParams.get('userId');

    // If userId is provided (for public store view), allow without authentication
    if (userIdParam) {
      const where: any = { userId: userIdParam };

      if (masterDigitalProductId) {
        where.masterDigitalProductId = masterDigitalProductId;
      }

      const userDigitalProducts = await prisma.userDigitalProduct.findMany({
        where,
        include: { masterDigitalProduct: true },
        orderBy: { created_at: 'desc' },
      });

      return NextResponse.json({ userDigitalProducts });
    }

    // For authenticated requests, get session
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const where: any = { userId: affiliateId || user.id };

    if (masterDigitalProductId) {
      where.masterDigitalProductId = masterDigitalProductId;
    }

    const userDigitalProducts = await prisma.userDigitalProduct.findMany({
      where,
      include: { masterDigitalProduct: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ userDigitalProducts });
  } catch (error) {
    console.error('Error fetching user digital products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user digital products' },
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const masterDigitalProductId = searchParams.get('masterDigitalProductId');

    if (!masterDigitalProductId) {
      return NextResponse.json(
        { error: 'Master digital product ID is required' },
        { status: 400 }
      );
    }

    // Delete user digital product
    await prisma.userDigitalProduct.delete({
      where: {
        userId_masterDigitalProductId: {
          userId: user.id,
          masterDigitalProductId: masterDigitalProductId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user digital product:', error);
    return NextResponse.json(
      { error: 'Failed to delete user digital product' },
      { status: 500 }
    );
  }
}
