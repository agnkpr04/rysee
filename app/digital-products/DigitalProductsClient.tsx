'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import GlobalNavbar from '@/components/GlobalNavbar';
import DigitalProductDetailModal from '@/components/DigitalProductDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Search, ChevronDown, Plus, CheckCircle2, Package } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface MasterDigitalProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  thumbnail: string;
  previewUrl: string | null;
  previewImages: string[];
  downloadUrl?: string;
  category: string;
  subCategory: string | null;
  productType: string | null;
  contentCategory: string | null;
  features: string[];
  status: string | null;
}

export default function DigitalProductsClient({ initialProducts }: { initialProducts: MasterDigitalProduct[] }) {
  const [digitalProducts] = useState<MasterDigitalProduct[]>(initialProducts);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedStatusFilter, setAddedStatusFilter] = useState<'all' | 'added' | 'not_added'>('all');
  const [user, setUser] = useState<any>(null);
  const [userDigitalProducts, setUserDigitalProducts] = useState<any[]>([]);
  const [userDigitalProductIds, setUserDigitalProductIds] = useState<Set<string>>(new Set());
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MasterDigitalProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const productTypeOptions = [
    { value: '', label: 'All' },
    { value: 'notion-template', label: 'Notion Templates' },
    { value: 'design-templates', label: 'Design Templates' },
    { value: 'ebook', label: 'E-books' },
    { value: 'digital-vault', label: 'Digital Vault' },
    { value: 'video', label: 'Video' },
    { value: 'social-media-kit', label: 'Social Media Assets' },
    { value: 'graphic-assets', label: 'Graphic Assets' },
  ];

  const categoryOptions: Record<string, { value: string; label: string }[]> = {
    'notion-template': [
      { value: '', label: 'All' },
      { value: 'productivity', label: 'Productivity' },
      { value: 'finance', label: 'Finance' },
      { value: 'planning', label: 'Planning' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'design-templates': [
      { value: '', label: 'All' },
      { value: 'instagram-post', label: 'Instagram Post' },
      { value: 'story', label: 'Story' },
      { value: 'presentation', label: 'Presentation' },
      { value: 'cv', label: 'CV/Resume' },
      { value: 'wedding', label: 'Wedding Invitation' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'ebook': [
      { value: '', label: 'All' },
      { value: 'business', label: 'Business & Entrepreneurship' },
      { value: 'self-improvement', label: 'Self Improvement' },
      { value: 'finance', label: 'Finance' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'education', label: 'Education' },
      { value: 'islamic-kids-education', label: 'Islamic Kids Education' },
      { value: 'kids-learning-activity', label: 'Kids Learning & Activity' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'video': [
      { value: '', label: 'All' },
      { value: 'product-videos', label: 'Product Videos' },
    ],
    'social-media-kit': [
      { value: '', label: 'All' },
      { value: 'thumbnail', label: 'Thumbnail YouTube' },
      { value: 'branding-kit', label: 'Social Media Branding Kits' },
      { value: 'highlight-cover', label: 'Instagram Highlight Covers' },
    ],
    'graphic-assets': [
      { value: '', label: 'All' },
      { value: 'icons', label: 'Icons' },
      { value: 'illustrations', label: 'Illustrations' },
      { value: 'logos', label: 'Logos' },
      { value: 'ui-kits', label: 'UI Kits' },
      { value: 'mockups', label: 'Mockups' },
      { value: 'textures', label: 'Textures' },
      { value: 'fonts', label: 'Fonts' },
      { value: 'printables', label: 'Printables' },
    ],
    'digital-vault': [
      { value: '', label: 'All' },
      { value: 'business', label: 'Business & Entrepreneurship' },
      { value: 'self-improvement', label: 'Self Improvement' },
      { value: 'finance', label: 'Finance' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'education', label: 'Education' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
      { value: 'exclusive', label: 'Exclusive Content' },
    ],
  };

  // Dynamic: Get unique productTypes that have products
  const availableProductTypes = [...new Set(digitalProducts.map(p => p.productType))].filter(Boolean);

  // Dynamic: Get unique categories for selected productType (from all products, not filtered)
  const availableCategories = selectedProductType
    ? [...new Set(digitalProducts.filter(p => p.productType === selectedProductType).map(p => p.category))]
    : [...new Set(digitalProducts.map(p => p.category))];

  // Filter productTypeOptions to only show available types
  const filteredProductTypeOptions = productTypeOptions.filter(opt =>
    opt.value === '' || availableProductTypes.includes(opt.value)
  );

  // Filter categoryOptions to only show available categories
  const filteredCategoryOptions = selectedProductType && categoryOptions[selectedProductType]
    ? categoryOptions[selectedProductType].filter(opt =>
        opt.value === '' || availableCategories.includes(opt.value)
      )
    : [];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserDigitalProducts();
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserDigitalProducts();
      } else {
        setUserDigitalProducts([]);
        setUserDigitalProductIds(new Set());
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const filteredDigitalProducts = digitalProducts.filter((product) => {
    const matchesProductType = selectedProductType === '' || product.productType === selectedProductType;
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAddedStatus = addedStatusFilter === 'all' ||
      (addedStatusFilter === 'added' && userDigitalProductIds.has(product.id)) ||
      (addedStatusFilter === 'not_added' && !userDigitalProductIds.has(product.id));
    return matchesProductType && matchesCategory && matchesSearch && matchesAddedStatus;
  });

  const fetchUserDigitalProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserDigitalProducts([]);
        setUserDigitalProductIds(new Set());
        return;
      }

      const res = await fetch('/api/user-digital-products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const products = data.userDigitalProducts || [];
        setUserDigitalProducts(products);
        setUserDigitalProductIds(new Set(products.map((t: any) => t.masterDigitalProductId)));
      } else {
        setUserDigitalProducts([]);
        setUserDigitalProductIds(new Set());
      }
    } catch (err) {
      console.error("Failed to load user digital products", err);
      setUserDigitalProducts([]);
      setUserDigitalProductIds(new Set());
    }
  };

  const handleAddDigitalProduct = async (productId: string) => {
    if (!user) {
      alert('Please login to add digital products to your store');
      return;
    }

    if (userDigitalProductIds.has(productId)) {
      alert('Digital product already added to your store');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/user-digital-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ masterDigitalProductId: productId }),
      });

      if (response.ok) {
        alert('Digital product added to your store!');
        fetchUserDigitalProducts();
      } else {
        const error = await response.json();
        if (response.status === 403 && error.error?.toLowerCase().includes('premium')) {
          setShowPremiumPopup(true);
        } else {
          alert(error.error || 'Failed to add digital product');
        }
      }
    } catch (error) {
      console.error('Error adding digital product:', error);
      alert('Failed to add digital product');
    }
  };

  const handleProductClick = (product: MasterDigitalProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <GlobalNavbar />
      {/* Product Type + Category Filter + Search - Inside container to align with product grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-4 flex flex-col gap-4 border-b border-gray-50 bg-white/80 backdrop-blur-md z-40">
        {/* Row 1: Product Type Filter + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          {/* Product Type Filter */}
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            {/* Mobile: Dropdown */}
            <div className="md:hidden w-full relative">
              <select
                value={selectedProductType}
                onChange={(e) => {
                  setSelectedProductType(e.target.value);
                  setSelectedCategory('');
                }}
                className="w-full appearance-none bg-[#F9F9FB] border border-gray-200 rounded-lg py-2.5 px-4 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light text-[#18181B]"
              >
                {filteredProductTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" strokeWidth={1.5} />
            </div>
            {/* Desktop: Horizontal Buttons */}
            <div className="hidden md:flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
              {filteredProductTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedProductType(opt.value);
                    setSelectedCategory('');
                  }}
                  className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
                    selectedProductType === opt.value ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text" placeholder="Search" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-black/10 rounded-lg py-2 px-5 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light placeholder:text-[#A1A1AA]"
            />
            <Search className="absolute right-4 top-2.5 w-3.5 h-3.5 text-[#A1A1AA]" strokeWidth={1.5} />
          </div>
        </div>
        {/* Row 2: Category Filter */}
        {selectedProductType && (
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar">
            {/* Mobile: Dropdown */}
            <div className="md:hidden w-full md:w-auto relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto appearance-none bg-[#F9F9FB] border border-gray-200 rounded-lg py-2.5 px-4 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light text-[#18181B]"
              >
                {filteredCategoryOptions.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" strokeWidth={1.5} />
            </div>
            {/* Desktop: Horizontal Buttons */}
            <div className="hidden md:flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar">
              {filteredCategoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
                    selectedCategory === cat.value ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Added Status Filter */}
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setAddedStatusFilter('all')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'all' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAddedStatusFilter('added')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'added' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            Added
          </button>
          <button
            onClick={() => setAddedStatusFilter('not_added')}
            className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-2 py-1 rounded ${
              addedStatusFilter === 'not_added' ? `bg-gradient-to-r ${accentGradient} text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            Not Added
          </button>
        </div>
      </div>

      {/* Digital Product Grid - Inside container */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-12 pb-24 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredDigitalProducts.length > 0 ? (
            filteredDigitalProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-[1px] shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  {product.thumbnail && !imageErrors.has(product.id) ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                      onError={() => setImageErrors(prev => new Set([...prev, product.id]))}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F9F9FB] flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#A1A1AA]" strokeWidth={1.5} />
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm">
                      {product.badge.replace('-', ' ')}
                    </div>
                  )}
                  {userDigitalProductIds.has(product.id) && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                      Added
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="text-[12px] font-medium text-[#18181B] mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#8B5CF6]">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDigitalProduct(product.id);
                      }}
                      disabled={userDigitalProductIds.has(product.id)}
                      className={`flex items-center justify-center p-1 rounded-[1px] transition-all ${
                        userDigitalProductIds.has(product.id)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90'
                      }`}
                    >
                      {userDigitalProductIds.has(product.id) ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-[#A1A1AA] mt-8 text-xs font-light">
              No digital products found.
            </div>
          )}
        </div>
      </div>

      {/* Premium Required Popup */}
      <AnimatePresence>
        {showPremiumPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPremiumPopup(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-50 p-8 relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6]/10 via-[#D946EF]/10 to-[#EC4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-[#D946EF]" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-light text-[#18181B] mb-2">Digital Products Premium Only</h2>
              <p className="text-[12px] text-[#A1A1AA] mb-6 font-light">Digital products hanya tersedia untuk member Premium. Upgrade sekarang untuk akses unlimited!</p>
              <div className="space-y-3">
                <button onClick={() => { setShowPremiumPopup(false); window.location.href = '/#pricing'; }} className="w-full py-3 rounded-[1px] text-xs font-medium bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white hover:opacity-90 transition-all">
                  Upgrade ke Premium
                </button>
                <button onClick={() => setShowPremiumPopup(false)} className="w-full py-3 rounded-[1px] text-xs font-medium bg-[#F9F9FB] text-[#18181B] hover:bg-[#F0F0F2] transition-all">
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <DigitalProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onAddToStore={handleAddDigitalProduct}
          isAdded={userDigitalProductIds.has(selectedProduct.id)}
          showAddButton={true}
        />
      )}
    </div>
  );
}
