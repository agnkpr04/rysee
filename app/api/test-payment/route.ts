import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[Test Payment] Endpoint reached');
  return NextResponse.json({
    success: true,
    message: 'Test payment endpoint is working',
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  console.log('[Test Payment] GET endpoint reached');
  return NextResponse.json({
    success: true,
    message: 'Test payment GET endpoint is working',
    timestamp: new Date().toISOString(),
  });
}
