import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all referrals with details
    const referrals = await prisma.referral.findMany({
      include: {
        referrer: {
          select: {
            id: true,
            email: true,
            name: true,
            earnings: true
          }
        },
        referred: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        earnings: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get all withdraw requests
    const withdrawRequests = await prisma.withdrawRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate summary stats
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    const totalEarnings = referrals
      .flatMap(r => r.earnings)
      .reduce((sum, e) => sum + e.amount, 0);
    const paidEarnings = referrals
      .flatMap(r => r.earnings)
      .filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + e.amount, 0);
    const pendingEarnings = referrals
      .flatMap(r => r.earnings)
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      referrals,
      withdrawRequests,
      summary: {
        totalReferrals,
        completedReferrals,
        totalEarnings,
        paidEarnings,
        pendingEarnings
      }
    });
  } catch (error) {
    console.error('Get referral list error:', error);
    return NextResponse.json({ error: 'Failed to get referral list' }, { status: 500 });
  }
}
