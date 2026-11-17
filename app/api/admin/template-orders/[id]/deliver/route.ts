import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: sessionCookie.value },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: orderId } = await params;
    const body = await request.json();
    const { deliveryUrl } = body;

    if (!deliveryUrl) {
      return NextResponse.json({ error: 'Delivery URL is required' }, { status: 400 });
    }

    // Get order with template info
    const order = await prisma.templateOrder.findUnique({
      where: { id: orderId },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'paid') {
      return NextResponse.json({ error: 'Order is not in paid status' }, { status: 400 });
    }

    // Update order status to verified (website delivered)
    // Commission is NOT credited here - it was already credited on payment approval
    const updatedOrder = await prisma.templateOrder.update({
      where: { id: orderId },
      data: { status: 'verified', downloadUrl: deliveryUrl },
    });

    console.log('[Template Deliver] Website delivered:', {
      orderId,
      affiliateId: order.affiliateId,
      note: 'Commission was already credited on payment approval',
    });

    // Send email to customer with delivery link
    if (order.customerEmail) {
      try {
        const { sendOrderApprovalNotification } = await import('@/lib/email');
        await sendOrderApprovalNotification(
          order.customerEmail,
          order.customerName || 'Customer',
          order.userTemplate.masterTemplate.title,
          'template',
          deliveryUrl,
          null,
          order.userTemplate.masterTemplate.price
        );
        console.log('[Template Deliver] Email sent to:', order.customerEmail);
      } catch (emailError) {
        console.error('[Template Deliver] Failed to send email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Website delivered and customer notified',
    });
  } catch (error) {
    console.error('[Template Deliver] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
