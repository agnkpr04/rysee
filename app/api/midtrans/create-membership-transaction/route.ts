import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import midtransClient from 'midtrans-client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, planName, price } = body;

    if (!plan || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate plan and price
    const validPlans = {
      premium: 59000,
    };

    if (!validPlans[plan as keyof typeof validPlans]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const expectedPrice = validPlans[plan as keyof typeof validPlans];
    if (price !== expectedPrice) {
      return NextResponse.json(
        { error: 'Invalid price for selected plan' },
        { status: 400 }
      );
    }

    // Initialize Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    
    console.log('[Midtrans Membership] Server key exists:', !!serverKey);
    console.log('[Midtrans Membership] Server key format:', serverKey ? `${serverKey.substring(0, 10)}...${serverKey.substring(serverKey.length - 5)}` : 'missing');
    console.log('[Midtrans Membership] Client key exists:', !!clientKey);
    console.log('[Midtrans Membership] Is production:', true);

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey: serverKey!,
      clientKey: clientKey!,
    });

    // Generate unique order ID
    const orderId = `MEMBERSHIP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment request with pending_payment status
    const paymentRequest = await prisma.membershipPayment.create({
      data: {
        userId: session.user.id,
        plan,
        amount: price,
        status: 'pending_payment',
        midtransOrderId: orderId,
        paymentMethod: 'midtrans',
      },
    });

    // Get user info for customer details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    const firstName = (user?.name || 'User').substring(0, 20);
    const safeEmail = user?.email || 'user@example.com';

    // Create Midtrans transaction parameters
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: firstName,
        email: safeEmail,
        phone: '08000000000',
      },
      item_details: [{
        id: `MEMBERSHIP-${plan}`,
        price: price,
        quantity: 1,
        name: `${planName} Membership - Lifetime Access`,
      }],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/pricing?payment_status=success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/pricing?payment_status=error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/pricing?payment_status=pending`,
      },
    };

    console.log('[Midtrans Membership] Transaction params:', JSON.stringify(transactionParams));

    // Create Snap transaction
    const transaction = await snap.createTransaction(transactionParams);

    console.log('[Midtrans Membership] Transaction created successfully:', {
      orderId,
      token: transaction.token ? 'exists' : 'missing',
      redirect_url: transaction.redirect_url ? 'exists' : 'missing',
    });

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId,
      paymentRequestId: paymentRequest.id,
    });
  } catch (error) {
    console.error('[Midtrans Membership] Error creating transaction:', error);
    if (error instanceof Error) {
      console.error('[Midtrans Membership] Error message:', error.message);
    }
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    };
    console.error('[Midtrans Membership] Error details:', JSON.stringify(errorDetails));
    return NextResponse.json(
      { error: 'Failed to create transaction', details: errorDetails.message },
      { status: 500 }
    );
  }
}
