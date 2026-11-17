import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { canUserAddTemplate } from '@/lib/membership';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Auto-create user if not exists (from Supabase auth)
    if (!user) {
      console.log('[user-templates POST] User not found in database, creating...');
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
      console.log('[user-templates POST] User created:', user.id);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { masterTemplateId } = await request.json();

    if (!masterTemplateId) {
      return NextResponse.json(
        { error: 'Master template ID is required' },
        { status: 400 }
      );
    }

    // Validate master template exists
    const masterTemplate = await prisma.masterTemplate.findUnique({
      where: { id: masterTemplateId, status: 'active' },
    });

    if (!masterTemplate) {
      return NextResponse.json(
        { error: 'Master template not found or inactive' },
        { status: 404 }
      );
    }

    // Check if user already has this template
    const existingUserTemplate = await prisma.userTemplate.findUnique({
      where: {
        userId_masterTemplateId: {
          userId: user.id,
          masterTemplateId: masterTemplateId,
        },
      },
    });

    // Check if user is premium (templates are premium-only)
    if (!existingUserTemplate) {
      const canAdd = await canUserAddTemplate(user.id);
      if (!canAdd.canAdd) {
        return NextResponse.json(
          { error: canAdd.reason || 'Premium required to add templates' },
          { status: 403 }
        );
      }
    }

    // Generate affiliate link
    const affiliateLink = `/templates/${masterTemplateId}?ref=${user.id}`;

    // Create or update user template
    const userTemplate = await prisma.userTemplate.upsert({
      where: {
        userId_masterTemplateId: {
          userId: user.id,
          masterTemplateId: masterTemplateId,
        },
      },
      update: {
        affiliateLink,
      },
      create: {
        userId: user.id,
        masterTemplateId,
        affiliateLink,
      },
      include: { masterTemplate: true },
    });

    return NextResponse.json({ userTemplate });
  } catch (error) {
    console.error('Error creating user template:', error);
    return NextResponse.json(
      { error: 'Failed to create user template' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateId = searchParams.get('affiliateId');
    const masterTemplateId = searchParams.get('masterTemplateId');
    const userIdParam = searchParams.get('userId');

    // If userId is provided (for public store view), allow without authentication
    if (userIdParam) {
      const where: any = { userId: userIdParam };

      if (masterTemplateId) {
        where.masterTemplateId = masterTemplateId;
      }

      const userTemplates = await prisma.userTemplate.findMany({
        where,
        include: { masterTemplate: true },
        orderBy: { created_at: 'desc' },
      });

      return NextResponse.json({ userTemplates });
    }

    // For authenticated requests, get session
    const session = await getSessionFromRequest(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const where: any = { userId: affiliateId || user.id };

    if (masterTemplateId) {
      where.masterTemplateId = masterTemplateId;
    }

    const userTemplates = await prisma.userTemplate.findMany({
      where,
      include: { masterTemplate: true },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ userTemplates });
  } catch (error) {
    console.error('Error fetching user templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user templates' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const masterTemplateId = searchParams.get('masterTemplateId');

    if (!masterTemplateId) {
      return NextResponse.json(
        { error: 'Master template ID is required' },
        { status: 400 }
      );
    }

    // Delete user template
    await prisma.userTemplate.delete({
      where: {
        userId_masterTemplateId: {
          userId: user.id,
          masterTemplateId: masterTemplateId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user template:', error);
    return NextResponse.json(
      { error: 'Failed to delete user template' },
      { status: 500 }
    );
  }
}
