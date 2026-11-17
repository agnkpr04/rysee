import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

// Check if user is admin
async function isAdmin(userId: string) {
  const admin = await prisma.admin.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  return admin !== null;
}

// Verify user from admin_session cookie
async function getUserFromCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie) return null;

  // Cookie value is admin ID directly, not JSON
  return sessionCookie.value;
}

export async function GET(request: Request) {
  try {
    const userId = await getUserFromCookie();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const digitalProducts = await prisma.masterDigitalProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ digitalProducts });
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ebooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserFromCookie();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, price, originalPrice, badge, thumbnail, previewImages, downloadUrl, category, subCategory, productType, contentCategory, features } = body;

    const digitalProduct = await prisma.masterDigitalProduct.create({
      data: {
        title,
        description,
        price,
        originalPrice: originalPrice || null,
        badge: badge || null,
        thumbnail,
        previewImages: previewImages || [],
        downloadUrl,
        category,
        subCategory,
        productType,
        contentCategory,
        features,
        status: 'active',
      },
    });

    revalidateTag('catalog');
    return NextResponse.json({ digitalProduct });
  } catch (error) {
    console.error('Error creating ebook:', error);
    return NextResponse.json(
      { error: 'Failed to create ebook' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserFromCookie();

    if (!userId) {
      console.log('[PUT] Unauthorized - no userId from cookie');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      console.log('[PUT] Forbidden - user is not admin', { userId });
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('[PUT] Request body:', body);
    const { id, title, description, price, originalPrice, badge, thumbnail, previewImages, downloadUrl, category, subCategory, productType, contentCategory, features, status } = body;

    console.log('[PUT] Updating digital product with id:', id);
    const digitalProduct = await prisma.masterDigitalProduct.update({
      where: { id },
      data: {
        title,
        description,
        price,
        originalPrice: originalPrice || null,
        badge: badge || null,
        thumbnail,
        previewImages: previewImages || [],
        downloadUrl,
        category,
        subCategory,
        productType,
        contentCategory,
        features,
        status,
      },
    });

    console.log('[PUT] Digital product updated successfully:', digitalProduct.id);
    revalidateTag('catalog');
    return NextResponse.json({ digitalProduct });
  } catch (error) {
    console.error('[PUT] Error updating ebook:', error);
    console.error('[PUT] Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to update ebook' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserFromCookie();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ebook ID required' },
        { status: 400 }
      );
    }

    await prisma.masterDigitalProduct.delete({
      where: { id },
    });

    revalidateTag('catalog');
    return NextResponse.json({ message: 'Digital product deleted successfully' });
  } catch (error) {
    console.error('Error deleting ebook:', error);
    return NextResponse.json(
      { error: 'Failed to delete ebook' },
      { status: 500 }
    );
  }
}
