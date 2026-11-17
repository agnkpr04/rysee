import TemplatesClient from './TemplatesClient';
import { getActiveTemplates } from '@/lib/catalog';
import { MasterTemplate } from '@/lib/templates/types';

export const revalidate = 60;

export const metadata = {
  title: 'Rysee | Template Website',
  description: 'Koleksi template website profesional siap jual untuk affiliate Rysee.',
};

export default async function TemplatesPage() {
  const templates = await getActiveTemplates().catch((err) => {
    console.error('Failed to load templates:', err);
    return [];
  });

  return <TemplatesClient initialTemplates={templates as unknown as MasterTemplate[]} />;
}
