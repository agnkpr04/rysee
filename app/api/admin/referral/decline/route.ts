import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: sessionCookie.value },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const referralId = params.id;

    // Get referral details
    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        referred: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    if (referral.status === 'completed') {
      return NextResponse.json({ error: 'Cannot decline completed referral' }, { status: 400 });
    }

    // Delete the referral record
    await prisma.referral.delete({
      where: { id: referralId }
    });

    // Clear the referredBy field from the user
    await prisma.user.update({
      where: { id: referral.referredId },
      data: { referredBy: null }
    });

    console.log('[Referral Decline] Referral declined:', {
      referralId: referral.id,
      referredId: referral.referredId
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Referral declined and removed' 
    });
  } catch (error) {
    console.error('Decline referral error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
