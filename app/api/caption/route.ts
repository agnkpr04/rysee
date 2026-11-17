import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const captions = await prisma.caption.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Failed to fetch captions:', error);
    return NextResponse.json({ error: 'Failed to fetch captions' }, { status: 500 });
  }
}
