import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

// Extract the raw admin_session cookie value (works for NextRequest and plain Request)
export function getAdminSessionId(request: NextRequest | Request): string | null {
  const viaCookies = (request as NextRequest).cookies?.get?.('admin_session')?.value;
  if (viaCookies) return viaCookies;

  const header = request.headers.get('cookie');
  return header?.split('; ').find((r) => r.startsWith('admin_session='))?.split('=')[1] || null;
}

// Verify the session maps to a real admin row — a fake cookie value will never match
export async function getAdminId(request: NextRequest | Request): Promise<string | null> {
  const sessionId = getAdminSessionId(request);
  if (!sessionId) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });

  return admin?.id ?? null;
}

export async function isAdminRequest(request: NextRequest | Request): Promise<boolean> {
  return (await getAdminId(request)) !== null;
}
