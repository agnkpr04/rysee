import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const captions = await prisma.caption.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Failed to fetch captions:', error);
    return NextResponse.json({ error: 'Failed to fetch captions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, order } = body;

    if (!content || !category) {
      return NextResponse.json({ error: 'Content and category are required' }, { status: 400 });
    }

    const caption = await prisma.caption.create({
      data: {
        title: title || '',
        content,
        category,
        sortOrder: order || 0,
      },
    });

    return NextResponse.json({ caption }, { status: 201 });
  } catch (error) {
    console.error('Failed to create caption:', error);
    return NextResponse.json({ error: 'Failed to create caption: ' + (error as Error).message }, { status: 500 });
  }
}
