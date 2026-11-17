import crypto from 'crypto';

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateAffiliateLink(masterTemplateId: string, userId: string): string {
  return `/templates/${masterTemplateId}?ref=${userId}`;
}

export function calculateCommission(price: number, rate: number): number {
  return Math.floor(price * rate);
}

export function generateDownloadUrl(orderId: string, token: string): string {
  return `/api/template-order/download/${orderId}?token=${token}`;
}

export function isDownloadExpired(expireAt: Date | null): boolean {
  if (!expireAt) return true;
  return new Date() > expireAt;
}

export function isDownloadLimitExceeded(downloadCount: number, maxDownloads: number = 3): boolean {
  return downloadCount >= maxDownloads;
}
