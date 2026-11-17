import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderDeclineNotification } from '@/lib/email';

// Check if user is admin from admin_session cookie (cookie stores admin.id)
async function isAdminFromCookie(cookie: string | null) {
  if (!cookie) return false;

  const admin = await prisma.admin.findFirst({
    where: { id: cookie },
  });

  return !!admin;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookies = request.headers.get('cookie');
    const adminSession = cookies?.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];

    const isUserAdmin = await isAdminFromCookie(adminSession || null);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const order = await prisma.templateOrder.findUnique({
      where: { id },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status to declined
    const updatedOrder = await prisma.templateOrder.update({
      where: { id },
      data: {
        status: 'declined',
      },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    // Send decline email to buyer
    if (order.customerEmail) {
      await sendOrderDeclineNotification(
        order.customerEmail,
        order.customerName,
        order.userTemplate.masterTemplate.title,
        'template',
        order.userTemplate.masterTemplate.price
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error declining order:', error);
    return NextResponse.json(
      { error: 'Failed to decline order' },
      { status: 500 }
    );
  }
}
