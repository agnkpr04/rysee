"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Store, Loader2, Edit3, ArrowLeft, User, Crown, ShoppingBag, Globe, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStoreEditor } from '../hooks/useStoreEditor';
import StoreEditor from './StoreEditor';
import { CATEGORY_NAMES, getSubCategories, hasSubCategories, getGranularCategories, hasGranularCategories } from '@/lib/categories';
import { createClient } from '@supabase/supabase-js';
import { getProfileFrameClasses, getGlowEffectClasses, getEliteFrameStyle, getCrownBadgeStyle, getGlowEffectStyle } from '@/lib/profile-frame';
import { getEliteBadgeGradient, getEliteBadgeBorder } from '@/lib/badge-colors';
import UnifiedFilter from './UnifiedFilter';
import DigitalProductDetailModal from '@/components/DigitalProductDetailModal';
import TemplateDetailModal from '@/components/TemplateDetailModal';
import { PAYMENT_ACCOUNTS, getPaymentMode } from '@/lib/membership-config';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

const textGradient = {
  background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const digitalProductTypeOptions = [
  { value: '', label: 'All' },
  { value: 'notion-template', label: 'Notion Templates' },
  { value: 'design-templates', label: 'Design Templates' },
  { value: 'ebook', label: 'E-books' },
  { value: 'digital-vault', label: 'Digital Vault' },
  { value: 'video', label: 'Video' },
  { value: 'social-media-kit', label: 'Social Media Assets' },
  { value: 'graphic-assets', label: 'Graphic Assets' },
];

const digitalProductCategoryOptions: Record<string, { value: string; label: string }[]> = {
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

interface UserStoreClientProps {
  userId: string;
  userName: string;
  userPlan?: string;
  eliteBadgeColor?: string;
  initialProducts?: any[];
  initialAvatarUrl?: string;
  initialStoreData?: {
    storeName?: string;
    storeDescription?: string;
    themeColor?: string;
    textColor?: string;
    accentColor?: string;
    iconColor?: string;
    gradientFrame?: string;
    fontName?: string;
    fontDescription?: string;
    fontBody?: string;
    profileFrameType?: string;
    frameThickness?: number;
  };
  isOwner?: boolean;
}

export default function UserStoreClient({
  userId,
  userName,
  userPlan,
  eliteBadgeColor = 'crimson',
  initialProducts = [],
  initialAvatarUrl = '',
  initialStoreData,
  isOwner = false
}: UserStoreClientProps) {
  const router = useRouter();
  const editor = useStoreEditor(userId, undefined, userName, userPlan, initialStoreData, isOwner);

  const [products, setProducts] = useState<any[]>(initialProducts);
  const [userTemplates, setUserTemplates] = useState<any[]>([]);
  const [userDigitalProducts, setUserDigitalProducts] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingDigitalProducts, setIsLoadingDigitalProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [activeGranularCategory, setActiveGranularCategory] = useState('All');
  const [activeTemplateCategory, setActiveTemplateCategory] = useState('');
  const [activeDigitalProductType, setActiveDigitalProductType] = useState('');
  const [activeDigitalProductCategory, setActiveDigitalProductCategory] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const productsPerPage = 8;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [avatarError, setAvatarError] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedTemplateForPurchase, setSelectedTemplateForPurchase] = useState<any>(null);
  const [selectedDigitalProduct, setSelectedDigitalProduct] = useState<any>(null);
  const [isDigitalProductDetailOpen, setIsDigitalProductDetailOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isTemplateDetailOpen, setIsTemplateDetailOpen] = useState(false);
  const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);

  // Manual payment states
  const [paymentMethodType, setPaymentMethodType] = useState<'midtrans' | 'manual'>(() => {
    const mode = getPaymentMode();
    return mode === 'midtrans' ? 'midtrans' : 'manual';
  });
  const [selectedManualMethod, setSelectedManualMethod] = useState<string>('bca');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualPaymentSuccess, setManualPaymentSuccess] = useState(false);

  // Format userName with proper case
  const formattedUserName = userName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  useEffect(() => {
    const initializeProducts = async () => {
      // Skip if initial products are already provided
      if (initialProducts && initialProducts.length > 0) {
        setHasMore(initialProducts.length >= productsPerPage);
        return;
      }

      try {
        const res = await fetch(`/api/user-products?userId=${userId}&offset=0&limit=${productsPerPage}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setHasMore(data.hasMore !== undefined ? data.hasMore : (data.products || []).length >= productsPerPage);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProducts();
  }, [userId, initialProducts]);

  useEffect(() => {
    const fetchUserTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await fetch(`/api/user-templates?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserTemplates(data.userTemplates || []);
        }
      } catch (err) {
        console.error("Failed to load user templates", err);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchUserTemplates();
  }, [userId]);

  useEffect(() => {
    const fetchUserDigitalProducts = async () => {
      setIsLoadingDigitalProducts(true);
      try {
        const res = await fetch(`/api/user-digital-products?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserDigitalProducts(data.userDigitalProducts || []);
        }
      } catch (err) {
        console.error("Failed to load user digital products", err);
      } finally {
        setIsLoadingDigitalProducts(false);
      }
    };

    fetchUserDigitalProducts();
  }, [userId]);

  // Auto-select product type based on available products
  useEffect(() => {
    if (!isLoadingTemplates && !isLoadingDigitalProducts) {
      if (userDigitalProducts.length > 0) {
        setFilterType('digital-products');
      } else if (userTemplates.length > 0) {
        setFilterType('templates');
      } else {
        setFilterType('all');
      }
    }
  }, [isLoadingTemplates, isLoadingDigitalProducts, userDigitalProducts, userTemplates]);

  useEffect(() => {
    const loadUserAvatar = async () => {
      // Skip if initial avatar is already provided
      if (initialAvatarUrl) {
        setAvatarUrl(initialAvatarUrl);
        return;
      }

      try {
        // Try to get avatar from database first
        const res = await fetch(`/api/auth/user?id=${userId}`);
        if (res.ok) {
          const userData = await res.json();
          const avatar = userData.user?.avatar_url || userData.user?.storeLogo || '';
          setAvatarUrl(avatar);
          if (typeof window !== 'undefined' && avatar) {
            localStorage.setItem(`storeAvatar_${userId}`, avatar);
          }
        }
      } catch (err) {
        console.error("Failed to load user avatar", err);
        // Fallback to Supabase Auth metadata if database fails
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.user_metadata?.avatar_url) {
            setAvatarUrl(session.user.user_metadata.avatar_url);
            if (typeof window !== 'undefined') {
              localStorage.setItem(`storeAvatar_${userId}`, session.user.user_metadata.avatar_url);
            }
          }
        } catch (supabaseErr) {
          console.error("Failed to load avatar from Supabase Auth", supabaseErr);
        }
      }
    };
    loadUserAvatar();
  }, [userId, initialAvatarUrl]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = async () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setIsScrollingUp(currentScrollY < lastScrollY);
        setLastScrollY(currentScrollY);

        if (loadMoreRef.current && loadMoreRef.current.getBoundingClientRect().top <= window.innerHeight) {
          if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            fetch(`/api/user-products?userId=${userId}&offset=${products.length}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data) {
                  setProducts([...products, ...data.products]);
                  setHasMore(data.hasMore !== undefined ? data.hasMore : data.products.length >= productsPerPage);
                }
              })
              .catch(err => console.error("Failed to load more products", err))
              .finally(() => setIsLoadingMore(false));
          }
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [products, isLoadingMore, hasMore, userId, lastScrollY]);

  // Window focus listener to refresh avatar data when user returns from settings
  useEffect(() => {
    const handleFocus = async () => {
      try {
        const res = await fetch(`/api/auth/user?id=${userId}`);
        if (res.ok) {
          const userData = await res.json();
          const avatar = userData.user?.avatar_url || userData.user?.storeLogo || '';
          setAvatarUrl(avatar);
          if (typeof window !== 'undefined' && avatar) {
            localStorage.setItem(`storeAvatar_${userId}`, avatar);
          }
        }
      } catch (err) {
        console.error("Failed to refresh avatar on focus", err);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId]);

  // Listen for profile updates from settings page
  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const res = await fetch(`/api/auth/user?id=${userId}`);
        if (res.ok) {
          const userData = await res.json();
          const avatar = userData.user?.avatar_url || userData.user?.storeLogo || '';
          setAvatarUrl(avatar);
          if (typeof window !== 'undefined' && avatar) {
            localStorage.setItem(`storeAvatar_${userId}`, avatar);
          }
        }
      } catch (err) {
        console.error("Failed to refresh avatar on profile update", err);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [userId]);

  const filteredProducts = useMemo(() => {
    return products.filter((item: any) => {
      const matchesCategory = activeCategory === 'All' || item.product?.category === activeCategory;
      const matchesSubCategory = activeSubCategory === 'All' || !activeSubCategory || item.product?.subCategory === activeSubCategory;
      const matchesGranularCategory = activeGranularCategory === 'All' || !activeGranularCategory || item.product?.granularCategory === activeGranularCategory;
      const matchesSearch = searchQuery === '' || item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSubCategory && matchesGranularCategory && matchesSearch;
    });
  }, [products, activeCategory, activeSubCategory, activeGranularCategory, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return userTemplates.filter((item: any) => {
      const matchesSearch = searchQuery === '' || item.masterTemplate?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeTemplateCategory === '' || item.masterTemplate?.category === activeTemplateCategory;
      return matchesSearch && matchesCategory;
    });
  }, [userTemplates, searchQuery, activeTemplateCategory]);

  const filteredDigitalProducts = useMemo(() => {
    return userDigitalProducts.filter((item: any) => {
      const matchesSearch = searchQuery === '' || item.masterDigitalProduct?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProductType = activeDigitalProductType === '' || item.masterDigitalProduct?.productType === activeDigitalProductType;
      const matchesCategory = activeDigitalProductCategory === '' || item.masterDigitalProduct?.category === activeDigitalProductCategory;
      return matchesSearch && matchesProductType && matchesCategory;
    });
  }, [userDigitalProducts, searchQuery, activeDigitalProductType, activeDigitalProductCategory]);

  // Combine products and templates for display
  const displayedProducts = useMemo(() => {
    const productItems = filteredProducts.map((item: any) => ({
      ...item,
      type: 'product',
      id: item.id,
      title: item.product?.title,
      thumbnail: item.product?.thumbnail,
      price: item.product?.price,
    }));

    const templateItems = filteredTemplates.map((item: any) => ({
      ...item,
      type: 'template',
      id: item.id,
      title: item.masterTemplate?.title,
      thumbnail: item.masterTemplate?.thumbnail,
      price: item.masterTemplate?.price,
      originalPrice: item.masterTemplate?.originalPrice,
      badge: item.masterTemplate?.badge,
      previewUrl: item.masterTemplate?.previewUrl,
      previewImages: item.masterTemplate?.previewImages || [],
      description: item.masterTemplate?.description,
      features: item.masterTemplate?.features,
      masterTemplateId: item.masterTemplate?.id,
    }));

    const digitalProductItems = filteredDigitalProducts.map((item: any) => ({
      type: 'digital-product',
      id: item.id,
      title: item.masterDigitalProduct?.title,
      thumbnail: item.masterDigitalProduct?.thumbnail,
      price: item.masterDigitalProduct?.price,
      originalPrice: item.masterDigitalProduct?.originalPrice,
      badge: item.masterDigitalProduct?.badge,
      previewUrl: item.masterDigitalProduct?.previewUrl,
      previewImages: item.masterDigitalProduct?.previewImages || [],
      description: item.masterDigitalProduct?.description,
      features: item.masterDigitalProduct?.features,
      masterDigitalProductId: item.masterDigitalProduct?.id,
      category: item.masterDigitalProduct?.category,
      subCategory: item.masterDigitalProduct?.subCategory,
      productType: item.masterDigitalProduct?.productType,
      contentCategory: item.masterDigitalProduct?.contentCategory,
      downloadUrl: item.masterDigitalProduct?.downloadUrl,
    }));
    return [...digitalProductItems, ...productItems, ...templateItems];
  }, [filteredProducts, filteredTemplates, filteredDigitalProducts]);

  // Check if user has both products and templates to show filter
  const hasProducts = filteredProducts.length > 0;
  const hasTemplates = filteredTemplates.length > 0;
  const hasDigitalProducts = filteredDigitalProducts.length > 0;
  const showTypeFilter = (hasProducts && hasTemplates) || (hasProducts && hasDigitalProducts) || (hasTemplates && hasDigitalProducts);

  const [filterType, setFilterType] = useState<'all' | 'products' | 'templates' | 'digital-products'>('all');

  // Reset category states when filter type changes
  const handleFilterTypeChange = (newType: 'all' | 'products' | 'templates' | 'digital-products') => {
    setFilterType(newType);
    if (newType === 'all') {
      setActiveCategory('All');
      setActiveSubCategory('All');
      setActiveGranularCategory('All');
      setActiveTemplateCategory('');
      setActiveDigitalProductType('');
      setActiveDigitalProductCategory('');
    } else if (newType === 'digital-products') {
      setActiveCategory('All');
      setActiveSubCategory('All');
      setActiveGranularCategory('All');
      setActiveTemplateCategory('');
    } else if (newType === 'templates') {
      setActiveCategory('All');
      setActiveSubCategory('All');
      setActiveGranularCategory('All');
      setActiveDigitalProductType('');
      setActiveDigitalProductCategory('');
    }
  };

  const filteredByType = useMemo(() => {
    if (filterType === 'all') return displayedProducts;
    if (filterType === 'digital-products') return displayedProducts.filter(item => item.type === 'digital-product');
    if (filterType === 'templates') return displayedProducts.filter(item => item.type === 'template');
    if (filterType === 'products') return displayedProducts.filter(item => item.type === 'product');
    return displayedProducts;
  }, [displayedProducts, filterType]);

  const categories = useMemo(() => {
    const allCategories = ['All', ...CATEGORY_NAMES.filter(cat => cat !== 'Men')];
    // Filter categories to only show those that have products (use raw products, not filtered)
    const categoriesWithProducts = allCategories.filter(cat => {
      if (cat === 'All') return true;
      return products.some((item: any) => {
        const productCategory = item.product?.category || item.product?.mainCategory;
        return productCategory === cat;
      });
    });
    return categoriesWithProducts;
  }, [products]);

  // Build template categories dynamically based on user's templates
  const templateCategories = useMemo(() => {
    const categoryMap: Record<string, string> = {
      'landing-page': 'Landing Page',
      'portfolio': 'Portfolio',
      'ecommerce': 'E-commerce',
      'blog': 'Blog',
      'business': 'Business',
      'other': 'Other',
    };

    const uniqueCategories = new Set<string>();
    userTemplates.forEach((item: any) => {
      if (item.masterTemplate?.category) {
        uniqueCategories.add(item.masterTemplate.category);
      }
    });

    const dynamicCategories = Array.from(uniqueCategories)
      .map(cat => ({ value: cat, label: categoryMap[cat] || cat }));

    return dynamicCategories;
  }, [userTemplates]);

  // Build digital product categories dynamically based on user's digital products
  const digitalProductTypes = useMemo(() => {
    const uniqueTypes = new Set<string>();
    userDigitalProducts.forEach((item: any) => {
      if (item.masterDigitalProduct?.productType) {
        uniqueTypes.add(item.masterDigitalProduct.productType);
      }
    });
    // Filter to only show types that have products and are in predefined options
    const availableTypes = Array.from(uniqueTypes).filter(type =>
      digitalProductTypeOptions.some(opt => opt.value === type)
    );
    return digitalProductTypeOptions.filter(opt =>
      opt.value === '' || availableTypes.includes(opt.value)
    );
  }, [userDigitalProducts]);

  // Build digital product sub categories dynamically based on selected productType
  const digitalProductCategories = useMemo(() => {
    if (!activeDigitalProductType) return [];
    const categories = digitalProductCategoryOptions[activeDigitalProductType] || [];
    // Filter to only show categories that have products
    const availableCategories = new Set<string>();
    userDigitalProducts.forEach((item: any) => {
      if (item.masterDigitalProduct?.productType === activeDigitalProductType && item.masterDigitalProduct?.category) {
        availableCategories.add(item.masterDigitalProduct.category);
      }
    });
    return categories.filter(cat =>
      cat.value === '' || availableCategories.has(cat.value)
    );
  }, [userDigitalProducts, activeDigitalProductType]);

  const getGradientFrameClasses = (gradientFrame: string) => {
    switch (gradientFrame) {
      case 'shopee':
        return 'from-[#FF9933] to-[#FFCC33]';
      case 'tiktok':
        return 'from-[#69C9D0] via-[#EE1D52] to-[#69C9D0]';
      case 'purple':
        return 'from-[#8B5CF6] to-[#D946EF]';
      case 'blue':
        return 'from-[#1D4ED8] via-[#3B82F6] to-[#06B6D4]';
      case 'green':
        return 'from-[#059669] via-[#10B981] to-[#A3E635]';
      case 'crimson':
        return 'from-[#FF0040] via-[#DC143C] to-[#FF6B6B]';
      default:
        return '';
    }
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };



  const handlePurchase = async () => {
    if (!selectedTemplateForPurchase) return;

    const isDigital = selectedTemplateForPurchase.type === 'digital-product';

    if (isDigital) {
      // === DIGITAL PRODUCT FLOW ===
      const nameInput = document.getElementById('nameInput') as HTMLInputElement;
      const emailInput = document.getElementById('emailInput') as HTMLInputElement;
      const phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
      const notesInput = document.getElementById('notesInput') as HTMLTextAreaElement | null;

      if (
        !nameInput?.value ||
        !emailInput?.value ||
        !phoneInput?.value
      ) {
        alert('Silakan lengkapi semua field yang wajib diisi');
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session: buyerSession } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (buyerSession?.access_token) {
          headers['Authorization'] = `Bearer ${buyerSession.access_token}`;
        }

        const userDigitalProductId = selectedTemplateForPurchase.id;
        if (!userDigitalProductId) {
          alert('Failed to prepare purchase: missing product reference');
          setIsLoading(false);
          return;
        }

        // === MIDTRANS PAYMENT FLOW ===
        const response = await fetch('/api/midtrans/create-transaction', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            userDigitalProductId,
            affiliateId: userId,
            customerName: nameInput.value,
            customerEmail: emailInput.value,
            customerPhone: phoneInput.value,
            notes: notesInput?.value || '',
          }),
        });

        const responseText = await response.text();
        console.log('[Midtrans] Response status:', response.status);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('[Midtrans] Failed to parse response:', e);
          alert('Failed to create transaction: Invalid response from server');
          setIsLoading(false);
          return;
        }

        if (response.ok && data.token) {
          const script = document.createElement('script');
          script.src = 'https://app.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
          script.onload = () => {
            // @ts-expect-error - midtrans snap SDK has no type definitions
            window.snap.pay(data.token, {
              onSuccess: (result: any) => {
                console.log('Payment success:', result);
                setPurchaseModalOpen(false);
                setPaymentSuccessModalOpen(true);
              },
              onPending: (result: any) => {
                console.log('Payment pending:', result);
                alert('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
              },
              onError: (result: any) => {
                console.log('Payment error:', result);
                alert('Pembayaran gagal. Silakan coba lagi.');
              },
              onClose: () => {
                console.log('Payment popup closed');
                setIsLoading(false);
              },
            });
          };
          document.body.appendChild(script);
        } else {
          alert(data.error || 'Failed to create transaction');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Purchase error:', error);
        alert('Failed to create order');
        setIsLoading(false);
      }
    } else {
      // === TEMPLATE FLOW (Midtrans) ===
      const nameInput = document.getElementById('nameInput') as HTMLInputElement;
      const emailInput = document.getElementById('emailInput') as HTMLInputElement;
      const phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
      const notesInput = document.getElementById('notesInput') as HTMLTextAreaElement | null;

      if (
        !nameInput?.value ||
        !emailInput?.value ||
        !phoneInput?.value
      ) {
        alert('Silakan lengkapi semua field yang wajib diisi');
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session: buyerSession } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (buyerSession?.access_token) {
          headers['Authorization'] = `Bearer ${buyerSession.access_token}`;
        }

        const userTemplateId = selectedTemplateForPurchase.id;

        // === MIDTRANS PAYMENT FLOW ===
        const response = await fetch('/api/midtrans/create-template-transaction', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            userTemplateId,
            affiliateId: userId,
            customerName: nameInput.value,
            customerEmail: emailInput.value,
            customerPhone: phoneInput.value,
            notes: notesInput?.value || '',
          }),
        });

        const responseText = await response.text();
        console.log('[Midtrans Template] Response status:', response.status);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('[Midtrans Template] Failed to parse response:', e);
          alert('Failed to create transaction: Invalid response from server');
          setIsLoading(false);
          return;
        }

        if (response.ok && data.token) {
          const script = document.createElement('script');
          script.src = 'https://app.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
          script.onload = () => {
            // @ts-expect-error - midtrans snap SDK has no type definitions
            window.snap.pay(data.token, {
              onSuccess: (result: any) => {
                console.log('Template payment success:', result);
                setPurchaseModalOpen(false);
                setPaymentSuccessModalOpen(true);
              },
              onPending: (result: any) => {
                console.log('Template payment pending:', result);
                alert('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
              },
              onError: (result: any) => {
                console.log('Template payment error:', result);
                alert('Pembayaran gagal. Silakan coba lagi.');
              },
              onClose: () => {
                console.log('Template payment popup closed');
                setIsLoading(false);
              },
            });
          };
          document.body.appendChild(script);
        } else {
          alert(data.error || 'Failed to create transaction');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Template purchase error:', error);
        alert('Failed to create order');
        setIsLoading(false);
      }
    }
  };

  // === MANUAL PAYMENT FLOW (separate from Midtrans) ===
  const handleManualPayment = async () => {
    if (!selectedTemplateForPurchase) return;

    const nameInput = document.getElementById('nameInput') as HTMLInputElement;
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    const phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
    const notesInput = document.getElementById('notesInput') as HTMLTextAreaElement | null;

    if (!nameInput?.value || !emailInput?.value || !phoneInput?.value) {
      alert('Silakan lengkapi semua field yang wajib diisi');
      return;
    }

    if (!paymentProofFile) {
      alert('Silakan upload bukti transfer');
      return;
    }

    setIsSubmittingManual(true);
    try {
      const isDigital = selectedTemplateForPurchase.type === 'digital-product';
      const formData = new FormData();

      if (isDigital) {
        formData.append('userDigitalProductId', selectedTemplateForPurchase.id);
      } else {
        formData.append('userTemplateId', selectedTemplateForPurchase.id);
      }

      formData.append('affiliateId', userId);
      formData.append('customerName', nameInput.value);
      formData.append('customerEmail', emailInput.value);
      formData.append('customerPhone', phoneInput.value);
      formData.append('notes', notesInput?.value || '');
      formData.append('paymentMethod', selectedManualMethod);
      formData.append('proof', paymentProofFile);

      const endpoint = isDigital
        ? '/api/manual-payment/digital-product'
        : '/api/manual-payment/template';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setManualPaymentSuccess(true);
        setPaymentProofFile(null);
      } else {
        alert(data.error || 'Gagal membuat pesanan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: editor.themeColor }}>
      {editor.isEditMode && (
        <div className="w-full px-8 py-4 bg-white border-b border-gray-50">
          <StoreEditor
            isEditMode={editor.isEditMode}
            isOwner={editor.isOwner}
            isSaving={editor.isSaving}
            themeColor={editor.themeColor}
            textColor={editor.textColor}
            accentColor={editor.accentColor}
            iconColor={editor.iconColor}
            gradientFrame={editor.gradientFrame}
            storeName={editor.storeName}
            storeDescription={editor.storeDescription}
            fontName={editor.fontName}
            fontDescription={editor.fontDescription}
            fontBody={editor.fontBody}
            userPlan={userPlan}
            profileFrameType={editor.profileFrameType}
            frameThickness={editor.frameThickness}
            onThemeColorChange={editor.setThemeColor}
            onTextColorChange={editor.setTextColor}
            onAccentColorChange={editor.setAccentColor}
            onIconColorChange={editor.setIconColor}
            onGradientFrameChange={editor.setGradientFrame}
            onStoreNameChange={editor.setStoreName}
            onStoreDescriptionChange={editor.setStoreDescription}
            onFontNameChange={editor.setFontName}
            onFontDescriptionChange={editor.setFontDescription}
            onFontBodyChange={editor.setFontBody}
            onProfileFrameTypeChange={editor.setProfileFrameType}
            onFrameThicknessChange={editor.setFrameThickness}
            onSave={editor.handleSaveAll}
            onCancel={editor.handleCancel}
          />
        </div>
      )}

      <header className="w-full px-4 pt-8 pb-4 md:px-8 md:pt-12 md:pb-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0 relative">
            {(() => {
              const hasFrame = userPlan === 'premium' && editor.profileFrameType && editor.profileFrameType !== 'none';
              const frameStyle: React.CSSProperties = hasFrame ? {
                borderColor: 'transparent',
                ...(editor.profileFrameType === 'pro' ? {
                  background: 'linear-gradient(135deg, #8B5CF6, #D946EF, #EC4899)',
                  border: '2px solid #8B5CF6',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(217, 70, 239, 0.2)',
                } : {}),
                ...(editor.profileFrameType === 'elite' ? {
                  background: `linear-gradient(135deg, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').via}, ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').to})`,
                  border: `2px solid ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}`,
                  boxShadow: `0 0 20px ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}66, 0 0 40px ${getEliteBadgeGradient(eliteBadgeColor || 'crimson').from}33`,
                } : {}),
                ...(editor.profileFrameType === 'elite-yellow' ? {
                  background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #FDE68A)',
                  border: '2px solid #F59E0B',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)',
                } : {}),
                ...(editor.profileFrameType === 'elite-orange' ? {
                  background: 'linear-gradient(135deg, #F97316, #FB923C, #FDBA74)',
                  border: '2px solid #F97316',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(251, 146, 60, 0.2)',
                } : {}),
                ...(editor.profileFrameType === 'elite-pink' ? {
                  background: 'linear-gradient(135deg, #EC4899, #F472B6, #FDA4AF)',
                  border: '2px solid #EC4899',
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
                } : {}),
              } : {
                borderColor: 'transparent',
                background: 'transparent',
              };

              return (
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ${hasFrame ? 'p-[2px]' : ''}`}
                  style={frameStyle}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {avatarUrl && !avatarError ? (
                      <Image
                        src={avatarUrl}
                        alt="Store Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        unoptimized={true}
                        onError={() => {
                          setAvatarError(true);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: editor.themeColor }}>
                        <User className="w-7 h-7" strokeWidth={1} style={{ color: editor.textColor }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-light tracking-tight" style={{ color: editor.textColor, fontFamily: editor.fontName === 'Great Vibes' ? 'var(--font-great-vibes)' : 'var(--font-poppins)' }}>
              {editor.storeName || 'User Store'}
            </h1>
            {editor.storeDescription ? (
              <p className="text-[11px] tracking-wider font-light italic" style={{ color: editor.textColor, fontFamily: editor.fontDescription === 'Great Vibes' ? 'var(--font-great-vibes)' : 'var(--font-poppins)' }}>
                {editor.storeDescription}
              </p>
            ) : (
              <p className="text-[11px] tracking-wider font-light italic" style={{ color: editor.textColor, fontFamily: editor.fontDescription === 'Great Vibes' ? 'var(--font-great-vibes)' : 'var(--font-poppins)' }}>
                Curated by {formattedUserName}
              </p>
            )}
          </div>
        </div>
      </header>

      {editor.isOwner && !editor.isEditMode && (
        <div className={`fixed top-16 right-4 md:top-4 z-40 transition-transform duration-300 ${
          isScrollingUp ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/affstore/${userId}`)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all group shadow-sm backdrop-blur-sm hover:opacity-90"
              style={{
                backgroundColor: `${editor.accentColor}15`,
                borderColor: `${editor.accentColor}50`
              }}
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} style={{ color: editor.iconColor }} />
            </button>
            <button
              onClick={() => editor.setIsEditMode(true)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all group shadow-sm backdrop-blur-sm hover:opacity-90"
              style={{
                backgroundColor: `${editor.accentColor}15`,
                borderColor: `${editor.accentColor}50`
              }}
              title="Edit Toko"
            >
              <Edit3 className="w-4 h-4" strokeWidth={1.5} style={{ color: editor.iconColor }} />
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-4 py-3 md:px-8 md:py-4 border-y backdrop-blur-md shadow-sm" style={{ borderColor: `${editor.textColor}10`, backgroundColor: editor.themeColor }}>
        <UnifiedFilter
          products={products}
          templates={userTemplates}
          digitalProducts={userDigitalProducts}
          availableProductCategories={categories}
          availableTemplateCategories={templateCategories}
          availableDigitalProductCategories={digitalProductTypes}
          availableDigitalProductSubCategories={digitalProductCategories}
          activeTab={filterType}
          productCategory={activeCategory}
          productSubCategory={activeSubCategory}
          productGranularCategory={activeGranularCategory}
          templateCategory={activeTemplateCategory}
          digitalProductCategory={activeDigitalProductType}
          digitalProductSubCategory={activeDigitalProductCategory}
          searchQuery={searchQuery}
          onTabChange={handleFilterTypeChange}
          onProductCategoryChange={setActiveCategory}
          onProductSubCategoryChange={(subCat) => {
            setActiveSubCategory(subCat);
            setActiveGranularCategory('All');
          }}
          onProductGranularCategoryChange={setActiveGranularCategory}
          onTemplateCategoryChange={setActiveTemplateCategory}
          onDigitalProductCategoryChange={(type) => {
            setActiveDigitalProductType(type);
            setActiveDigitalProductCategory('');
          }}
          onDigitalProductSubCategoryChange={setActiveDigitalProductCategory}
          onSearchChange={setSearchQuery}
          accentColor={editor.accentColor}
          textColor={editor.textColor}
          themeColor={editor.themeColor}
        />
      </div>

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 py-8 md:px-8 md:py-12">
        {isLoading || isLoadingTemplates || isLoadingDigitalProducts ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} style={{ color: editor.iconColor }} />
            <span className="italic text-xs tracking-wider font-light" style={{ color: editor.textColor }}>Loading assets...</span>
          </div>
        ) : filteredByType.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <ShoppingBag className="w-8 h-8" strokeWidth={1.5} style={{ color: editor.textColor }} />
            <span className="italic text-xs tracking-wider font-light" style={{ color: editor.textColor }}>
              {showTypeFilter && filterType !== 'all'
                ? `Tidak ada digital product di toko ini`
                : 'Toko ini belum menambahkan item apapun'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredByType.map((item: any) => {
              const gradientClasses = getGradientFrameClasses(editor.gradientFrame);
              const isTemplate = item.type === 'template';
              const isDigitalProduct = item.type === 'digital-product';
              return (
                <motion.div
                  key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  {isTemplate ? (
                    <div
                      className={`bg-white rounded-[1px] shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ${gradientClasses ? `p-[2px] bg-gradient-to-r ${gradientClasses}` : ''}`}
                      style={{ borderColor: gradientClasses ? 'transparent' : editor.iconColor, borderWidth: gradientClasses ? '0' : '1px', borderStyle: 'solid' }}
                      onClick={() => {
                        setSelectedTemplate(item);
                        setIsTemplateDetailOpen(true);
                      }}
                    >
                      <div className="flex flex-col bg-white rounded-[1px] overflow-hidden h-full">
                        <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#F9F9FB]">
                          {item.thumbnail && !imageErrors.has(item.id) ? (
                            <Image
                              src={item.thumbnail}
                              alt=""
                              width={600}
                              height={400}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              unoptimized={true}
                              onError={() => handleImageError(item.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: editor.themeColor }}>
                              <Globe className="w-8 h-8" style={{ color: editor.iconColor }} strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="w-full p-2 flex flex-col justify-between bg-white mt-auto">
                          <div>
                            <h3 className="text-[12px] font-bold mb-1 line-clamp-2" style={{ color: editor.textColor }}>
                              {item.title}
                            </h3>
                            {item.price && (
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-light" style={{ color: editor.accentColor }}>
                                  Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isDigitalProduct ? (
                    <div
                      className={`bg-white rounded-[1px] shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col ${gradientClasses ? `p-[2px] bg-gradient-to-r ${gradientClasses}` : ''}`}
                      style={{ borderColor: gradientClasses ? 'transparent' : editor.iconColor, borderWidth: gradientClasses ? '0' : '1px', borderStyle: 'solid' }}
                      onClick={() => {
                        setSelectedDigitalProduct(item);
                        setIsDigitalProductDetailOpen(true);
                      }}
                    >
                      <div className="flex flex-col bg-white rounded-[1px] overflow-hidden h-full">
                        {/* Thumbnail */}
                        <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#F9F9FB]">
                          {item.thumbnail && !imageErrors.has(item.id) ? (
                            <>
                              <Image
                                src={item.thumbnail}
                                alt=""
                                width={600}
                                height={400}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                unoptimized={true}
                                onError={() => handleImageError(item.id)}
                              />
                              {item.badge && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm">
                                  {item.badge.replace('-', ' ')}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: editor.themeColor }}>
                              <Globe className="w-8 h-8" style={{ color: editor.iconColor }} strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        {/* Details */}
                        <div className="w-full p-2 flex flex-col justify-between bg-white mt-auto">
                          <div>
                            <h3 className="text-[12px] font-medium mb-1 line-clamp-2" style={{ color: editor.textColor }}>
                              {item.title}
                            </h3>
                            {item.price && (
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  {item.originalPrice && item.originalPrice > item.price && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                      Rp {item.originalPrice.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                  <p className="text-xs font-light" style={{ color: editor.accentColor }}>
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Shopee product
                    null
                    // <div
                    //   className={`bg-white rounded-[1px] shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${gradientClasses ? `p-[2px] bg-gradient-to-r ${gradientClasses}` : ''}`}
                    //   style={{ borderColor: gradientClasses ? 'transparent' : editor.iconColor, borderWidth: gradientClasses ? '0' : '1px', borderStyle: 'solid' }}
                    //   onClick={() => {
                    //     if (item.affiliateLink) {
                    //       window.open(item.affiliateLink, '_blank');
                    //     }
                    //   }}
                    // >
                    //   <div className="flex flex-col bg-white rounded-[1px] overflow-hidden">
                    //     <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#F9F9FB]">
                    //       {item.thumbnail && !imageErrors.has(item.id) ? (
                    //         <Image
                    //           src={item.thumbnail}
                    //           alt=""
                    //           width={400}
                    //           height={500}
                    //           className="w-full h-full object-cover"
                    //           loading="lazy"
                    //           unoptimized={true}
                    //           onError={() => handleImageError(item.id)}
                    //         />
                    //       ) : (
                    //         <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: editor.themeColor }}>
                    //           <ShoppingBag className="w-8 h-8" style={{ color: editor.iconColor }} strokeWidth={1.5} />
                    //         </div>
                    //       )}
                    //     </div>
                    //     <div className="w-full p-2 flex flex-col justify-between bg-white">
                    //       <div>
                    //         <h3 className="text-[11px] font-light tracking-wider truncate mb-1" style={{ color: editor.textColor }}>
                    //           {item.title}
                    //         </h3>
                    //         {item.price && (
                    //           <p className="text-xs font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                    //             Rp {item.price.toLocaleString('id-ID')}
                    //           </p>
                    //         )}
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="w-full pb-20 pt-6">
        {isLoadingMore && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} style={{ color: editor.iconColor }} />
            <span className="italic text-xs tracking-wider font-light" style={{ color: editor.textColor }}>Loading more...</span>
          </div>
        )}
        {!hasMore && displayedProducts.length > 0 && (
          <p className="text-center text-[10px] font-light italic" style={{ color: editor.textColor }}>
            All products loaded
          </p>
        )}
        <div ref={loadMoreRef} />
      </footer>

      {/* Purchase Modal */}
      {purchaseModalOpen && selectedTemplateForPurchase && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setPurchaseModalOpen(false); setManualPaymentSuccess(false); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setPurchaseModalOpen(false); setManualPaymentSuccess(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Manual Payment Success State */}
            {manualPaymentSuccess ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pesanan Diterima!</h3>
                <p className="text-sm text-gray-600 mb-2">Pesanan Anda sedang menunggu verifikasi admin.</p>
                <p className="text-xs text-gray-500 mb-6">Konfirmasi akan dikirim ke email Anda dalam maksimal 1x24 jam.</p>
                <button
                  onClick={() => { setPurchaseModalOpen(false); setManualPaymentSuccess(false); }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <>
                {/* Product Info */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold mb-2" style={{ color: editor.textColor }}>
                    {selectedTemplateForPurchase.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {selectedTemplateForPurchase.originalPrice && selectedTemplateForPurchase.originalPrice > selectedTemplateForPurchase.price && (
                      <span className="text-sm text-gray-400 line-through">
                        Rp {selectedTemplateForPurchase.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                      Rp {selectedTemplateForPurchase.price?.toLocaleString('id-ID') || '0'}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector - only show if mode is 'both' */}
                {getPaymentMode() === 'both' && (
                  <div className="mb-5">
                    <label className="block text-xs font-medium mb-2 text-gray-700">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethodType('manual')}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          paymentMethodType === 'manual'
                            ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xs font-medium block">Transfer Manual</span>
                        <span className="text-[10px] text-gray-500">BCA / DANA / OVO</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethodType('midtrans')}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          paymentMethodType === 'midtrans'
                            ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xs font-medium block">Otomatis</span>
                        <span className="text-[10px] text-gray-500">Midtrans Gateway</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* === MANUAL PAYMENT UI === */}
                {paymentMethodType === 'manual' && (
                  <>
                    {/* Transfer Info */}
                    <div className="rounded-xl p-4 mb-5 space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                      <p className="text-xs font-semibold text-purple-900 mb-2">Transfer ke:</p>
                      <div className="space-y-2">
                        {PAYMENT_ACCOUNTS.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => setSelectedManualMethod(acc.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                              selectedManualMethod === acc.id
                                ? 'border-[#8B5CF6] bg-white shadow-sm'
                                : 'border-gray-200 bg-white/50 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{acc.icon}</span>
                              <span className="text-xs font-medium text-gray-800">{acc.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-mono font-semibold text-gray-900">{acc.accountNumber}</p>
                              <p className="text-[10px] text-gray-500">a/n {acc.accountName}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                        <span className="text-xs text-purple-800">Total Transfer</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                          Rp {selectedTemplateForPurchase.price?.toLocaleString('id-ID') || '0'}
                        </span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Nama Lengkap *</label>
                        <input
                          type="text"
                          id="nameInput"
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Email *</label>
                        <input
                          type="email"
                          id="emailInput"
                          placeholder="email@example.com"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>No. WhatsApp *</label>
                        <input
                          type="tel"
                          id="phoneInput"
                          placeholder="08xxxxxxxxxx"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Catatan (Opsional)</label>
                        <textarea
                          id="notesInput"
                          placeholder="Catatan tambahan untuk pesanan Anda"
                          rows={2}
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 resize-none"
                          style={{ borderColor: '#E5E7EB' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Bukti Transfer *</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                            className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#8B5CF6]/10 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/20"
                            style={{ borderColor: '#E5E7EB' }}
                          />
                          {paymentProofFile && (
                            <p className="text-[10px] text-green-600 mt-1">✓ {paymentProofFile.name}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-xl p-4 mt-5 mb-5 border border-gray-100">
                      <h4 className="text-xs font-semibold mb-2 text-gray-700">Instruksi</h4>
                      <div className="text-[11px] space-y-1.5 text-gray-600">
                        <p>1. Transfer sesuai nominal ke rekening di atas</p>
                        <p>2. Screenshot bukti transfer</p>
                        <p>3. Upload bukti transfer di form ini</p>
                        <p>4. Klik &quot;Kirim Pesanan&quot; dan tunggu verifikasi admin (maks 1x24 jam)</p>
                      </div>
                    </div>

                    <button
                      onClick={handleManualPayment}
                      disabled={isSubmittingManual}
                      className="w-full text-white py-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm disabled:opacity-50 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] shadow-lg"
                    >
                      {isSubmittingManual ? 'Mengirim...' : 'Kirim Pesanan'}
                    </button>
                  </>
                )}

                {/* === MIDTRANS PAYMENT UI (existing logic preserved) === */}
                {paymentMethodType === 'midtrans' && (
                  <>
                    {/* Payment Info */}
                    <div className="rounded-xl p-4 mb-5 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Metode</span>
                        <span className="text-xs font-semibold" style={{ color: editor.textColor }}>Midtrans Payment Gateway</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                        <span className="text-xs text-gray-600">Total</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                          Rp {selectedTemplateForPurchase.price?.toLocaleString('id-ID') || '0'}
                        </span>
                      </div>
                      <p className="text-[10px] mt-2 text-gray-500">
                        Pembayaran otomatis via Midtrans. Mendukung berbagai metode (BCA, Mandiri, GoPay, OVO, dll).
                      </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Nama Lengkap *</label>
                        <input
                          type="text"
                          id="nameInput"
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Email *</label>
                        <input
                          type="email"
                          id="emailInput"
                          placeholder="email@example.com"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>No. WhatsApp *</label>
                        <input
                          type="tel"
                          id="phoneInput"
                          placeholder="08xxxxxxxxxx"
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                          style={{ borderColor: '#E5E7EB' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: editor.textColor }}>Catatan (Opsional)</label>
                        <textarea
                          id="notesInput"
                          placeholder="Catatan tambahan untuk pesanan Anda"
                          rows={3}
                          className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 resize-none"
                          style={{ borderColor: '#E5E7EB' }}
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mt-5 mb-5 border border-purple-100">
                      <h4 className="text-xs font-semibold mb-2 text-purple-900">Instruksi Pembayaran</h4>
                      <div className="text-[11px] space-y-1.5 text-purple-800">
                        <p>1. Klik tombol &quot;Pesan Sekarang&quot; untuk membuka Midtrans payment popup</p>
                        <p>2. Pilih metode pembayaran yang tersedia (BCA, Mandiri, GoPay, OVO, dll)</p>
                        <p>3. Selesaikan pembayaran di popup Midtrans</p>
                        <p>4. Konfirmasi pesanan akan dikirim otomatis via email</p>
                      </div>
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={isLoading}
                      className="w-full text-white py-4 rounded-xl hover:opacity-90 transition-all font-medium text-sm disabled:opacity-50 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] shadow-lg"
                    >
                      {isLoading ? 'Memproses...' : 'Pesan Sekarang'}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Digital Product Detail Modal */}
      {selectedDigitalProduct && (
        <DigitalProductDetailModal
          product={{
            id: selectedDigitalProduct.id,
            title: selectedDigitalProduct.title,
            description: selectedDigitalProduct.description || null,
            price: selectedDigitalProduct.price,
            originalPrice: selectedDigitalProduct.originalPrice || null,
            badge: selectedDigitalProduct.badge || null,
            thumbnail: selectedDigitalProduct.thumbnail,
            previewUrl: selectedDigitalProduct.previewUrl || null,
            previewImages: selectedDigitalProduct.previewImages || [],
            downloadUrl: selectedDigitalProduct.downloadUrl || '',
            category: selectedDigitalProduct.category || '',
            subCategory: selectedDigitalProduct.subCategory || null,
            productType: selectedDigitalProduct.productType || null,
            contentCategory: selectedDigitalProduct.contentCategory || null,
            features: selectedDigitalProduct.features || [],
          }}
          isOpen={isDigitalProductDetailOpen}
          onClose={() => setIsDigitalProductDetailOpen(false)}
          showAddButton={false}
          onPurchase={() => {
            setSelectedTemplateForPurchase(selectedDigitalProduct);
            setIsDigitalProductDetailOpen(false);
            setPurchaseModalOpen(true);
          }}
          showPurchaseButton={true}
        />
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={{
            id: selectedTemplate.id,
            title: selectedTemplate.title,
            description: selectedTemplate.description || null,
            price: selectedTemplate.price,
            originalPrice: selectedTemplate.originalPrice || null,
            badge: selectedTemplate.badge || null,
            thumbnail: selectedTemplate.thumbnail,
            previewUrl: selectedTemplate.previewUrl || null,
            previewImages: selectedTemplate.previewImages || [],
            downloadUrl: selectedTemplate.downloadUrl || '',
            category: selectedTemplate.category || '',
            subCategory: selectedTemplate.subCategory || null,
            features: selectedTemplate.features || [],
          }}
          isOpen={isTemplateDetailOpen}
          onClose={() => setIsTemplateDetailOpen(false)}
          onPurchase={() => {
            setSelectedTemplateForPurchase(selectedTemplate);
            setIsTemplateDetailOpen(false);
            setPurchaseModalOpen(true);
          }}
          showPurchaseButton={true}
        />
      )}

      {/* Payment Success Modal */}
      {paymentSuccessModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPaymentSuccessModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              {/* Success Icon Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                Pembayaran Berhasil!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6 text-sm leading-relaxed"
              >
                Pesanan Anda telah berhasil diproses. Informasi lebih lanjut akan dikirim ke email Anda.
              </motion.p>

              {/* Close Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setPaymentSuccessModalOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Tutup
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
