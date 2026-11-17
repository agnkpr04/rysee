import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Delete admin session cookies
  response.cookies.delete('admin_session');
  response.cookies.delete('admin_sig');

  return response;
}
