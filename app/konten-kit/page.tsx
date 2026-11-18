"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Package, FileText, Lock, Crown, Download, Copy, Check, ArrowLeft, ArrowRight, Sparkles, MessageSquare, BookOpen } from 'lucide-react';
import GlobalNavbar from '@/components/GlobalNavbar';
import Link from 'next/link';

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

export default function KontenKitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assets' | 'copywriting' | 'caption'>('assets');
  const [contentType, setContentType] = useState<'referral' | 'produk'>('referral');
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [activeCaptionCategory, setActiveCaptionCategory] = useState<string>('referral');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
            setIsPaid(data.isPaid || false);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
            setIsPaid(data.isPaid || false);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCopywritings();
      if (isPaid) {
        fetchContentAssets();
      }
    }
  }, [user, isPaid]);

  useEffect(() => {
    if (user && activeTab === 'caption') {
      fetchCaptions(activeCaptionCategory);
    }
  }, [user, activeTab, activeCaptionCategory]);

  const fetchContentAssets = async () => {
    try {
      const res = await fetch('/api/content-assets');
      if (res.ok) {
        const data = await res.json();
        setContentAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Failed to fetch content assets:', err);
    }
  };

  const fetchCopywritings = async () => {
    try {
      const res = await fetch('/api/copywriting');
      if (res.ok) {
        const data = await res.json();
        setCopywritings(data.copywriting || []);
      }
    } catch (err) {
      console.error('Failed to fetch copywriting:', err);
    }
  };

  const fetchCaptions = async (category: string) => {
    try {
      const res = await fetch(`/api/caption?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setCaptions(data.captions || []);
      }
    } catch (err) {
      console.error('Failed to fetch captions:', err);
    }
  };

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
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F9FB]">
        <GlobalNavbar />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="bg-white rounded-2xl border border-gray-50 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-light text-[#18181B] mb-4">Konten Kit</h1>
            <p className="text-[#A1A1AA] mb-8 max-w-md mx-auto">
              Silakan login untuk mengakses Konten Kit.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <GlobalNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#18181B] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Kembali
        </button>

        {/* Lock Screen for Non-Premium Users */}
        {!isPaid ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full mb-4">
              <Crown className="w-4 h-4 text-[#8B5CF6]" strokeWidth={1.5} />
              <span className="text-xs font-medium text-[#8B5CF6]">PREMIUM ONLY</span>
            </div>
            <h2 className="text-2xl font-medium text-[#18181B] mb-3">Konten Kit Eksklusif</h2>
            <p className="text-sm text-[#A1A1AA] mb-6 leading-relaxed">
              Akses mentahan konten, hook, dan caption siap pakai untuk referral. Upgrade ke Premium untuk membuka semua fitur.
            </p>
            <div className="bg-white rounded-2xl border border-gray-50 p-6 mb-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#18181B] mb-4">Fitur Premium:</h3>
              <div className="space-y-3 text-left">
                {[
                  { icon: Package, text: 'Mentahan konten siap download' },
                  { icon: FileText, text: 'Hook & caption siap copy' },
                  { icon: Sparkles, text: 'Update konten berkala' },
                  { icon: Crown, text: 'Akses grup eksklusif' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-[#71717A]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium shadow-lg shadow-[#8B5CF6]/20 hover:opacity-90 transition-all"
            >
              <Crown className="w-4 h-4" strokeWidth={1.5} />
              Upgrade ke Premium
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light tracking-tight text-[#18181B] mb-3">
                Konten Kit
              </h1>
              <p className="text-[#A1A1AA] max-w-2xl mx-auto">
                Mentahan konten siap download, Hook dan Caption siap Copy
              </p>
            </div>

            {/* Panduan Produk Digital CTA */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 rounded-2xl p-6 border border-[#8B5CF6]/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#18181B] mb-1">Panduan Jualan Produk Digital</h3>
                    <p className="text-xs text-[#71717A] mb-3">
                      Pelajari strategi dan tips jualan produk digital di platform Rysee untuk membangun bisnis yang sukses.
                    </p>
                    <Link
                      href="/panduan-produk-digital"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-xs font-medium hover:opacity-90 transition-all"
                    >
                      Baca Panduan
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-1 border border-gray-50 shadow-sm inline-flex">
                <button
                  onClick={() => setContentType('referral')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    contentType === 'referral'
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                      : 'text-[#A1A1AA] hover:text-[#18181B]'
                  }`}
                >
                  Referral Content
                </button>
                <button
                  onClick={() => setContentType('produk')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    contentType === 'produk'
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
                      : 'text-[#A1A1AA] hover:text-[#18181B]'
                  }`}
                >
                  Jualan Produk
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-1 border border-gray-50 shadow-sm inline-flex">
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
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
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
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
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
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
          </>
        )}

        {/* Content */}
        {isPaid && activeTab === 'assets' && (
          contentType === 'produk' ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-5">
                <Package className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#18181B] mb-2">Jualan Produk</h3>
              <p className="text-sm text-[#A1A1AA] mb-6">
                Mentahan konten untuk jualan produk digital akan segera tersedia.
              </p>
              <Link
                href="/panduan-produk-digital"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                Baca Panduan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-[#18181B]">{asset.title}</h3>
                      {asset.googleDriveLink && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 text-[#8B5CF6] font-medium">
                          Google Drive
                        </span>
                      )}
                    </div>
                    {asset.description && (
                      <p className="text-sm text-[#A1A1AA] mb-4">{asset.description}</p>
                    )}
                    {asset.googleDriveLink && (
                      <button
                        onClick={() => handleOpenGoogleDrive(asset.googleDriveLink!)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#18181B] text-white rounded-xl text-sm font-medium hover:bg-black transition-all"
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
                  <Package className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-[#A1A1AA]">Belum ada mentahan tersedia</p>
                </div>
              )}
            </div>
          )
        )}

        {isPaid && activeTab === 'caption' && (
          contentType === 'produk' ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-5">
                <MessageSquare className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#18181B] mb-2">Jualan Produk</h3>
              <p className="text-sm text-[#A1A1AA] mb-6">
                Caption untuk jualan produk digital akan segera tersedia.
              </p>
              <Link
                href="/panduan-produk-digital"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                Baca Panduan
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Selector */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'referral', label: 'Referral' },
                  { value: 'komisi-digital', label: 'Produk Digital' },
                  { value: 'referral-komisi', label: 'Referral & Produk' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCaptionCategory(cat.value)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
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
              <div className="space-y-4">
                {captions.map((caption) => (
                  <div
                    key={caption.id}
                    className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {caption.title && (
                          <h3 className="text-lg font-medium text-[#18181B] mb-1">{caption.title}</h3>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(caption.content, caption.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F9F9FB] hover:bg-gray-50 rounded-xl text-sm font-medium text-[#18181B] transition-all"
                      >
                        {copiedId === caption.id ? (
                          <><Check className="w-4 h-4 text-green-500" strokeWidth={1.5} />Copied</>
                        ) : (
                          <><Copy className="w-4 h-4" strokeWidth={1.5} />Copy</>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-[#A1A1AA] whitespace-pre-wrap">{caption.content}</p>
                  </div>
                ))}
                {captions.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-[#A1A1AA]">Belum ada caption tersedia untuk kategori ini</p>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {isPaid && activeTab === 'copywriting' && (
          contentType === 'produk' ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-[#18181B] mb-2">Jualan Produk</h3>
              <p className="text-sm text-[#A1A1AA] mb-6">
                Hook untuk jualan produk digital akan segera tersedia.
              </p>
              <Link
                href="/panduan-produk-digital"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full text-sm font-medium hover:opacity-90 transition-all"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                Baca Panduan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {copywritings.map((copy) => (
                <div
                  key={copy.id}
                  className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {copy.category && (
                        <span className="text-xs font-medium text-[#8B5CF6] uppercase tracking-wider">
                          {copy.category}
                        </span>
                      )}
                      <h3 className="text-lg font-medium text-[#18181B] mt-1">{copy.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(copy.content, copy.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F9F9FB] hover:bg-gray-50 rounded-xl text-sm font-medium text-[#18181B] transition-all"
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
                  <p className="text-sm text-[#A1A1AA] whitespace-pre-wrap">{copy.content}</p>
                </div>
              ))}
              {copywritings.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-[#A1A1AA]">Belum ada copywriting tersedia</p>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
