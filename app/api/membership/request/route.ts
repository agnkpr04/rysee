import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { sendMembershipRequestNotification } from '@/lib/email';
import { TIER_PRICES, type MembershipTier } from '@/lib/membership-config';

export async function POST(request: NextRequest) {
  try {
    console.log('[Payment Request] Starting request processing...');
    const session = await getSessionFromRequest(request);

    if (!session?.user?.email) {
      console.log('[Payment Request] Authentication failed');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('[Payment Request] Authenticated user:', session.user.email);

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Auto-create user if not exists
    if (!user) {
      const defaultName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email,
          name: defaultName,
          storeName: defaultName,
          avatar_url: session.user.user_metadata?.avatar_url || null,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const plan = formData.get('plan') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const proof = formData.get('proof') as File;
    const payerName = formData.get('payerName') as string;
    const whatsapp = formData.get('whatsapp') as string;

    console.log('[Payment Request] Received data:', { plan, paymentMethod, hasProof: !!proof, payerName, whatsapp });

    if (!plan || !paymentMethod || !proof) {
      console.log('[Payment Request] Missing required fields');
      return NextResponse.json(
        { error: 'Plan, payment method, and proof are required' },
        { status: 400 }
      );
    }

    // Validate plan (only paid tiers can be requested)
    const validPlans: MembershipTier[] = ['pro', 'premium'];
    if (!validPlans.includes(plan as MembershipTier)) {
      console.log('[Payment Request] Invalid plan:', plan);
      return NextResponse.json(
        { error: 'Invalid plan. Must be pro or premium.' },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['bca', 'dana', 'ovo'];
    if (!validMethods.includes(paymentMethod)) {
      console.log('[Payment Request] Invalid payment method:', paymentMethod);
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Determine amount based on plan from central config
    const amount = TIER_PRICES[plan as MembershipTier];

    if (!amount || amount <= 0) {
      console.log('[Payment Request] Invalid amount for plan:', plan);
      return NextResponse.json(
        { error: 'Invalid plan amount' },
        { status: 400 }
      );
    }

    console.log('[Payment Request] Amount:', amount);

    // Upload proof to Supabase Storage
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileExt = proof.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `payment-proofs/${fileName}`;

    console.log('[Payment Request] Uploading proof to:', filePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, proof, {
        upsert: true,
      });

    if (uploadError) {
      console.error('[Payment Request] Error uploading proof:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload proof of transfer' },
        { status: 500 }
      );
    }

    console.log('[Payment Request] Upload successful');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    // Create payment record with proof URL
    console.log('[Payment Request] Creating payment record...');
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount,
        method: 'manual',
        status: 'pending',
        description: `Membership upgrade to ${plan} plan via ${paymentMethod.toUpperCase()}`,
        proofUrl: publicUrl,
        proofFilename: proof.name,
        payerName,
        whatsapp,
      },
    });

    console.log('[Payment Request] Payment record created:', payment.id);

    // Send email notification to admin
    await sendMembershipRequestNotification(
      user.email,
      user.name,
      plan,
      paymentMethod,
      amount
    );

    // Payment info
    const paymentInfo: Record<string, { account: string; name: string }> = {
      bca: { account: '5358178183', name: 'Agung Prayitno' },
      dana: { account: '082218455821', name: 'Agung Prayitno' },
      ovo: { account: '082218455821', name: 'Agung Prayitno' },
    };

    const info = paymentInfo[paymentMethod];

    console.log('[Payment Request] Request completed successfully');
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount,
        method: paymentMethod.toUpperCase(),
        account: info.account,
        accountName: info.name,
        description: payment.description,
      },
    });

  } catch (error) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
