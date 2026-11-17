import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

// GET all subscriptions
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

    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();

    // Batch fetch user data from Supabase - get unique user IDs first
    const uniqueUserIds = [...new Set(subscriptions.map(sub => sub.userId))];
    
    // Fetch all users in parallel
    const usersMap = new Map();
    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const { data: { user } } = await supabase.auth.admin.getUserById(userId);
          if (user) {
            usersMap.set(userId, {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || null,
            });
          }
        } catch (err) {
          console.error(`Failed to fetch user ${userId}:`, err);
        }
      })
    );

    // Map users to subscriptions and calculate actual status
    const subscriptionsWithUsers = subscriptions.map(sub => {
      const isExpired = sub.endDate && new Date(sub.endDate) < now;
      const actualStatus = isExpired ? 'expired' : sub.status;
      
      return {
        ...sub,
        status: actualStatus,
        user: usersMap.get(sub.userId) || null,
      };
    });

    return NextResponse.json({ subscriptions: subscriptionsWithUsers });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
