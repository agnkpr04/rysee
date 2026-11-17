'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MasterTemplate } from '@/lib/templates/types';
import { supabase } from '@/lib/supabase';
import GlobalNavbar from '@/components/GlobalNavbar';
import { CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react';

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [template, setTemplate] = useState<MasterTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userTemplates, setUserTemplates] = useState<any[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    fetchTemplate();
    fetchUserTemplates();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${id}`);
      const data = await response.json();
      setTemplate(data.template);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTemplates = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const response = await fetch('/api/user-templates', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserTemplates(data.userTemplates || []);
          const templateIds = new Set(data.userTemplates?.map((ut: any) => ut.masterTemplateId) || []);
          setIsAdded(templateIds.has(id));
        }
      }
    } catch (error) {
      console.error('Error fetching user templates:', error);
    }
  };

  const handlePurchase = async () => {
    if (!template) return;

    // Prompt for payment proof URL (manual transfer)
    const paymentProof = prompt('Masukkan link bukti pembayaran (screenshot transfer bank):');

    if (!paymentProof) {
      alert('Bukti pembayaran diperlukan untuk melanjutkan pembelian.');
      return;
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const affiliateId = searchParams.get('ref');

      // For now, we need to get or create a UserTemplate for the purchase
      // In production, this should come from the affiliate's store
      let userTemplateId: string | null = null;

      if (affiliateId) {
        // Try to find UserTemplate for this affiliate
        const userTemplateResponse = await fetch(`/api/user-templates?affiliateId=${affiliateId}&masterTemplateId=${template.id}`);
        if (userTemplateResponse.ok) {
          const userData = await userTemplateResponse.json();
          if (userData.userTemplates && userData.userTemplates.length > 0) {
            userTemplateId = userData.userTemplates[0].id;
          }
        }
      }

      if (!userTemplateId) {
        // Create a default UserTemplate for the current user (platform sale)
        const createResponse = await fetch('/api/user-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            masterTemplateId: template.id,
          }),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          userTemplateId = createData.userTemplate.id;
        } else {
          alert('Failed to prepare purchase');
          return;
        }
      }

      const response = await fetch('/api/template-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTemplateId,
          affiliateId,
          paymentProof,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order berhasil dibuat! Admin akan memverifikasi pembayaran Anda dalam 1x24 jam.');
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to create order');
    }
  };

  const handleAddToStore = async () => {
    if (!template) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/user-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          masterTemplateId: template.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Template added to your store! Affiliate link: ' + data.userTemplate.affiliateLink);
        // Refresh user templates to update isAdded status
        await fetchUserTemplates();
      } else {
        alert(data.error || 'Failed to add template to store');
      }
    } catch (error) {
      console.error('Add to store error:', error);
      alert('Failed to add template to store');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading template...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Template not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <GlobalNavbar isSticky={true} />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#8B5CF6] hover:text-[#7C3AED] mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Image
              src={template.thumbnail}
              alt={template.title}
              width={900}
              height={506}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-light text-[#18181B]">{template.title}</h1>
              {isAdded && (
                <div className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Added to Store
                </div>
              )}
            </div>
            {template.description && (
              <p className="text-[#A1A1AA] mb-6 font-light">{template.description}</p>
            )}
            <div className="mb-4">
              <span className="text-4xl font-light text-[#8B5CF6]">
                Rp {template.price.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#18181B]">Features</h2>
              <ul className="list-disc list-inside space-y-2 text-[#A1A1AA]">
                {template.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {template.previewUrl && (
                <a
                  href={template.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#8B5CF6] py-3 px-6 rounded-lg hover:bg-[#F9F9FB] transition-all font-medium border border-[#8B5CF6]"
                >
                  <ExternalLink className="w-4 h-4" /> Live Preview
                </a>
              )}
              {!isAdded ? (
                <button
                  onClick={handleAddToStore}
                  className="w-full bg-[#F9F9FB] text-[#18181B] py-3 px-6 rounded-lg hover:bg-[#F0F0F2] transition-all font-medium border border-gray-200"
                >
                  Add to My Store
                </button>
              ) : (
                <div className="w-full bg-[#F9F9FB] text-[#A1A1AA] py-3 px-6 rounded-lg border border-gray-200 text-center text-sm font-light">
                  Template already in your store
                </div>
              )}
            </div>
            {ref && (
              <div className="mt-4 p-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-lg border border-[#8B5CF6]/20">
                <p className="text-sm text-[#8B5CF6] font-medium">
                  Referred by user: {ref}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
