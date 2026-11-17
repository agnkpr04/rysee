// HMAC-signed admin session cookie helpers.
// Uses Web Crypto so it works in both Edge middleware and Node.js runtimes.

const enc = new TextEncoder();

async function hmacHex(message: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function signAdminSession(adminId: string): Promise<string> {
  return hmacHex(adminId);
}

// A forged admin_session cookie fails here because the signature won't match
export async function isValidAdminSession(
  adminId: string | undefined,
  signature: string | undefined
): Promise<boolean> {
  if (!adminId || !signature || !process.env.ADMIN_SESSION_SECRET) return false;
  return (await hmacHex(adminId)) === signature;
}
