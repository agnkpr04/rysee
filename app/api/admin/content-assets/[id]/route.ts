import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

// GET - Get single content asset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const asset = await prisma.contentAsset.findUnique({
      where: { id: params.id },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Content asset not found' }, { status: 404 });
    }

    return NextResponse.json({ asset });
  } catch (error) {
    console.error('Failed to fetch content asset:', error);
    return NextResponse.json({ error: 'Failed to fetch content asset' }, { status: 500 });
  }
}

// PUT - Update content asset
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, thumbnail, fileUrls, isActive, order } = body;

    const asset = await prisma.contentAsset.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(fileUrls !== undefined && { fileUrls }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ asset });
  } catch (error) {
    console.error('Failed to update content asset:', error);
    return NextResponse.json({ error: 'Failed to update content asset' }, { status: 500 });
  }
}

// DELETE - Delete content asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.contentAsset.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete content asset:', error);
    return NextResponse.json({ error: 'Failed to delete content asset' }, { status: 500 });
  }
}
