import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveTemplates } from '@/lib/catalog';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';

    let templates;
    if (status === 'active') {
      templates = await getActiveTemplates(category);
    } else {
      const where: any = { status };
      if (category) where.category = category;
      templates = await prisma.masterTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }

    const response = NextResponse.json({ templates });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
