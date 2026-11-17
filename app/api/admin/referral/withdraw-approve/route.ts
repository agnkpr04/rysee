import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';
import { sendWithdrawalStatusNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { withdrawRequestId } = await request.json();
    
    if (!withdrawRequestId) {
      return NextResponse.json({ error: 'Withdraw request ID is required' }, { status: 400 });
    }

    // Check admin session
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get withdraw request
    const withdrawRequest = await prisma.withdrawRequest.findUnique({
      where: { id: withdrawRequestId },
      include: {
        user: true
      }
    });

    if (!withdrawRequest) {
      return NextResponse.json({ error: 'Withdraw request not found' }, { status: 404 });
    }

    if (withdrawRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Withdraw request is not pending' }, { status: 400 });
    }

    // Update withdraw request status
    const updatedWithdrawRequest = await prisma.withdrawRequest.update({
      where: { id: withdrawRequestId },
      data: {
        status: 'approved',
        approvedAt: new Date()
      }
    });

    // Update referral earnings status to paid
    // Find the referral earnings for this user and mark them as paid
    const userReferrals = await prisma.referral.findMany({
      where: { referrerId: withdrawRequest.userId },
      include: { earnings: true }
    });

    const totalPendingReferralEarnings = userReferrals
      .flatMap(r => r.earnings)
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);

    // Mark referral earnings as paid first
    let remainingToMark = withdrawRequest.amount;

    for (const referral of userReferrals) {
      for (const earning of referral.earnings) {
        if (earning.status === 'pending' && remainingToMark > 0) {
          const amountToMark = Math.min(earning.amount, remainingToMark);
          await prisma.referralEarning.update({
            where: { id: earning.id },
            data: {
              status: 'paid',
              paidAt: new Date()
            }
          });
          remainingToMark -= amountToMark;
        }
      }
    }

    // If withdrawal amount exceeds pending referral earnings, deduct from template earnings
    if (remainingToMark > 0) {
      const user = await prisma.user.findUnique({
        where: { id: withdrawRequest.userId },
        select: { template_earnings: true }
      });

      if (user && user.template_earnings && user.template_earnings > 0) {
        const amountToDeduct = Math.min(remainingToMark, user.template_earnings);
        await prisma.user.update({
          where: { id: withdrawRequest.userId },
          data: {
            template_earnings: user.template_earnings - amountToDeduct
          }
        });
      }
    }

    // Send status notification to user (non-blocking)
    try {
      if (withdrawRequest.user) {
        await sendWithdrawalStatusNotification(
          withdrawRequest.user.email || '',
          withdrawRequest.user.name || '',
          withdrawRequest.amount,
          'approved',
          withdrawRequest.bankName,
          withdrawRequest.accountNumber,
          withdrawRequest.accountName
        );
      }
    } catch (emailError) {
      console.error('Failed to send withdraw approval email:', emailError);
    }

    return NextResponse.json({ withdrawRequest: updatedWithdrawRequest });
  } catch (error) {
    console.error('Approve withdraw error:', error);
    return NextResponse.json({ error: 'Failed to approve withdraw request' }, { status: 500 });
  }
}
