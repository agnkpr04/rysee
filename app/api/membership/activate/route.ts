import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST activate subscription
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

    const { userId, plan, duration } = await request.json();

    if (!userId || !plan || !duration) {
      return NextResponse.json({ error: 'userId, plan, and duration are required' }, { status: 400 });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        status: 'active',
        plan,
        startDate,
        endDate,
      },
      create: {
        userId,
        status: 'active',
        plan,
        startDate,
        endDate,
      },
    });

    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (error) {
    console.error('Activate subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
