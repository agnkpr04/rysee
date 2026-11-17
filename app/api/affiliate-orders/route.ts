import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { getCommissionRate, getTemplateCommissionRate, normalizeTier } from '@/lib/membership-config';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log('[Affiliate Orders] Fetching orders for userId:', userId);

    // Get user's subscription tier for commission calculation
    const userSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    const userTier = userSubscription?.status === 'active'
      ? normalizeTier(userSubscription.plan)
      : 'free';

    // Get template orders where user is the affiliate (store owner)
    const templateOrders = await prisma.templateOrder.findMany({
      where: { affiliateId: userId },
      include: {
        userTemplate: {
          include: {
            masterTemplate: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    // Calculate commission for each template order
    const templateOrdersWithCommission = templateOrders.map(order => {
      const commissionRate = getTemplateCommissionRate(userTier);
      const commission = Math.floor(order.userTemplate.masterTemplate.price * commissionRate);
      return {
        ...order,
        commission,
        commissionRate,
        productPrice: order.userTemplate.masterTemplate.price
      };
    });

    console.log('[Affiliate Orders] Template orders found:', templateOrders.length);

    // Get digital product orders where user is the affiliate (store owner)
    const digitalProductOrders = await prisma.digitalProductOrder.findMany({
      where: { affiliateId: userId },
      include: {
        userDigitalProduct: {
          include: {
            masterDigitalProduct: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    // Calculate commission for each digital product order
    const digitalProductOrdersWithCommission = digitalProductOrders.map(order => {
      const commissionRate = getCommissionRate(userTier);
      const commission = Math.floor(order.userDigitalProduct.masterDigitalProduct.price * commissionRate);
      return {
        ...order,
        commission,
        commissionRate,
        productPrice: order.userDigitalProduct.masterDigitalProduct.price
      };
    });

    console.log('[Affiliate Orders] Digital product orders found:', digitalProductOrders.length);

    return NextResponse.json({
      templateOrders: templateOrdersWithCommission,
      digitalProductOrders: digitalProductOrdersWithCommission,
      userTier
    });
  } catch (error) {
    console.error('Error fetching affiliate orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
