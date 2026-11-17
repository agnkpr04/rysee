import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Check if user already has referral code
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true }
    });

    if (existingUser?.referralCode) {
      return NextResponse.json({ referralCode: existingUser.referralCode });
    }

    // Generate referral code (8 characters from user ID)
    const referralCode = userId.substring(0, 8).toUpperCase();

    // Update user with referral code
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode }
    });

    return NextResponse.json({ referralCode });
  } catch (error) {
    console.error('Generate referral code error:', error);
    return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 });
  }
}
