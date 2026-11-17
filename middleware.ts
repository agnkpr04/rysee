import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidAdminSession } from '@/lib/admin-session';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const signature = request.cookies.get('admin_sig')?.value;
  const hasValidSession = session ? await isValidAdminSession(session, signature) : false;

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminArea = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardArea = request.nextUrl.pathname.startsWith('/dashboard');

  // Protect dashboard routes
  if (!hasValidSession && isDashboardArea) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Protect admin routes (except login page)
  if (!hasValidSession && isAdminArea && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (hasValidSession && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
