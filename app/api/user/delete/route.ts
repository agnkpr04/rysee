import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete related data in correct order due to foreign key constraints
    // 1. Delete click tracking
    await prisma.clickTracking.deleteMany({
      where: { userId },
    });

    // 2. Delete store visit tracking
    await prisma.storeVisitTracking.deleteMany({
      where: { userId },
    });

    // 3. Delete user products
    await prisma.userProduct.deleteMany({
      where: { userId },
    });

    // 4. Delete payments
    await prisma.payment.deleteMany({
      where: { userId },
    });

    // 5. Delete subscription
    await prisma.subscription.deleteMany({
      where: { userId },
    });

    // 6. Delete user from database
    await prisma.user.deleteMany({
      where: { id: userId },
    });

    // 7. Delete user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting Supabase user:', deleteError);
      // Continue even if Supabase deletion fails, as database data is already deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
