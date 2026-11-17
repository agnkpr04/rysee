import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getSessionFromRequest } from '@/lib/auth';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const ALLOWED_FONTS = ['Poppins', 'Great Vibes'];
const ALLOWED_GRADIENT_FRAMES = ['none', 'shopee', 'tiktok', 'purple', 'blue', 'green', 'crimson'];
const ALLOWED_PROFILE_FRAMES = ['none', 'pro', 'elite', 'elite-yellow', 'elite-orange', 'elite-pink'];

function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

function sanitizeString(str: string, maxLength: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication check
    const session = await getSessionFromRequest(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, storeName, storeDescription, storeTheme } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Authorization: only owner can update their store
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'You can only update your own store' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        storeName: storeName || undefined,
        storeDescription: storeDescription || undefined,
        storeTheme: storeTheme || undefined,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Authentication check
    const session = await getSessionFromRequest(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, themeColor, textColor, accentColor, iconColor, storeName, storeDescription, fontName, fontDescription, fontBody, gradientFrame, frameThickness, profileFrameType } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Authorization: only owner can update their store
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'You can only update your own store' }, { status: 403 });
    }

    // Input validation: HEX colors
    const colorFields = { themeColor, textColor, accentColor, iconColor };
    for (const [key, value] of Object.entries(colorFields)) {
      if (value && !isValidHexColor(value as string)) {
        return NextResponse.json({ error: `Invalid color format for ${key}. Use HEX format (e.g. #FF5733)` }, { status: 400 });
      }
    }

    // Input validation: fonts
    const fontFields = { fontName, fontDescription, fontBody };
    for (const [key, value] of Object.entries(fontFields)) {
      if (value && !ALLOWED_FONTS.includes(value as string)) {
        return NextResponse.json({ error: `Invalid font: ${value}. Allowed: ${ALLOWED_FONTS.join(', ')}` }, { status: 400 });
      }
    }

    // Input validation: gradient frame
    if (gradientFrame && !ALLOWED_GRADIENT_FRAMES.includes(gradientFrame)) {
      return NextResponse.json({ error: `Invalid gradient frame: ${gradientFrame}` }, { status: 400 });
    }

    // Input validation: profile frame
    if (profileFrameType && !ALLOWED_PROFILE_FRAMES.includes(profileFrameType)) {
      return NextResponse.json({ error: `Invalid profile frame: ${profileFrameType}` }, { status: 400 });
    }

    // Input validation: frame thickness
    if (frameThickness !== undefined && (typeof frameThickness !== 'number' || frameThickness < 1 || frameThickness > 10)) {
      return NextResponse.json({ error: 'Frame thickness must be between 1 and 10' }, { status: 400 });
    }

    // Get current user data to preserve existing storeTheme + check tier
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Tier-based enforcement - check subscription table for plan
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    const userPlan = (subscription?.status === 'active' ? subscription.plan : 'free') || 'free';
    const isPaidPlan = userPlan === 'premium';
    const isPremium = userPlan === 'premium';
    console.log('[store-settings] User plan:', userPlan, 'isPaidPlan:', isPaidPlan, 'isPremium:', isPremium);

    // Merge existing storeTheme with new values (tier-enforced)
    const currentTheme = currentUser.storeTheme as any || {};
    const newTheme: Prisma.JsonValue = { ...currentTheme };

    // All tiers: storeName & storeDescription allowed
    const sanitizedStoreName = storeName !== undefined ? sanitizeString(storeName, 100) : undefined;
    const sanitizedStoreDescription = storeDescription !== undefined ? sanitizeString(storeDescription, 500) : undefined;

    // Pro & Premium: colors, fonts
    if (isPaidPlan) {
      if (themeColor) (newTheme as any).primaryColor = themeColor;
      if (textColor) (newTheme as any).textColor = textColor;
      if (accentColor) (newTheme as any).accentColor = accentColor;
      if (iconColor) (newTheme as any).iconColor = iconColor;
      if (fontName) (newTheme as any).fontName = fontName;
      if (fontDescription) (newTheme as any).fontDescription = fontDescription;
      if (fontBody) (newTheme as any).fontBody = fontBody;
    }

    // Premium only: gradient frames, profile frames
    if (isPremium) {
      if (gradientFrame) (newTheme as any).gradientFrame = gradientFrame;
      if (profileFrameType) (newTheme as any).profileFrameType = profileFrameType;
      if (frameThickness !== undefined) (newTheme as any).frameThickness = frameThickness;
    }

    try {
      const updateData: any = {};
      if (sanitizedStoreName !== undefined) updateData.storeName = sanitizedStoreName;
      if (sanitizedStoreDescription !== undefined) updateData.storeDescription = sanitizedStoreDescription;

      // Only update theme if user has paid plan and there are theme changes
      if (isPaidPlan) {
        const hasThemeChanges =
          themeColor !== undefined ||
          textColor !== undefined ||
          accentColor !== undefined ||
          iconColor !== undefined ||
          fontName !== undefined ||
          fontDescription !== undefined ||
          fontBody !== undefined ||
          (isPremium && (gradientFrame !== undefined || frameThickness !== undefined || profileFrameType !== undefined));
        if (hasThemeChanges) {
          updateData.storeTheme = newTheme;
          console.log('[store-settings] Updating storeTheme:', newTheme);
        }
      }

      console.log('[store-settings] Update data:', updateData);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      console.log('[store-settings] Updated user storeTheme:', updatedUser.storeTheme);
      return NextResponse.json({ user: updatedUser });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error updating store settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
