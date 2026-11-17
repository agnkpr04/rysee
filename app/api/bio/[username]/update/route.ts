import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function sanitizeString(str: string, maxLength: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { username } = await params;
    const body = await request.json();

    const {
      bioDescription,
      bioStoreUrl,
      bioReferralUrl,
      bioEnabled,
      showStoreButton,
      showReferralButton,
    } = body;

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Authorization: only owner can update
    if (session.user.id !== targetUser.id) {
      return NextResponse.json(
        { error: 'You can only update your own bio' },
        { status: 403 }
      );
    }

    const updateData: any = {};

    if (bioDescription !== undefined) {
      updateData.bioDescription = sanitizeString(bioDescription, 500);
    }
    if (bioStoreUrl !== undefined) {
      updateData.bioStoreUrl = bioStoreUrl ? sanitizeString(bioStoreUrl, 500) : null;
    }
    if (bioReferralUrl !== undefined) {
      updateData.bioReferralUrl = bioReferralUrl ? sanitizeString(bioReferralUrl, 500) : null;
    }
    if (bioEnabled !== undefined) {
      updateData.bioEnabled = Boolean(bioEnabled);
    }
    if (showStoreButton !== undefined) {
      updateData.showStoreButton = Boolean(showStoreButton);
    }
    if (showReferralButton !== undefined) {
      updateData.showReferralButton = Boolean(showReferralButton);
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: updateData,
      select: {
        bioDescription: true,
        bioStoreUrl: true,
        bioReferralUrl: true,
        bioEnabled: true,
        showStoreButton: true,
        showReferralButton: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[bio PUT] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
