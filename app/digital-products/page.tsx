import DigitalProductsClient from './DigitalProductsClient';
import { getDigitalProducts } from '@/lib/catalog';

export const revalidate = 60;

export const metadata = {
  title: 'Rysee | Produk Digital',
  description: 'Koleksi produk digital siap jual — Notion, Canva, E-books, dan lainnya untuk affiliate Rysee.',
};

export default async function DigitalProductsPage() {
  const products = await getDigitalProducts().catch((err) => {
    console.error('Failed to load digital products:', err);
    return [];
  });

  return <DigitalProductsClient initialProducts={products} />;
}
