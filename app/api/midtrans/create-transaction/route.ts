import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import midtransClient from 'midtrans-client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    const body = await request.json();
    const { userDigitalProductId, affiliateId, customerName, customerEmail, customerPhone, notes } = body;

    if (!userDigitalProductId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user digital product exists
    const userDigitalProduct = await prisma.userDigitalProduct.findUnique({
      where: { id: userDigitalProductId },
      include: { masterDigitalProduct: true },
    });

    if (!userDigitalProduct) {
      return NextResponse.json(
        { error: 'User digital product not found' },
        { status: 404 }
      );
    }

    // Security: Validate that affiliateId matches the actual store owner
    if (affiliateId && affiliateId !== userDigitalProduct.userId) {
      return NextResponse.json(
        { error: 'Invalid affiliate reference' },
        { status: 400 }
      );
    }
    const validatedAffiliateId = userDigitalProduct.userId;

    // Initialize Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    
    console.log('[Midtrans] Server key exists:', !!serverKey);
    console.log('[Midtrans] Server key format:', serverKey ? `${serverKey.substring(0, 10)}...${serverKey.substring(serverKey.length - 5)}` : 'missing');
    console.log('[Midtrans] Client key exists:', !!clientKey);
    console.log('[Midtrans] Is production:', true);

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey: serverKey!,
      clientKey: clientKey!,
    });

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create order with pending_payment status
    const order = await prisma.digitalProductOrder.create({
      data: {
        userDigitalProductId,
        userId: session?.user?.id || undefined,
        affiliateId: validatedAffiliateId,
        status: 'pending_payment',
        midtransOrderId: orderId,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      },
      include: { userDigitalProduct: { include: { masterDigitalProduct: true } } },
    });

    // Create Midtrans transaction parameters
    const price = parseInt(String(userDigitalProduct.masterDigitalProduct.price));
    const itemName = (userDigitalProduct.masterDigitalProduct.title || 'Digital Product').substring(0, 50);
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
        id: userDigitalProduct.masterDigitalProduct.id.substring(0, 50),
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

    console.log('[Midtrans] Transaction params:', JSON.stringify(transactionParams));

    // Create Snap transaction
    const transaction = await snap.createTransaction(transactionParams);

    console.log('[Midtrans] Transaction created successfully:', {
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
    console.error('[Midtrans] Error creating transaction:', error);
    if (error instanceof Error) {
      console.error('[Midtrans] Error message:', error.message);
    }
    // Safely log error details without circular structure
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    };
    console.error('[Midtrans] Error details:', JSON.stringify(errorDetails));
    return NextResponse.json(
      { error: 'Failed to create transaction', details: errorDetails.message },
      { status: 500 }
    );
  }
}
