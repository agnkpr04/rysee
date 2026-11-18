import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { getSessionFromRequest } from '@/lib/auth';
import { sendAffiliateOrderNotification, sendAdminOrderNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    const formData = await request.formData();
    const userDigitalProductId = formData.get('userDigitalProductId') as string;
    const affiliateId = formData.get('affiliateId') as string;
    const proofFile = formData.get('proof') as File;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const notes = formData.get('notes') as string | null;

    if (!userDigitalProductId || !proofFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user digital product exists
    const userDigitalProduct = await prisma.userDigitalProduct.findUnique({
      where: { id: userDigitalProductId },
      include: { masterDigitalProduct: true, user: true },
    });

    if (!userDigitalProduct) {
      return NextResponse.json(
        { error: 'User digital product not found' },
        { status: 404 }
      );
    }

    // Security: Validate that affiliateId (from URL) matches the actual store owner
    // Prevents commission hijacking by tampering with affiliateId in the request
    if (affiliateId && affiliateId !== userDigitalProduct.userId) {
      return NextResponse.json(
        { error: 'Invalid affiliate reference' },
        { status: 400 }
      );
    }
    // Always set affiliateId to actual store owner (source of truth)
    const validatedAffiliateId = userDigitalProduct.userId;
    console.log('[Digital Product Order] validatedAffiliateId:', validatedAffiliateId);

    // Upload proof file to Supabase Storage
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileExt = proofFile.name.split('.').pop();
    const fileName = `payment-proof-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `payment-proofs/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('payment-proofs')
      .upload(filePath, proofFile);

    if (uploadError) {
      console.error('Error uploading proof:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload payment proof' },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    // Create order: store proof URL in paymentProof field (NOT downloadUrl)
    // downloadUrl will be set later by admin upon approval
    const order = await prisma.digitalProductOrder.create({
      data: {
        userDigitalProductId,
        userId: session?.user?.id || undefined,
        affiliateId: validatedAffiliateId,
        status: 'pending_verification',
        paymentProof: publicUrl,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      },
      include: { userDigitalProduct: { include: { masterDigitalProduct: true } } },
    });

    // Send notification to affiliate (store owner)
    if (validatedAffiliateId && userDigitalProduct.user.email) {
      await sendAffiliateOrderNotification(
        userDigitalProduct.user.email,
        userDigitalProduct.user.name,
        customerName,
        customerEmail,
        userDigitalProduct.masterDigitalProduct.title,
        'digital-product',
        userDigitalProduct.masterDigitalProduct.price
      );
    }

    // Send notification to admin
    await sendAdminOrderNotification(
      userDigitalProduct.user.email,
      userDigitalProduct.user.name,
      customerName,
      customerEmail,
      userDigitalProduct.masterDigitalProduct.title,
      'digital-product',
      userDigitalProduct.masterDigitalProduct.price
    );

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
