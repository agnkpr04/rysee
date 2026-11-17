import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all payments
export async function GET(request: NextRequest) {
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

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Fetch user data from Prisma User table
    const uniqueUserIds = [...new Set(payments.map(payment => payment.userId))];
    
    const usersMap = new Map();
    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
          });
          if (user) {
            usersMap.set(userId, user);
          }
        } catch (err) {
          console.error(`Failed to fetch user ${userId}:`, err);
        }
      })
    );

    // Map users to payments
    const paymentsWithUsers = payments.map(payment => ({
      ...payment,
      user: usersMap.get(payment.userId) || null,
    }));

    return NextResponse.json({ payments: paymentsWithUsers });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create payment
export async function POST(request: NextRequest) {
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

    const { userId, amount, method, description } = await request.json();

    if (!userId || !amount || !method) {
      return NextResponse.json({ error: 'userId, amount, and method are required' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        method,
        status: 'success',
        description,
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
