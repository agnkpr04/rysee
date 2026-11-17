import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        storeName: true,
        storeDescription: true,
        avatar_url: true,
        storeTheme: true,
        referralCode: true,
        bioDescription: true,
        bioStoreUrl: true,
        bioReferralUrl: true,
        bioEnabled: true,
        showStoreButton: true,
        showReferralButton: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.bioEnabled) {
      return NextResponse.json(
        { error: 'Bio page is not active', bioEnabled: false },
        { status: 403 }
      );
    }

    // Resolve default links
    const storeUrl = user.bioStoreUrl || `/${user.username || user.id}`;
    const referralUrl = user.bioReferralUrl || `/?ref=${user.referralCode || ''}`;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        avatarUrl: user.avatar_url,
        storeTheme: user.storeTheme,
        bioDescription: user.bioDescription,
        showStoreButton: user.showStoreButton,
        showReferralButton: user.showReferralButton,
        referralCode: user.referralCode,
        storeUrl,
        referralUrl,
      },
    });
  } catch (error) {
    console.error('[bio GET] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
