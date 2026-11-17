export function validateTemplatePrice(price: number): boolean {
  return price >= 0 && price <= 10000000; // Max Rp 10M
}

export function validateTemplateTitle(title: string): boolean {
  return title.length >= 3 && title.length <= 200;
}

export function validateTemplateCategory(category: string): boolean {
  const validCategories = ['landing-page', 'portfolio', 'ecommerce', 'blog', 'business', 'other'];
  return validCategories.includes(category);
}

export function validateTemplateFeatures(features: string[]): boolean {
  return Array.isArray(features) && features.length >= 1 && features.length <= 20;
}

export function validateTemplateStatus(status: string): boolean {
  return ['active', 'inactive'].includes(status);
}

export function validateOrderStatus(status: string): boolean {
  return ['pending', 'pending_verification', 'pending_payment', 'verified', 'completed', 'cancelled', 'declined'].includes(status);
}

export function validateAffiliateLink(link: string): boolean {
  return link.startsWith('/templates/') && link.includes('?ref=');
}
