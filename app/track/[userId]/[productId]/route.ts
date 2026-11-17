import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  try {
    const { userId, productId } = params;

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    // Find the UserProduct record
    const userProduct = await prisma.userProduct.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!userProduct) {
      return NextResponse.json({ error: 'Product not found in user store' }, { status: 404 });
    }

    // Record the click
    await prisma.clickTracking.create({
      data: {
        userId,
        productId,
        userProductId: userProduct.id,
        ipAddress,
        userAgent,
        referrer,
      },
    });

    // Redirect to the affiliate link
    return NextResponse.redirect(userProduct.affiliateLink);
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
