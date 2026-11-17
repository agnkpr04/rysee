import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { sendManualOrderNotification, sendAffiliateOrderNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userTemplateId = formData.get('userTemplateId') as string;
    const affiliateId = formData.get('affiliateId') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const notes = formData.get('notes') as string | null;
    const paymentMethod = formData.get('paymentMethod') as string;
    const proof = formData.get('proof') as File | null;

    console.log('[Manual Payment Template] Received:', {
      userTemplateId,
      affiliateId,
      customerName,
      customerEmail,
      paymentMethod,
      hasProof: !!proof,
    });

    // Validate required fields
    if (!userTemplateId || !customerName || !customerEmail || !customerPhone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['bca', 'dana', 'ovo'];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Validate user template exists
    const userTemplate = await prisma.userTemplate.findUnique({
      where: { id: userTemplateId },
      include: { masterTemplate: true, user: true },
    });

    if (!userTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
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

    // Upload proof to Supabase Storage if provided
    let proofUrl: string | null = null;
    if (proof && proof.size > 0) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const fileExt = proof.name.split('.').pop();
      const fileName = `tp-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `payment-proofs/templates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, proof, { upsert: true });

      if (uploadError) {
        console.error('[Manual Payment Template] Upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload payment proof' },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      proofUrl = publicUrl;
    }

    // Generate unique order ID for manual payment
    const orderId = `MANUAL-TP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create order with pending_verification status
    const order = await prisma.templateOrder.create({
      data: {
        userTemplateId,
        userId: 'guest',
        affiliateId: validatedAffiliateId,
        status: 'pending_verification',
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
        paymentProof: proofUrl,
        paymentMethod: `manual_${paymentMethod}`,
        midtransOrderId: orderId,
      },
    });

    console.log('[Manual Payment Template] Order created:', order.id);

    // Notify admin via email
    await sendManualOrderNotification(
      customerName,
      customerEmail,
      customerPhone,
      userTemplate.masterTemplate.title,
      'template',
      paymentMethod,
      userTemplate.masterTemplate.price
    );

    // Send notification to affiliate (store owner)
    if (validatedAffiliateId && userTemplate.user.email) {
      await sendAffiliateOrderNotification(
        userTemplate.user.email,
        userTemplate.user.name,
        customerName,
        userTemplate.masterTemplate.title,
        'template',
        userTemplate.masterTemplate.price
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        productTitle: userTemplate.masterTemplate.title,
        amount: userTemplate.masterTemplate.price,
      },
    });
  } catch (error) {
    console.error('[Manual Payment Template] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
