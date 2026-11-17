import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { sendWithdrawalRequestNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { amount, bankName, accountNumber, accountName } = await request.json();
    
    if (!amount || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // Check if user has enough pending earnings
    const userWithEarnings = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        earnings: true,
        template_earnings: true,
        digital_product_earnings: true,
        referrals: {
          include: {
            earnings: true
          }
        }
      }
    });

    if (!userWithEarnings) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate pending referral earnings
    const pendingReferralEarnings = userWithEarnings.referrals
      .flatMap((r: any) => r.earnings)
      .filter((e: any) => e.status === 'pending')
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    // Template earnings (commission)
    const templateEarnings = userWithEarnings.template_earnings || 0;

    // Digital product earnings (commission)
    const digitalProductEarnings = userWithEarnings.digital_product_earnings || 0;

    // Get pending withdrawal requests for this user
    const pendingWithdrawals = await prisma.withdrawRequest.findMany({
      where: {
        userId,
        status: 'pending'
      }
    });

    const totalPendingWithdrawals = pendingWithdrawals.reduce((sum: number, w: any) => sum + w.amount, 0);

    // Calculate available balance (pending referral earnings + template earnings + digital product earnings - pending withdrawals)
    const availableBalance = (pendingReferralEarnings + templateEarnings + digitalProductEarnings) - totalPendingWithdrawals;

    if (availableBalance < amount) {
      return NextResponse.json({ error: 'Saldo tidak cukup. Saldo tersedia: Rp ' + availableBalance.toLocaleString('id-ID') }, { status: 400 });
    }

    // Create withdraw request
    const withdrawRequest = await prisma.withdrawRequest.create({
      data: {
        userId,
        amount,
        bankName,
        accountNumber,
        accountName,
        status: 'pending'
      }
    });

    // Save payment method to user profile for auto-fill next time
    await prisma.user.update({
      where: { id: userId },
      data: {
        withdrawBankName: bankName,
        withdrawAccountNumber: accountNumber,
        withdrawAccountName: accountName,
      }
    });

    // Get user details for email notification
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    // Send email notification to admin
    if (userData) {
      await sendWithdrawalRequestNotification(
        userData.email || 'Unknown',
        userData.name || 'Unknown',
        amount,
        bankName,
        accountNumber,
        accountName
      );
    }

    return NextResponse.json({ withdrawRequest });
  } catch (error) {
    console.error('Withdraw request error:', error);
    return NextResponse.json({ error: 'Failed to create withdraw request' }, { status: 500 });
  }
}
