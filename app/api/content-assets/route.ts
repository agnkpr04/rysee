import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all active content assets (public)
export async function GET(request: NextRequest) {
  try {
    const assets = await prisma.contentAsset.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Failed to fetch content assets:', error);
    return NextResponse.json({ error: 'Failed to fetch content assets' }, { status: 500 });
  }
}
