"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Lock, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const WHATSAPP_PUBLIC_LINK = "https://chat.whatsapp.com/LUABEZndu8w0hOMTf7iLvp?mode=gi_t";
const WHATSAPP_PRIVATE_LINK = "https://chat.whatsapp.com/KcDZOO592FK1SIkXOyWVj6?mode=gi_t";

export default function CommunitySection() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const res = await fetch('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session?.access_token || ''}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setIsPremium(data.isPremium || false);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
          setIsPremium(false);
        }
      }
    };

    getSession();
  }, []);

  const handlePrivateGroupClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!isPremium) {
      router.push('/#pricing');
      return;
    }

    window.open(WHATSAPP_PRIVATE_LINK, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-[#18181B] mb-4">
            Bergabung dengan Komunitas Kami
          </h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Dapatkan tips, dukungan, dan networking dengan affiliate lainnya di WhatsApp
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Public Group Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#25D366]/10 rounded-xl">
                <MessageCircle className="w-6 h-6 text-[#25D366]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#18181B]">Grup WhatsApp</h3>
                <p className="text-xs text-[#A1A1AA]">Terbuka untuk semua</p>
              </div>
            </div>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Bergabung dengan komunitas untuk diskusi, Q&A, dan berbagi pengalaman. Cocok untuk yang baru mulai.
            </p>
            <a
              href={WHATSAPP_PUBLIC_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition font-medium"
            >
              Join Grup WhatsApp
            </a>
          </div>

          {/* Private Group Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl">
                <Lock className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#18181B]">Grup Private (Premium)</h3>
                <p className="text-xs text-[#A1A1AA]">Khusus Premium member</p>
              </div>
            </div>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Tips advanced, networking eksklusif, dan support prioritas. Upgrade ke Premium untuk akses.
            </p>
            <button
              onClick={handlePrivateGroupClick}
              disabled={!isPremium}
              className={`block w-full text-center px-6 py-3 rounded-xl transition font-medium ${
                isPremium
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPremium ? 'Join Grup Private' : 'Upgrade untuk Akses'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
