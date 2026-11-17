import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

// GET - List all copywriting
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const copywriting = await prisma.copywriting.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ copywriting });
  } catch (error) {
    console.error('Failed to fetch copywriting:', error);
    return NextResponse.json({ error: 'Failed to fetch copywriting' }, { status: 500 });
  }
}

// POST - Create new copywriting
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, order } = body;

    console.log('Copywriting request body:', body);

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const copywriting = await prisma.copywriting.create({
      data: {
        title: '', // Provide empty string for backward compatibility
        content,
        sortOrder: order || 0,
      },
    });

    return NextResponse.json({ copywriting }, { status: 201 });
  } catch (error) {
    console.error('Failed to create copywriting:', error);
    return NextResponse.json({ error: 'Failed to create copywriting: ' + (error as Error).message }, { status: 500 });
  }
}
