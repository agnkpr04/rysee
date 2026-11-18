import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { getSessionFromRequest } from '@/lib/auth';
import { sendAffiliateOrderNotification, sendAdminOrderNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Anda harus login terlebih dahulu untuk melakukan pembelian' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const userTemplateId = formData.get('userTemplateId') as string;
    const affiliateId = formData.get('affiliateId') as string;
    const proofFile = formData.get('proof') as File;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const notes = formData.get('notes') as string | null;

    if (!userTemplateId || !proofFile) {
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

    // Get user info (affiliate/store owner)
    const user = await prisma.user.findUnique({
      where: { id: userTemplate.userId },
      select: { id: true, name: true, email: true }
    });

    // Security: Validate that affiliateId (from URL) matches the actual store owner
    // Prevents commission hijacking by tampering with affiliateId in the request
    if (affiliateId && affiliateId !== userTemplate.userId) {
      return NextResponse.json(
        { error: 'Invalid affiliate reference' },
        { status: 400 }
      );
    }
    // Always set affiliateId to actual store owner (source of truth)
    const validatedAffiliateId = userTemplate.userId;
    console.log('[Template Order] validatedAffiliateId:', validatedAffiliateId);

    // Upload proof file to Supabase Storage (admin client with service role)
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
    const order = await prisma.templateOrder.create({
      data: {
        userTemplateId,
        userId: session.user.id,
        affiliateId: validatedAffiliateId,
        status: 'pending_verification',
        paymentProof: publicUrl,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    // Send notification to affiliate (store owner)
    if (user && user.email) {
      await sendAffiliateOrderNotification(
        user.email,
        user.name,
        customerName,
        customerEmail,
        userTemplate.masterTemplate.title,
        'template',
        userTemplate.masterTemplate.price
      );
    }

    // Send notification to admin
    if (user) {
      await sendAdminOrderNotification(
        user.email,
        user.name,
        customerName,
        customerEmail,
        userTemplate.masterTemplate.title,
        'template',
        userTemplate.masterTemplate.price
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
