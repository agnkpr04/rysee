import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAdminSession } from '@/lib/admin-session';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session response (simple cookie-based session)
    const response = NextResponse.json({ 
      success: true, 
      admin: { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role 
      } 
    });

    // Set admin session cookie + HMAC signature (verified by middleware)
    const cookieOpts = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    };
    response.cookies.set('admin_session', admin.id, { ...cookieOpts, httpOnly: false });
    response.cookies.set('admin_sig', await signAdminSession(admin.id), { ...cookieOpts, httpOnly: true });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
