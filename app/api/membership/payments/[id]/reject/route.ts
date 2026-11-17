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

    const { id: paymentId } = await params;

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'Payment is not pending' }, { status: 400 });
    }

    // Update payment status to failed
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'failed' },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment rejected' 
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
