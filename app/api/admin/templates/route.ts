import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
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
    const { title, description, price, originalPrice, badge, thumbnail, previewUrl, previewImages, category, subCategory, features, technology, deliverables } = body;

    const template = await prisma.masterTemplate.create({
      data: {
        title,
        description,
        price,
        originalPrice,
        badge,
        thumbnail,
        previewUrl,
        previewImages: previewImages || [],
        category,
        subCategory,
        features,
        technology: technology || ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
        deliverables: deliverables || [],
        status: 'active',
      },
    });

    revalidateTag('catalog');
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
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
    const { id, title, description, price, originalPrice, badge, thumbnail, previewUrl, previewImages, category, subCategory, features, technology, deliverables, status } = body;

    console.log('[PUT] Updating template with id:', id);
    const template = await prisma.masterTemplate.update({
      where: { id },
      data: {
        title,
        description,
        price,
        originalPrice,
        badge,
        thumbnail,
        previewUrl,
        previewImages: previewImages || [],
        category,
        subCategory,
        features,
        technology: technology || ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
        deliverables: deliverables || [],
        status,
      },
    });

    console.log('[PUT] Template updated successfully:', template.id);
    revalidateTag('catalog');
    return NextResponse.json({ template });
  } catch (error) {
    console.error('[PUT] Error updating template:', error);
    console.error('[PUT] Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to update template' },
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
        { error: 'Template ID required' },
        { status: 400 }
      );
    }

    await prisma.masterTemplate.delete({
      where: { id },
    });

    revalidateTag('catalog');
    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
