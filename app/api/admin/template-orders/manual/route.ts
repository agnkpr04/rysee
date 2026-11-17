import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { generateAffiliateLink } from '@/lib/templates/helpers';

// Check if user is admin
async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { is_admin: true },
  });

  return user?.is_admin === true;
}

// Verify user from Authorization header
async function getUserFromAuthHeader(authHeader: string | null) {
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const supabaseClient = supabase;
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  if (error || !user) return null;

  return user;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = await getUserFromAuthHeader(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { masterTemplateId, customerName, customerEmail, customerPhone, affiliateId, notes } = body;

    if (!masterTemplateId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate master template exists
    const masterTemplate = await prisma.masterTemplate.findUnique({
      where: { id: masterTemplateId },
    });

    if (!masterTemplate) {
      return NextResponse.json(
        { error: 'Master template not found' },
        { status: 404 }
      );
    }

    let userTemplateId: string | null = null;

    // If affiliateId provided, find or create UserTemplate for that affiliate
    if (affiliateId) {
      const userTemplateResponse = await prisma.userTemplate.findFirst({
        where: {
          userId: affiliateId,
          masterTemplateId: masterTemplateId,
        },
      });

      if (userTemplateResponse) {
        userTemplateId = userTemplateResponse.id;
      } else {
        // Create UserTemplate for the affiliate
        const affiliateLink = generateAffiliateLink(masterTemplateId, affiliateId);
        const createResponse = await prisma.userTemplate.create({
          data: {
            userId: affiliateId,
            masterTemplateId: masterTemplateId,
            affiliateLink,
          },
        });
        userTemplateId = createResponse.id;
      }
    } else {
      // No affiliate, create a system UserTemplate (userId = null or admin user)
      // For manual orders without affiliate, we can use a placeholder or admin user
      // For now, let's create with null userId (will need to handle this case)
      const affiliateLink = generateAffiliateLink(masterTemplateId, user.id);
      const createResponse = await prisma.userTemplate.create({
        data: {
          userId: user.id, // Use admin user as placeholder
          masterTemplateId: masterTemplateId,
          affiliateLink,
        },
      });
      userTemplateId = createResponse.id;
    }

    if (!userTemplateId) {
      return NextResponse.json(
        { error: 'Failed to create user template' },
        { status: 500 }
      );
    }

    // Create manual order
    const order = await prisma.templateOrder.create({
      data: {
        userTemplateId,
        userId: user.id, // Admin created this order
        affiliateId: affiliateId || null,
        status: 'pending_verification',
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
        paymentProof: null, // Manual order, no payment proof
      },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating manual order:', error);
    return NextResponse.json(
      { error: 'Failed to create manual order' },
      { status: 500 }
    );
  }
}
