import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import midtransClient from 'midtrans-client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    const body = await request.json();
    const { userTemplateId, affiliateId, customerName, customerEmail, customerPhone, notes } = body;

    if (!userTemplateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user template exists
    const userTemplate = await prisma.userTemplate.findUnique({
      where: { id: userTemplateId },
      include: { masterTemplate: true },
    });

    if (!userTemplate) {
      return NextResponse.json(
        { error: 'User template not found' },
        { status: 404 }
      );
    }

    // Security: Validate that affiliateId matches the actual store owner
    if (affiliateId && affiliateId !== userTemplate.userId) {
      return NextResponse.json(
        { error: 'Invalid affiliate reference' },
        { status: 400 }
      );
    }
    const validatedAffiliateId = userTemplate.userId;

    // Initialize Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;

    console.log('[Midtrans Template] Server key exists:', !!serverKey);
    console.log('[Midtrans Template] Client key exists:', !!clientKey);

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey: serverKey!,
      clientKey: clientKey!,
    });

    // Generate unique order ID
    const orderId = `TEMPLATE-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create order with pending_payment status
    const order = await prisma.templateOrder.create({
      data: {
        userTemplateId,
        userId: session?.user?.id || 'guest',
        affiliateId: validatedAffiliateId,
        status: 'pending_payment',
        midtransOrderId: orderId,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      },
    });

    // Create Midtrans transaction parameters
    const price = parseInt(String(userTemplate.masterTemplate.price));
    const itemName = (userTemplate.masterTemplate.title || 'Website Template').substring(0, 50);
    const firstName = (customerName || 'Customer').substring(0, 20);
    const safeEmail = customerEmail || 'customer@example.com';
    const safePhone = customerPhone || '08000000000';

    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: firstName,
        email: safeEmail,
        phone: safePhone,
      },
      item_details: [{
        id: userTemplate.masterTemplate.id.substring(0, 50),
        price: price,
        quantity: 1,
        name: itemName,
      }],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/affstore/${validatedAffiliateId}?payment_status=success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/affstore/${validatedAffiliateId}?payment_status=error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rysee.my.id'}/affstore/${validatedAffiliateId}?payment_status=pending`,
      },
    };

    console.log('[Midtrans Template] Transaction params:', JSON.stringify(transactionParams));

    // Create Snap transaction
    const transaction = await snap.createTransaction(transactionParams);

    console.log('[Midtrans Template] Transaction created successfully:', {
      orderId,
      token: transaction.token ? 'exists' : 'missing',
      redirect_url: transaction.redirect_url ? 'exists' : 'missing',
    });

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId,
    });
  } catch (error) {
    console.error('[Midtrans Template] Error creating transaction:', error);
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    };
    console.error('[Midtrans Template] Error details:', JSON.stringify(errorDetails));
    return NextResponse.json(
      { error: 'Failed to create transaction', details: errorDetails.message },
      { status: 500 }
    );
  }
}
