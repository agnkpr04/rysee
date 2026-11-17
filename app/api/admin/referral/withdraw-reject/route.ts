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
      where: { id: withdrawRequestId }
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
      data: { status: 'rejected' }
    });

    // Send status notification to user (non-blocking)
    try {
      const user = await prisma.user.findUnique({
        where: { id: withdrawRequest.userId },
        select: { email: true, name: true }
      });
      if (user) {
        await sendWithdrawalStatusNotification(
          user.email || '',
          user.name || '',
          withdrawRequest.amount,
          'rejected',
          withdrawRequest.bankName,
          withdrawRequest.accountNumber,
          withdrawRequest.accountName
        );
      }
    } catch (emailError) {
      console.error('Failed to send withdraw rejection email:', emailError);
    }

    return NextResponse.json({ withdrawRequest: updatedWithdrawRequest });
  } catch (error) {
    console.error('Reject withdraw error:', error);
    return NextResponse.json({ error: 'Failed to reject withdraw request' }, { status: 500 });
  }
}
