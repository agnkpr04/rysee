"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, FileText, Lock, Crown, Download, Copy, Check, Sparkles, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface ContentAsset {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  googleDriveLink: string | null;
}

interface Copywriting {
  id: string;
  title: string;
  content: string;
  category: string | null;
}

interface Caption {
  id: string;
  title: string | null;
  content: string;
  category: string;
}

interface KontenKitSectionProps {
  isPremium: boolean;
  isPaid: boolean;
}

export default function KontenKitSection({ isPremium, isPaid }: KontenKitSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'assets' | 'copywriting' | 'caption'>('assets');
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [activeCaptionCategory, setActiveCaptionCategory] = useState<string>('referral');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch copywriting (available for all)
        const copyRes = await fetch('/api/copywriting');
        if (copyRes.ok) {
          const data = await copyRes.json();
          setCopywritings(data.copywriting || []);
        }

        // Fetch content assets (only for paid users)
        if (isPaid) {
          const assetsRes = await fetch('/api/content-assets');
          if (assetsRes.ok) {
            const data = await assetsRes.json();
            setContentAssets(data.assets || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch konten kit data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isPaid]);

  useEffect(() => {
    if (activeTab === 'caption') {
      const fetchCaptions = async () => {
        try {
          const res = await fetch(`/api/caption?category=${activeCaptionCategory}`);
          if (res.ok) {
            const data = await res.json();
            setCaptions(data.captions || []);
          }
        } catch (err) {
          console.error('Failed to fetch captions:', err);
        }
      };

      fetchCaptions();
    }
  }, [activeTab, activeCaptionCategory]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenGoogleDrive = (googleDriveLink: string) => {
    window.open(googleDriveLink, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-6 py-4 sm:py-6">
      {/* Panduan Produk Digital CTA */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 rounded-xl p-4 border border-[#8B5CF6]/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#18181B] mb-1">Panduan Jualan Produk Digital</h3>
              <p className="text-xs text-[#71717A] mb-2 line-clamp-2">
                Pelajari strategi dan tips jualan produk digital di platform Rysee.
              </p>
              <button
                onClick={() => {
                  if (isPaid) {
                    router.push(`/panduan-produk-digital?referrer=${encodeURIComponent(window.location.href)}`);
                  } else {
                    router.push('/#pricing');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-xs font-medium hover:opacity-90 transition-all"
              >
                {isPaid ? 'Baca Panduan' : 'Upgrade untuk Akses'}
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-light text-[#18181B] mb-2">Konten Kit</h2>
        <p className="text-sm text-[#A1A1AA]">Mentahan konten siap download, Hook dan Caption siap Copy</p>
      </div>

      {/* Tabs - Mobile: scrollable horizontal, Desktop: centered */}
      <div className="flex sm:justify-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <div className="bg-white rounded-full p-1 border border-gray-50 shadow-sm inline-flex min-w-max sm:min-w-0">
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'assets'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            <Package className="w-4 h-4" strokeWidth={1.5} />
            Mentahan
          </button>
          <button
            onClick={() => setActiveTab('copywriting')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'copywriting'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            Hook
          </button>
          <button
            onClick={() => setActiveTab('caption')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'caption'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
            Caption
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'assets' && (
        !isPaid ? (
          <div className="max-w-sm mx-auto text-center py-12 px-4">
            <div className="w-14 h-14 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" strokeWidth={1.5} />
              <span className="text-xs font-medium text-[#8B5CF6]">PRO & PREMIUM</span>
            </div>
            <h3 className="text-lg font-medium text-[#18181B] mb-2">Mentahan</h3>
            <p className="text-sm text-[#A1A1AA] mb-4">
              Upgrade ke Pro atau Premium untuk mengakses ratusan konten assets siap pakai.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
            >
              <Crown className="w-4 h-4" strokeWidth={1.5} />
              Upgrade Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-gray-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {asset.thumbnail && (
                  <div className="aspect-video bg-[#F9F9FB] overflow-hidden">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-base font-medium text-[#18181B] line-clamp-2">{asset.title}</h3>
                    {asset.googleDriveLink && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 text-[#8B5CF6] font-medium whitespace-nowrap">
                        Google Drive
                      </span>
                    )}
                  </div>
                  {asset.description && (
                    <p className="text-xs text-[#A1A1AA] mb-3 line-clamp-2">{asset.description}</p>
                  )}
                  {asset.googleDriveLink && (
                    <button
                      onClick={() => handleOpenGoogleDrive(asset.googleDriveLink!)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#18181B] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-black transition-all"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                      Buka di Google Drive
                    </button>
                  )}
                </div>
              </div>
            ))}
            {contentAssets.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[#A1A1AA]">Belum ada mentahan tersedia</p>
              </div>
            )}
          </div>
        )
      )}

      {activeTab === 'caption' && (
        <div className="space-y-4">
          {/* Category Selector - Mobile: scrollable horizontal */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { value: 'referral', label: 'Referral' },
              { value: 'komisi-digital', label: 'Produk Digital' },
              { value: 'referral-komisi', label: 'Referral & Produk' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCaptionCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeCaptionCategory === cat.value
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow-sm'
                    : 'bg-white border border-gray-100 text-[#A1A1AA] hover:text-[#18181B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Caption List */}
          <div className="space-y-3">
            {captions.map((caption) => (
              <div
                key={caption.id}
                className="bg-white rounded-xl border border-gray-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    {caption.title && (
                      <h3 className="text-base font-medium text-[#18181B] mb-1 line-clamp-2">{caption.title}</h3>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(caption.content, caption.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#F9F9FB] hover:bg-gray-50 rounded-lg text-xs sm:text-sm font-medium text-[#18181B] transition-all whitespace-nowrap"
                  >
                    {copiedId === caption.id ? (
                      <><Check className="w-4 h-4 text-green-500" strokeWidth={1.5} />Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" strokeWidth={1.5} />Copy</>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] whitespace-pre-wrap break-words">{caption.content}</p>
              </div>
            ))}
            {captions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[#A1A1AA]">Belum ada caption tersedia untuk kategori ini</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'copywriting' && (
        <div className="space-y-3">
          {copywritings.map((copy) => (
            <div
              key={copy.id}
              className="bg-white rounded-xl border border-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  {copy.category && (
                    <span className="text-xs font-medium text-[#8B5CF6] uppercase tracking-wider">
                      {copy.category}
                    </span>
                  )}
                  <h3 className="text-base font-medium text-[#18181B] mt-1 line-clamp-2">{copy.title}</h3>
                </div>
                <button
                  onClick={() => handleCopy(copy.content, copy.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#F9F9FB] hover:bg-gray-50 rounded-lg text-xs sm:text-sm font-medium text-[#18181B] transition-all whitespace-nowrap"
                >
                  {copiedId === copy.id ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" strokeWidth={1.5} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#A1A1AA] whitespace-pre-wrap break-words">{copy.content}</p>
            </div>
          ))}
          {copywritings.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-[#A1A1AA] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-[#A1A1AA]">Belum ada copywriting tersedia</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
