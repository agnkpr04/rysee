import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Client-side auth functions - no next/headers dependency
export async function getSession() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Server-side auth function that reads Authorization header
export async function getSessionFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Authorization header or invalid format');
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Error validating token:', error);
      return null;
    }

    if (!user) {
      console.log('No user found for token');
      return null;
    }

    // Construct a session-like object from the user
    return {
      user: user,
      access_token: token,
    };
  } catch (error) {
    console.error('Error getting session from request:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

// Client-side auth helper for components
export async function getUserFromSession() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
}
