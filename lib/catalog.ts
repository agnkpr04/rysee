import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const CATALOG_TAG = 'catalog';
export const CATALOG_REVALIDATE = 60;

export const getActiveTemplates = unstable_cache(
  async (category?: string | null) => {
    const where: { status: string; category?: string } = { status: 'active' };
    if (category) where.category = category;

    return prisma.masterTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },
  ['catalog-templates'],
  { revalidate: CATALOG_REVALIDATE, tags: [CATALOG_TAG] }
);

// Excludes downloadUrl — not needed for listing/detail modal display
const digitalProductSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  originalPrice: true,
  badge: true,
  thumbnail: true,
  previewUrl: true,
  previewImages: true,
  category: true,
  subCategory: true,
  productType: true,
  contentCategory: true,
  features: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const getDigitalProducts = unstable_cache(
  async (category?: string | null) => {
    const where = category ? { category } : {};

    return prisma.masterDigitalProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: digitalProductSelect,
    });
  },
  ['catalog-digital-products'],
  { revalidate: CATALOG_REVALIDATE, tags: [CATALOG_TAG] }
);
