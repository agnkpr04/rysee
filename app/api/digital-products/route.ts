import { NextResponse } from 'next/server';
import { getDigitalProducts } from '@/lib/catalog';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const digitalProducts = await getDigitalProducts(category && category !== '' ? category : null);

    const response = NextResponse.json({ digitalProducts });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching digital products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital products' },
      { status: 500 }
    );
  }
}
