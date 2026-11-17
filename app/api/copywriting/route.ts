import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all active copywriting (public)
export async function GET(request: NextRequest) {
  try {
    const copywriting = await prisma.copywriting.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ copywriting });
  } catch (error) {
    console.error('Failed to fetch copywriting:', error);
    return NextResponse.json({ error: 'Failed to fetch copywriting' }, { status: 500 });
  }
}
