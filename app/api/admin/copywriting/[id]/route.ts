import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

// GET - Get single copywriting
export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const copywriting = await prisma.copywriting.findUnique({
      where: { id: params.id },
    });

    if (!copywriting) {
      return NextResponse.json({ error: 'Copywriting not found' }, { status: 404 });
    }

    return NextResponse.json({ copywriting });
  } catch (error) {
    console.error('Failed to fetch copywriting:', error);
    return NextResponse.json({ error: 'Failed to fetch copywriting' }, { status: 500 });
  }
}

// PUT - Update copywriting
export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, isActive, order } = body;

    const copywriting = await prisma.copywriting.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ copywriting });
  } catch (error) {
    console.error('Failed to update copywriting:', error);
    return NextResponse.json({ error: 'Failed to update copywriting' }, { status: 500 });
  }
}

// DELETE - Delete copywriting
export async function DELETE(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.copywriting.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete copywriting:', error);
    return NextResponse.json({ error: 'Failed to delete copywriting' }, { status: 500 });
  }
}
