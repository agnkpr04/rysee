"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { User, Home, Package, BarChart3, Share2, DollarSign, Copy, Crown, X, Download, AlertCircle, LayoutGrid, CheckCircle, XCircle, Clock, Search, Lock, Globe, ExternalLink, Plus, MoreVertical } from 'lucide-react';
import ReferralQRCode from '@/components/ReferralQRCode';
import BioSettings from './dashboard/BioSettings';
import KontenKitSection from './dashboard/KontenKitSection';
import DashboardHeader from './dashboard/DashboardHeader';
import AnalyticsSection from './dashboard/AnalyticsSection';
import CategoryFilter from './dashboard/CategoryFilter';
import ProductList from './dashboard/ProductList';
import EmptyState from './dashboard/EmptyState';
import ShareModal from './dashboard/ShareModal';
import { CATEGORY_NAMES } from '@/lib/categories';
import { getCommissionRate, getTemplateCommissionRate } from '@/lib/membership-config';
import UnifiedFilter from './UnifiedFilter';

interface UserStoreSectionProps {
  userId: string;
  userName: string;
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
}

export default function UserStoreSection({ userId, userName, initialStoreData }: UserStoreSectionProps) {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'referral' | 'earnings' | 'bio' | 'konten-kit'>('products');
  const [productType, setProductType] = useState<'shopee' | 'templates' | 'digital'>('digital');
  const [isPremium, setIsPremium] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [downloadStatus, setDownloadStatus] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({});
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    totalProducts: 0,
    clicksByProduct: [],
    recentClicks: [],
    totalStoreVisits: 0,
    storeVisitsLast7Days: 0,
    storeVisitsLast30Days: 0,
    plan: 'free',
    canViewAdvancedAnalytics: false
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [activeGranularCategory, setActiveGranularCategory] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Independent filter states for each product type
  const [shopeeCategory, setShopeeCategory] = useState('All');
  const [shopeeSubCategory, setShopeeSubCategory] = useState('All');
  const [shopeeGranularCategory, setShopeeGranularCategory] = useState('All');
  const [shopeePlatform, setShopeePlatform] = useState('All');
  const [shopeeSearchQuery, setShopeeSearchQuery] = useState('');

  const [templateCategory, setTemplateCategory] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');

  const [activeDigitalProductType, setActiveDigitalProductType] = useState('');
  const [activeDigitalProductCategory, setActiveDigitalProductCategory] = useState('');
  const [digitalProductSearchQuery, setDigitalProductSearchQuery] = useState('');

  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [editLinkStatus, setEditLinkStatus] = useState<{loading: boolean; success: boolean; message: string}>({
    loading: false,
    success: false,
    message: ''
  });
  const [profileFrameType, setProfileFrameType] = useState<string>(initialStoreData?.profileFrameType || 'none');
  const [frameThickness, setFrameThickness] = useState<number>(initialStoreData?.frameThickness || 2);
  const [accentColor, setAccentColor] = useState<string>(initialStoreData?.accentColor || '#8B5CF6');
  const [eliteBadgeColor, setEliteBadgeColor] = useState<string>('crimson');
  const [referralCode, setReferralCode] = useState('');
  // Bio page settings
  const [bioDescription, setBioDescription] = useState('');
  const [bioStoreUrl, setBioStoreUrl] = useState('');
  const [bioReferralUrl, setBioReferralUrl] = useState('');
  const [bioEnabled, setBioEnabled] = useState(true);
  const [showStoreButton, setShowStoreButton] = useState(true);
  const [showReferralButton, setShowReferralButton] = useState(true);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    referralEarnings: 0,
    activeReferrals: 0,
    availableBalance: 0,
    templateEarnings: 0,
    digitalProductEarnings: 0,
    referrals: [] as any[],
  });
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [userTemplates, setUserTemplates] = useState<any[]>([]);
  const [userDigitalProducts, setUserDigitalProducts] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingDigitalProducts, setIsLoadingDigitalProducts] = useState(false);
  const [affiliateOrders, setAffiliateOrders] = useState({
    templateOrders: [] as any[],
    digitalProductOrders: [] as any[]
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchUserTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserTemplates([]);
        return;
      }

      const res = await fetch('/api/user-templates', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserTemplates(data.userTemplates || []);
      } else {
        setUserTemplates([]);
      }
    } catch (err) {
      console.error("Failed to load user templates", err);
      setUserTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const fetchUserDigitalProducts = async () => {
    setIsLoadingDigitalProducts(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserDigitalProducts([]);
        return;
      }

      const res = await fetch('/api/user-digital-products', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserDigitalProducts(data.userDigitalProducts || []);
      } else {
        setUserDigitalProducts([]);
      }
    } catch (err) {
      console.error("Failed to load user digital products", err);
      setUserDigitalProducts([]);
    } finally {
      setIsLoadingDigitalProducts(false);
    }
  };

  const handleDeleteTemplate = async (masterTemplateId: string) => {
    if (!confirm('Are you sure you want to remove this template?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/user-templates?masterTemplateId=${masterTemplateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
      });

      if (res.ok) {
        setUserTemplates((prev: any[]) => prev.filter((item: any) => item.masterTemplateId !== masterTemplateId));
      } else if (res.status === 401) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  const handleDeleteDigitalProduct = async (masterDigitalProductId: string) => {
    if (!confirm('Are you sure you want to remove this digital product?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/user-digital-products?masterDigitalProductId=${masterDigitalProductId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
      });

      if (res.ok) {
        setUserDigitalProducts((prev: any[]) => prev.filter((item: any) => item.masterDigitalProductId !== masterDigitalProductId));
      } else if (res.status === 401) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Error deleting digital product:', err);
    }
  };

  // Load from cache on client-side only (after mount) - for instant display
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedUserPlan = localStorage.getItem('userPlan');
      const cachedAvatarUrl = localStorage.getItem('userAvatar');
      const cachedIsPremium = localStorage.getItem('userIsPremium');
      const cachedUsername = localStorage.getItem('username');
      const cachedFullName = localStorage.getItem('userFullName');

      console.log('[UserStoreSection] Loading from cache:', { cachedUserPlan, cachedAvatarUrl: !!cachedAvatarUrl, cachedIsPremium, cachedUsername, cachedFullName });

      // Always set from cache if available for instant display
      if (cachedUserPlan) setUserPlan(cachedUserPlan);
      if (cachedAvatarUrl) setUserAvatar(cachedAvatarUrl);
      if (cachedIsPremium) setIsPremium(cachedIsPremium === 'true');
      if (cachedUsername) setUsername(cachedUsername);
      if (cachedFullName) setFullName(cachedFullName);
    }
  }, []);

  // Refresh membership without full page reload
  const refreshMembership = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const res = await fetch('/api/membership/status', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const premium = data.isPremium === true;
        const plan = data.plan || 'free';
        setIsPremium(premium);
        setUserPlan(plan);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userPlan', plan);
          localStorage.setItem('userIsPremium', String(premium));
        }
      }
    } catch (err) {
      console.error('[refreshMembership] Failed:', err);
    }
  };

  // Visibility change + polling: auto-refresh membership when user returns to tab or every 3 min
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshMembership();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = setInterval(refreshMembership, 3 * 60 * 1000);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [userId]);

  // Don't load from cache - show loading state until fresh data is fetched
  // This prevents showing stale/guest data before refresh

  // Fetch initial data (user, membership, products, ranking) on mount - lighter load for mobile
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchInitialData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // Check if user is authenticated
        if (!session?.user) {
          console.error('[UserStoreSection] No session found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        // Check if the logged-in user is viewing their own profile
        if (session.user.id !== userId) {
          console.error('[UserStoreSection] User is not the owner of this profile, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('[UserStoreSection] Session validated, fetching data for user:', userId);

        // Helper function for retry logic
        const fetchWithRetry = async (url: string, options?: RequestInit, maxRetries = 3): Promise<Response> => {
          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              const response = await fetch(url, {
                ...options,
                signal: abortController.signal
              });
              if (response.ok) {
                return response;
              }
              console.warn(`[UserStoreSection] Fetch attempt ${attempt + 1} failed for ${url}, status: ${response.status}`);
              if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); // Exponential backoff
              }
            } catch (error: unknown) {
              if (error instanceof Error && error.name === 'AbortError') {
                console.log('[UserStoreSection] Request aborted');
                throw error;
              }
              console.warn(`[UserStoreSection] Fetch attempt ${attempt + 1} error for ${url}:`, error);
              if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
              }
            }
          }
          throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
        };

        // Fetch essential data on mount (user, membership, products) with retry logic
        console.log('[UserStoreSection] Fetching API calls...');
        const [userRes, membershipRes, productsRes] = await Promise.all([
          fetchWithRetry(`/api/auth/user?id=${userId}`),
          fetchWithRetry('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session?.access_token || ''}`,
            },
          }),
          fetchWithRetry(`/api/user-products?userId=${userId}&limit=1000`),
        ]);
        console.log('[UserStoreSection] API responses:', { userRes: userRes.status, membershipRes: membershipRes.status, productsRes: productsRes.status });

        // Set user avatar (use storeLogo first, fallback to avatar_url)
        if (userRes?.ok) {
          const userData = await userRes.json();
          console.log('[UserStoreSection] User data received:', userData);
          if (!userData.user) {
            console.error('[UserStoreSection] User data is null/undefined');
            // Use cache instead of throwing error
            const cachedAvatar = typeof window !== 'undefined' ? localStorage.getItem('userAvatar') : '';
            setUserAvatar(cachedAvatar || '');
            console.warn('[UserStoreSection] Using cached avatar data');
          } else {
            const avatar = userData.user?.storeLogo || userData.user?.avatar_url;
            setUserAvatar(avatar || '');
            console.log('[UserStoreSection] Avatar set:', avatar);
            // Set username
            if (userData.user?.username) {
              setUsername(userData.user.username);
              console.log('[UserStoreSection] Username set:', userData.user.username);
            }
            // Set full name
            if (userData.user?.name) {
              setFullName(userData.user.name);
              console.log('[UserStoreSection] Full name set:', userData.user.name);
            }
            // Save to cache
            if (typeof window !== 'undefined') {
              if (avatar) localStorage.setItem('userAvatar', avatar);
              if (userData.user?.username) localStorage.setItem('username', userData.user.username);
              if (userData.user?.name) localStorage.setItem('userFullName', userData.user.name);
            }
            // Set profile frame settings
            if (userData.user?.storeTheme) {
              setProfileFrameType(userData.user.storeTheme.profileFrameType || 'none');
              setFrameThickness(userData.user.storeTheme.frameThickness || 2);
              setAccentColor(userData.user.storeTheme.accentColor || '#8B5CF6');
              setEliteBadgeColor(userData.user.storeTheme.eliteBadgeColor || 'crimson');
            }
            // Set bio page settings
            setBioDescription(userData.user?.bioDescription || '');
            setBioStoreUrl(userData.user?.bioStoreUrl || '');
            setBioReferralUrl(userData.user?.bioReferralUrl || '');
            setBioEnabled(userData.user?.bioEnabled ?? true);
            setShowStoreButton(userData.user?.showStoreButton ?? true);
            setShowReferralButton(userData.user?.showReferralButton ?? true);
          }
        } else {
          console.error('[UserStoreSection] User fetch failed:', userRes?.status);
          // Use cache instead of throwing error
          const cachedAvatar = typeof window !== 'undefined' ? localStorage.getItem('userAvatar') : '';
          const cachedUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : '';
          setUserAvatar(cachedAvatar || '');
          setUsername(cachedUsername || '');
          console.warn('[UserStoreSection] Using cached user data due to fetch failure');
        }

        // Set membership status - critical for business logic
        if (membershipRes.ok) {
          const membershipData = await membershipRes.json();
          // Validate membership data structure
          const isPremium = membershipData.isPremium === true;
          const plan = membershipData.plan || 'free';

          setIsPremium(isPremium);
          setUserPlan(plan);
          // Update analytics based on plan
          setAnalytics(prev => ({
            ...prev,
            plan: plan,
            canViewAdvancedAnalytics: isPremium || plan === 'premium'
          }));
          // Save to cache (always update with fresh data)
          if (typeof window !== 'undefined') {
            localStorage.setItem('userPlan', plan);
            localStorage.setItem('userIsPremium', String(isPremium));
          }
        } else {
          console.error('[UserStoreSection] Membership check failed:', membershipRes.status);
          // Don't throw error for membership check - use cached data or default to free gracefully
          // This prevents the entire page from failing to load due to membership API issues
          const cachedPlan = typeof window !== 'undefined' ? localStorage.getItem('userPlan') : null;
          const cachedIsPremium = typeof window !== 'undefined' ? localStorage.getItem('userIsPremium') === 'true' : false;
          
          setUserPlan(cachedPlan || 'free');
          setIsPremium(cachedIsPremium);
          console.warn('[UserStoreSection] Using cached membership data:', { plan: cachedPlan, isPremium: cachedIsPremium });
        }

        // Set products - critical for business logic
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // Always use products array from consistent API response
          const products = productsData.products || [];
          console.log('[UserStoreSection] Products loaded:', products.length);
          setProducts(products);
        } else if (productsRes.status === 401) {
          console.error('[UserStoreSection] Products fetch unauthorized (401)');
          router.push('/auth/login');
          return;
        } else {
          console.error('[UserStoreSection] Products fetch failed:', productsRes.status);
          // Don't throw error - set empty products instead
          setProducts([]);
          console.warn('[UserStoreSection] Using empty products array due to fetch failure');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('[UserStoreSection] Request aborted, component unmounted');
          return;
        }
        console.error('[UserStoreSection] Failed to fetch initial data:', err);
        // Don't show alert to user - use cache/fallbacks instead
        // This prevents breaking the entire page due to temporary API issues
        console.warn('[UserStoreSection] Using fallback data due to fetch error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Cleanup function to abort requests when component unmounts
    return () => {
      abortController.abort();
    };
  }, [userId, router]);

  // Fetch referral data
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchReferralData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const res = await fetch('/api/referral/earnings', {
            headers: {
              'Authorization': `Bearer ${session.access_token || ''}`,
            },
            signal: abortController.signal
          });
          if (res.ok) {
            const data = await res.json();
            setReferralCode(data.referralCode || '');
            setReferralStats({
              totalReferrals: data.totalReferrals || 0,
              totalEarnings: data.totalEarnings || 0,
              referralEarnings: data.referralEarnings || 0,
              activeReferrals: data.activeReferrals || 0,
              availableBalance: data.availableBalance || 0,
              templateEarnings: data.templateEarnings || 0,
              digitalProductEarnings: data.digitalProductEarnings || 0,
              referrals: data.referrals || [],
            });
            setWithdrawHistory(data.withdrawRequests || []);
            // Auto-fill withdraw form with saved payment method
            if (data.savedPaymentMethod) {
              setWithdrawForm(prev => ({
                ...prev,
                bankName: data.savedPaymentMethod.bankName || prev.bankName,
                accountNumber: data.savedPaymentMethod.accountNumber || prev.accountNumber,
                accountName: data.savedPaymentMethod.accountName || prev.accountName,
              }));
            }
          }
        }
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          console.error('[UserStoreSection] Failed to fetch referral data:', err);
        }
      }
    };

    fetchReferralData();

    return () => {
      abortController.abort();
    };
  }, []);

  // Fetch withdrawal history
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchWithdrawHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setWithdrawHistory([]);
          return;
        }

        const res = await fetch('/api/withdraw/history', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          signal: abortController.signal
        });
        if (res.ok) {
          const data = await res.json();
          setWithdrawHistory(data.withdrawals || []);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error fetching withdrawal history:', err);
          setWithdrawHistory([]);
        }
      }
    };

    fetchWithdrawHistory();

    return () => abortController.abort();
  }, []);

  // Fetch affiliate orders
  useEffect(() => {
    const abortController = new AbortController();

    const fetchAffiliateOrders = async () => {
      console.log('[UserStoreSection] Fetching affiliate orders, activeTab:', activeTab);
      setIsLoadingOrders(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[UserStoreSection] Session for affiliate orders:', session?.user?.id);
        if (session?.user) {
          const res = await fetch('/api/affiliate-orders', {
            headers: {
              'Authorization': `Bearer ${session.access_token || ''}`,
            },
            signal: abortController.signal
          });
          console.log('[UserStoreSection] Affiliate orders API response:', res.status);
          if (res.ok) {
            const data = await res.json();
            console.log('[UserStoreSection] Affiliate orders data:', data);
            setAffiliateOrders({
              templateOrders: data.templateOrders || [],
              digitalProductOrders: data.digitalProductOrders || [],
            });
          } else {
            console.error('[UserStoreSection] Affiliate orders API failed:', res.status);
          }
        }
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          console.error('[UserStoreSection] Failed to fetch affiliate orders:', err);
        }
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchAffiliateOrders();

    return () => {
      abortController.abort();
    };
  }, [activeTab]);

  // Window focus listener to refresh data when user returns from settings
  useEffect(() => {
    const handleFocus = async () => {
      console.log('[UserStoreSection] Window focused, refreshing data...');
      // Trigger a refresh by re-running the initial data fetch
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && session.user.id === userId) {
        // Refresh user data from database
        fetch(`/api/auth/user?id=${userId}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.user) {
              const avatar = data.user?.storeLogo || data.user?.avatar_url;
              setUserAvatar(avatar || '');
              if (data.user?.username) {
                setUsername(data.user.username);
              }
              if (typeof window !== 'undefined' && avatar) {
                localStorage.setItem('userAvatar', avatar);
              }
            }
          })
          .catch(err => console.error('[UserStoreSection] Failed to refresh user data:', err));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId]);

  // Fetch templates and digital products when products tab is active
  useEffect(() => {
    if (activeTab === 'products') {
      fetchUserTemplates();
      fetchUserDigitalProducts();
    }
  }, [activeTab]);

  // Auto-switch to first available product type if current type is empty
  useEffect(() => {
    if (activeTab === 'products') {
      // Only digital products now
      if (productType === 'digital' && userDigitalProducts.length === 0) {
        // No auto-switch needed
      }
    }
  }, [products, userTemplates, userDigitalProducts, productType, activeTab]);

  // Listen for profile updates from settings page
  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Clear only avatar cache to force refresh, keep other data intact
          if (typeof window !== 'undefined') {
            const { data: { session: sessionForClear } } = await supabase.auth.getSession();
            if (sessionForClear?.user) {
              localStorage.removeItem(`storeAvatar_${sessionForClear.user.id}`);
              localStorage.removeItem('username'); // Clear username cache to force refresh from database
              localStorage.removeItem('userFullName'); // Clear full name cache to force refresh from database
              // Don't clear userName, userPlan, userIsPremium as they are needed for page loading
            }
          }
          // Refresh user data
          const userData = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (userData.ok) {
            const data = await userData.json();
            if (data.user?.username) {
              setUsername(data.user.username);
            }
            if (data.user?.name) {
              setFullName(data.user.name);
            }
            const avatar = data.user?.storeLogo || data.user?.avatar_url || '';
            setUserAvatar(avatar);
            // Sync profile frame settings from storeTheme
            if (data.user?.storeTheme) {
              setProfileFrameType(data.user.storeTheme.profileFrameType || 'none');
              setFrameThickness(data.user.storeTheme.frameThickness || 2);
              setAccentColor(data.user.storeTheme.accentColor || '#8B5CF6');
            }
          }

          // Refresh membership status
          const membershipData = await fetch('/api/membership/status', {
            headers: {
              'Authorization': `Bearer ${session.access_token || ''}`,
            },
          });
          if (membershipData.ok) {
            const membership = await membershipData.json();
            const isPremium = membership.isPremium === true;
            const plan = membership.plan || 'free';
            setIsPremium(isPremium);
            setUserPlan(plan);
            // Update cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('userPlan', plan);
              localStorage.setItem('userIsPremium', String(isPremium));
            }
          }
        }
      } catch (err) {
        console.error('[UserStoreSection] Failed to refresh user data on profile update:', err);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [userId, router]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesCategory = shopeeCategory === 'All' || product.product?.category === shopeeCategory;
      const matchesSubCategory = shopeeSubCategory === 'All' || !shopeeSubCategory || product.product?.subCategory === shopeeSubCategory;
      const matchesGranularCategory = shopeeGranularCategory === 'All' || !shopeeGranularCategory || product.product?.granularCategory === shopeeGranularCategory;
      const matchesSearch = shopeeSearchQuery === '' || product.product?.title?.toLowerCase().includes(shopeeSearchQuery.toLowerCase());
      const matchesPlatform = shopeePlatform === 'All' ||
        (shopeePlatform === 'Shopee' && (product.product?.shopeeLink || product.product?.productUrl?.includes('shopee'))) ||
        (shopeePlatform === 'TikTok' && (product.product?.tiktokLink || product.product?.productUrl?.includes('tiktok')));
      return matchesCategory && matchesSubCategory && matchesGranularCategory && matchesSearch && matchesPlatform;
    });
  }, [products, shopeeCategory, shopeeSubCategory, shopeeGranularCategory, shopeeSearchQuery, shopeePlatform]);

  const filteredDigitalProducts = useMemo(() => {
    return userDigitalProducts.filter((item: any) => {
      const matchesSearch = digitalProductSearchQuery === '' || item.masterDigitalProduct?.title?.toLowerCase().includes(digitalProductSearchQuery.toLowerCase());
      const matchesProductType = activeDigitalProductType === '' || item.masterDigitalProduct?.productType === activeDigitalProductType;
      const matchesCategory = activeDigitalProductCategory === '' || item.masterDigitalProduct?.category === activeDigitalProductCategory;
      return matchesSearch && matchesProductType && matchesCategory;
    });
  }, [userDigitalProducts, digitalProductSearchQuery, activeDigitalProductType, activeDigitalProductCategory]);

  const categories = ['All', ...CATEGORY_NAMES.filter(cat => cat !== 'Men')];

  // Predefined digital product type options
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

  // Build digital product types dynamically based on user's digital products
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
  }, [userDigitalProducts, digitalProductTypeOptions]);

  // Build digital product categories dynamically based on selected productType
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
  }, [userDigitalProducts, activeDigitalProductType, digitalProductCategoryOptions]);
  
  // Determine available platforms dynamically
  const hasShopee = products.some((product: any) => product.product?.shopeeLink || product.product?.productUrl?.includes('shopee'));
  const hasTikTok = products.some((product: any) => product.product?.tiktokLink || product.product?.productUrl?.includes('tiktok'));
  const platforms = [];
  if (hasShopee && hasTikTok) {
    platforms.push('All', 'Shopee', 'TikTok');
  } else if (hasShopee) {
    platforms.push('Shopee');
  } else if (hasTikTok) {
    platforms.push('TikTok');
  }

  // Show loading state until all data is fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Delete product - Session:', session);
      console.log('Delete product - ProductId:', productId);

      const res = await fetch('/api/user-products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ productId }),
      });

      console.log('Delete product - Response status:', res.status);
      const responseData = await res.json();
      console.log('Delete product - Response data:', responseData);
      if (res.ok) {
        // Update products state locally for immediate count update
        setProducts((prevProducts: any[]) => prevProducts.filter((item: any) => item.productId !== productId));
      } else if (res.status === 401) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleToggleSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedProducts.size} product(s)?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const productIds = Array.from(selectedProducts);

      const res = await fetch('/api/user-products/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ productIds }),
      });

      if (res.ok) {
        // Update products state locally for immediate count update
        setProducts((prevProducts: any[]) => prevProducts.filter((item: any) => !selectedProducts.has(item.productId)));
        setSelectedProducts(new Set());
        setIsSelectionMode(false);
      } else if (res.status === 401) {
        router.push('/auth/login');
      } else {
        alert('Failed to delete some products. Please try again.');
      }
    } catch (err) {
      console.error('Error bulk deleting products:', err);
      alert('Failed to delete products. Please try again.');
    }
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedProducts(new Set());
  };

  const handleEditLink = async (productId: string, newLink: string) => {
    setEditLinkStatus({ loading: true, success: false, message: '' });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/user-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          productId,
          affiliateLink: newLink,
        }),
      });
      if (res.ok) {
        const userRes = await fetch(`/api/user-products?userId=${userId}&limit=1000`);
        if (userRes.ok) {
          const data = await userRes.json();
          setProducts(data.products || []);
          setEditLinkStatus({ loading: false, success: true, message: 'Link updated successfully!' });
          setTimeout(() => setEditLinkStatus({ loading: false, success: false, message: '' }), 2000);
        }
      } else if (res.status === 401) {
        setEditLinkStatus({ loading: false, success: false, message: 'Session expired' });
        router.push('/auth/login');
      } else {
        const errorData = await res.json();
        setEditLinkStatus({ loading: false, success: false, message: errorData.error || 'Failed to update link' });
      }
    } catch (err) {
      console.error('Error editing link:', err);
      setEditLinkStatus({ loading: false, success: false, message: 'Network error' });
    }
  };

  const handleDownload = async (assetUrl: string, productId: string) => {
    console.log('handleDownload called', { assetUrl, productId });
    setDownloadStatus(prev => ({ ...prev, [productId]: 'loading' }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ assetUrl }),
      });
      console.log('Download API response status:', res.status);
      
      // Detect if file is a video
      const isVideo = /\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i.test(assetUrl);
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(assetUrl);
      
      // Detect platform
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isVideo) {
        // For videos, API returns binary file directly (with proper handling)
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Download API error:', errorText);
          setDownloadStatus(prev => ({ ...prev, [productId]: 'error' }));
          return;
        }
        
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Extract filename with extension from URL
        const urlParts = assetUrl.split('/');
        const filename = urlParts[urlParts.length - 1] || `video-${Date.now()}.mp4`;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setDownloadStatus(prev => ({ ...prev, [productId]: 'success' }));
        setTimeout(() => setDownloadStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
      } else {
        // For images and other files, API returns JSON with downloadUrl
        const responseText = await res.text();
        console.log('Download API response text:', responseText);
        
        if (res.ok) {
          const data = JSON.parse(responseText);
          console.log('Download API response data:', data);
          
          if (isImage) {
            if (isIOS) {
              // For iOS: open in new tab (user can long press to save)
              window.open(data.downloadUrl, '_blank');
            } else {
              // For Android/PC: use blob download to trigger direct download
              const fileRes = await fetch(data.downloadUrl);
              const blob = await fileRes.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              
              // Extract filename with extension from URL
              const urlParts = data.downloadUrl.split('/');
              const filename = urlParts[urlParts.length - 1] || `asset-${Date.now()}`;
              a.download = filename;
              
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }
          } else {
            // For PDFs and other files, use window.open
            window.open(data.downloadUrl, '_blank');
          }
          
          setDownloadStatus(prev => ({ ...prev, [productId]: 'success' }));
          setTimeout(() => setDownloadStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
        } else {
          console.error('Download API error:', responseText);
          setDownloadStatus(prev => ({ ...prev, [productId]: 'error' }));
        }
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus(prev => ({ ...prev, [productId]: 'error' }));
    }
  };

  const storeUrl = username ? `rysee.my.id/${username}` : `rysee.my.id/user/${userId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-neutral-900 antialiased selection:bg-purple-100">
      {/* Header with shadowless, clean border - Full width */}
      <div className="bg-white border-b border-neutral-100">
        <DashboardHeader
          isPremium={isPremium}
          userPlan={userPlan}
          userId={userId}
          userName={userName}
          fullName={fullName}
          userAvatar={userAvatar || ''}
          username={username}
          onShare={() => setIsShareOpen(true)}
          profileFrameType={profileFrameType}
          frameThickness={frameThickness}
          accentColor={accentColor}
          onUpgradeModalOpen={() => setIsUpgradeModalOpen(true)}
          onBioClick={() => setActiveTab('bio')}
          onKontenKitClick={() => setActiveTab('konten-kit')}
          eliteBadgeColor={eliteBadgeColor}
          activeTab={activeTab}
        />
      </div>

      {/* Tab Navigation - Desktop Only */}
      <div className="hidden md:block w-full px-8 bg-white border-b border-neutral-100">
        <div className="flex justify-center">
          <div className="flex w-full md:w-full justify-around md:gap-12 max-w-[1400px] mx-auto md:mx-0 md:px-0">
            <Link
              href="/"
              className={`flex items-center gap-2 px-6 py-4 md:px-8 md:py-4 text-[12px] font-light uppercase tracking-[0.1em] transition-all relative text-neutral-400 hover:text-neutral-600`}
            >
              <Home size={16} strokeWidth={2} />
              <span className="hidden md:inline">Home</span>
              <span className="md:hidden text-[10px]">Home</span>
            </Link>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-4 md:px-8 md:py-4 text-[12px] font-light uppercase tracking-[0.1em] transition-all relative ${
                activeTab === 'products' ? 'text-[#8B5CF6]' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <LayoutGrid size={16} strokeWidth={activeTab === 'products' ? 2.5 : 2} />
              <span className="hidden md:inline">Produk Saya</span>
              <span className="md:hidden text-[10px]">Produk</span>
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center gap-2 px-6 py-4 md:px-8 md:py-4 text-[12px] font-light uppercase tracking-[0.1em] transition-all relative ${
                activeTab === 'earnings' ? 'text-[#8B5CF6]' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <DollarSign size={16} strokeWidth={activeTab === 'earnings' ? 2.5 : 2} />
              <span className="hidden md:inline">Earnings</span>
              <span className="md:hidden text-[10px]">Earn</span>
            </button>
            {/* Analytics Tab - Hidden for now
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-4 md:px-8 md:py-4 text-[12px] font-light uppercase tracking-[0.1em] transition-all relative ${
                activeTab === 'analytics' ? 'text-[#8B5CF6]' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <BarChart3 size={16} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
              <span className="hidden md:inline">Analytics</span>
              <span className="md:hidden text-[10px]">Data</span>
            </button>
            */}
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-2 px-6 py-4 md:px-8 md:py-4 text-[12px] font-light uppercase tracking-[0.1em] transition-all relative ${
                activeTab === 'referral' ? 'text-[#8B5CF6]' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <User size={16} strokeWidth={activeTab === 'referral' ? 2.5 : 2} />
              <span className="hidden md:inline">Referral</span>
              <span className="md:hidden text-[10px]">Ref</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full px-8 py-4 md:py-8 pb-20 md:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            {/* Analytics Tab - Hidden for now
            {activeTab === 'analytics' ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-neutral-100 p-1 min-h-[500px] overflow-y-auto">
                  <AnalyticsSection
                    isOpen={true}
                    onToggle={() => {}}
                    analytics={analytics}
                    isLoading={isLoadingAnalytics}
                  />
                </div>
              </motion.div>
            ) : */}

            {activeTab === 'products' ? (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Product Type Toggle - Segmented Control */}
                <div className="z-30 bg-[#F9F9FB] py-4 border-b border-gray-100 sticky top-0">
                  <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                    {/* {products.length > 0 && (
                      <button
                        onClick={() => setProductType('shopee')}
                        className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-4 py-2 rounded ${
                          productType === 'shopee' ? `bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                        }`}
                      >
                        Shopee
                      </button>
                    )} */}
                    {userTemplates.length > 0 && (
                      <button
                        onClick={() => setProductType('templates')}
                        className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-4 py-2 rounded ${
                          productType === 'templates' ? `bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                        }`}
                      >
                        Website
                      </button>
                    )}
                    {userDigitalProducts.length > 0 && (
                      <button
                        onClick={() => setProductType('digital')}
                        className={`text-[11px] tracking-wider transition-all whitespace-nowrap font-light px-4 py-2 rounded ${
                          productType === 'digital' ? `bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white` : 'text-[#A1A1AA] hover:text-[#18181B]'
                        }`}
                      >
                        Digital
                      </button>
                    )}
                  </div>
                </div>

                {/* Shopee Products Section */}
                {/* {productType === 'shopee' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg md:text-xl font-light text-[#18181B]">Products Shopee</h2>
                      <a
                        href="/affstore"
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-xs md:text-sm font-light hover:opacity-90 transition"
                      >
                        +Produk
                      </a>
                    </div>

                    <div className="z-20 bg-[#F9F9FB] py-4">
                      <UnifiedFilter
                        products={products}
                        templates={userTemplates}
                        digitalProducts={userDigitalProducts}
                        availableProductCategories={categories}
                        availableTemplateCategories={[]}
                        availableDigitalProductCategories={[]}
                        availableDigitalProductSubCategories={[]}
                        activeTab="all"
                        productCategory={shopeeCategory}
                        productSubCategory={shopeeSubCategory}
                        productGranularCategory={shopeeGranularCategory}
                        templateCategory=""
                        digitalProductCategory=""
                        digitalProductSubCategory=""
                        searchQuery={shopeeSearchQuery}
                        onTabChange={() => {}}
                        onProductCategoryChange={setShopeeCategory}
                        onProductSubCategoryChange={setShopeeSubCategory}
                        onProductGranularCategoryChange={setShopeeGranularCategory}
                        onTemplateCategoryChange={() => {}}
                        onDigitalProductCategoryChange={() => {}}
                        onDigitalProductSubCategoryChange={() => {}}
                        onSearchChange={setShopeeSearchQuery}
                        accentColor="#8B5CF6"
                        textColor="#A1A1AA"
                        themeColor="#8B5CF6"
                        hideTypeTabs={true}
                        useGradient={true}
                      />
                    </div>

                    <div className="min-h-[400px]">
                      {filteredProducts.length > 0 ? (
                        <ProductList
                          products={filteredProducts}
                          downloadStatus={downloadStatus}
                          userId={userId}
                          onDownload={handleDownload}
                          onDelete={handleDeleteProduct}
                          onEditLink={handleEditLink}
                          editLinkStatus={editLinkStatus}
                          activePlatform={shopeePlatform}
                          isSelectionMode={isSelectionMode}
                          selectedProducts={selectedProducts}
                          onToggleSelection={handleToggleSelection}
                          onEnterSelectionMode={() => setIsSelectionMode(true)}
                        />
                      ) : products.length > 0 ? (
                        <EmptyState type="filtered" />
                      ) : (
                        <div className="bg-white rounded-3xl p-12 border border-dashed border-neutral-200 flex flex-col items-center text-center">
                           <EmptyState type="empty" />
                        </div>
                      )}
                    </div>
                  </>
                )} */}

                {/* Templates Section */}
                {productType === 'templates' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg md:text-xl font-light text-[#18181B]">Website</h2>
                      <a
                        href="/templates"
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-xs md:text-sm font-light hover:opacity-90 transition"
                      >
                        +Produk
                      </a>
                    </div>
                    {isLoadingTemplates ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6] mb-4"></div>
                          <p className="text-sm text-[#A1A1AA]">Loading templates...</p>
                        </div>
                      </div>
                    ) : userTemplates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 bg-[#F9F9FB] rounded-full flex items-center justify-center mb-6">
                          <Globe className="w-10 h-10 text-[#A1A1AA]" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-light text-[#18181B] mb-2">Belum ada website</h3>
                        <p className="text-sm text-[#A1A1AA] mb-6 max-w-md text-center">
                          Tambah website dari katalog untuk mulai menjual di toko Anda.
                        </p>
                        <a
                          href="/templates"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-sm font-light hover:opacity-90 transition"
                        >
                          <Globe className="w-4 h-4" strokeWidth={1.5} />
                          Jelajahi Website
                        </a>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {userTemplates.map((userTemplate: any) => (
                          <div key={userTemplate.masterTemplateId} className="bg-white rounded-[1px] shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10">
                              {userTemplate.masterTemplate?.previewImages && userTemplate.masterTemplate.previewImages.length > 0 ? (
                                <img
                                  src={userTemplate.masterTemplate.previewImages[0]}
                                  alt={userTemplate.masterTemplate.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : userTemplate.masterTemplate?.thumbnail && (
                                <img
                                  src={userTemplate.masterTemplate.thumbnail}
                                  alt={userTemplate.masterTemplate.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {userTemplate.masterTemplate?.badge && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm">
                                  {userTemplate.masterTemplate.badge.replace('-', ' ')}
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === `template-${userTemplate.masterTemplateId}` ? null : `template-${userTemplate.masterTemplateId}`)}
                                  className="flex items-center justify-center p-1 text-white hover:opacity-80 transition-opacity"
                                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                                  title="More options"
                                >
                                  <MoreVertical className="w-5 h-5" strokeWidth={2} />
                                </button>
                                <AnimatePresence>
                                  {activeDropdown === `template-${userTemplate.masterTemplateId}` && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute top-7 right-0 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[130px] z-20"
                                    >
                                      {userTemplate.masterTemplate?.previewUrl && (
                                        <a
                                          href={userTemplate.masterTemplate.previewUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => setActiveDropdown(null)}
                                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                                          Preview
                                        </a>
                                      )}
                                      <button
                                        onClick={() => {
                                          handleDeleteTemplate(userTemplate.masterTemplateId);
                                          setActiveDropdown(null);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full"
                                      >
                                        <X className="w-3 h-3" strokeWidth={1.5} />
                                        Hapus
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            <div className="p-2">
                              <h3 className="text-[12px] font-bold text-[#18181B] mb-1 line-clamp-2">{userTemplate.masterTemplate?.title}</h3>
                              {userTemplate.masterTemplate?.description && (
                                <p className="text-[9px] text-gray-600 mb-1 line-clamp-2">{userTemplate.masterTemplate?.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  {userTemplate.masterTemplate?.originalPrice && userTemplate.masterTemplate.originalPrice > userTemplate.masterTemplate.price && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                      Rp {userTemplate.masterTemplate.originalPrice.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                  <p className="text-xs font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                                    Rp {userTemplate.masterTemplate?.price?.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                  {Math.round(getTemplateCommissionRate(userPlan as any) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Digital Products Section */}
                {productType === 'digital' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg md:text-xl font-light text-[#18181B]">Produk Digital</h2>
                      <a
                        href="/digital-products"
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-xs md:text-sm font-light hover:opacity-90 transition"
                      >
                        +Produk
                      </a>
                    </div>

                    {/* Filter */}
                    <div className="z-20 bg-[#F9F9FB] py-4">
                      <UnifiedFilter
                        products={products}
                        templates={userTemplates}
                        digitalProducts={userDigitalProducts}
                        availableProductCategories={[]}
                        availableTemplateCategories={[]}
                        availableDigitalProductCategories={digitalProductTypes}
                        availableDigitalProductSubCategories={digitalProductCategories}
                        activeTab="digital-products"
                        productCategory=""
                        productSubCategory=""
                        productGranularCategory=""
                        templateCategory=""
                        digitalProductCategory={activeDigitalProductType}
                        digitalProductSubCategory={activeDigitalProductCategory}
                        searchQuery={digitalProductSearchQuery}
                        onTabChange={() => {}}
                        onProductCategoryChange={() => {}}
                        onProductSubCategoryChange={() => {}}
                        onProductGranularCategoryChange={() => {}}
                        onTemplateCategoryChange={() => {}}
                        onDigitalProductCategoryChange={(type) => {
                          setActiveDigitalProductType(type);
                          setActiveDigitalProductCategory('');
                        }}
                        onDigitalProductSubCategoryChange={setActiveDigitalProductCategory}
                        onSearchChange={setDigitalProductSearchQuery}
                        accentColor="#8B5CF6"
                        textColor="#A1A1AA"
                        themeColor="#8B5CF6"
                        hideTypeTabs={true}
                      />
                    </div>

                    {isLoadingDigitalProducts ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6] mb-4"></div>
                          <p className="text-sm text-[#A1A1AA]">Loading digital products...</p>
                        </div>
                      </div>
                    ) : filteredDigitalProducts.length === 0 ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <Package className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" strokeWidth={1.5} />
                          <p className="text-sm text-[#A1A1AA]">Tidak ada digital product</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredDigitalProducts.map((userDigitalProduct: any) => (
                          <div key={userDigitalProduct.masterDigitalProductId} className="bg-white rounded-[1px] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-[16/9] relative overflow-hidden">
                              <img
                                src={userDigitalProduct.masterDigitalProduct?.thumbnail}
                                alt={userDigitalProduct.masterDigitalProduct?.title}
                                className="w-full h-full object-cover"
                              />
                              {userDigitalProduct.masterDigitalProduct?.badge && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm">
                                  {userDigitalProduct.masterDigitalProduct.badge.replace('-', ' ')}
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === `digital-${userDigitalProduct.masterDigitalProductId}` ? null : `digital-${userDigitalProduct.masterDigitalProductId}`)}
                                  className="flex items-center justify-center p-1 text-white hover:opacity-80 transition-opacity"
                                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                                  title="More options"
                                >
                                  <MoreVertical className="w-5 h-5" strokeWidth={2} />
                                </button>
                                <AnimatePresence>
                                  {activeDropdown === `digital-${userDigitalProduct.masterDigitalProductId}` && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute top-7 right-0 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[130px] z-20"
                                    >
                                      {userDigitalProduct.masterDigitalProduct?.contentUrl && (
                                        <a
                                          href={userDigitalProduct.masterDigitalProduct.contentUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => setActiveDropdown(null)}
                                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                          <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                                          View Content
                                        </a>
                                      )}
                                      <button
                                        onClick={() => {
                                          handleDeleteDigitalProduct(userDigitalProduct.masterDigitalProductId);
                                          setActiveDropdown(null);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full"
                                      >
                                        <X className="w-3 h-3" strokeWidth={1.5} />
                                        Hapus
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            <div className="p-2">
                              <h3 className="text-[12px] font-medium text-[#18181B] mb-1 line-clamp-2">{userDigitalProduct.masterDigitalProduct?.title}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  {userDigitalProduct.masterDigitalProduct?.originalPrice && userDigitalProduct.masterDigitalProduct.originalPrice > userDigitalProduct.masterDigitalProduct.price && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                      Rp {userDigitalProduct.masterDigitalProduct.originalPrice.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                  <p className="text-xs font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                                    Rp {userDigitalProduct.masterDigitalProduct?.price?.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                  {Math.round(getCommissionRate(userPlan as any) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : activeTab === 'earnings' ? (
              <motion.div
                key="earnings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-neutral-100 p-8 min-h-[500px]">
                  <h2 className="text-2xl font-light text-[#18181B] mb-6">Earnings & Withdrawals</h2>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    {/* Total Penghasilan */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-3 h-3 text-[#8B5CF6]" strokeWidth={1.5} />
                        <span className="text-[10px] text-[#A1A1AA]">Total Penghasilan</span>
                      </div>
                      <p className="text-lg font-light text-[#18181B]">Rp {referralStats.totalEarnings.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Penghasilan Referral */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Share2 className="w-3 h-3 text-[#8B5CF6]" strokeWidth={1.5} />
                        <span className="text-[10px] text-[#A1A1AA]">Penghasilan Referral</span>
                      </div>
                      <p className="text-lg font-light text-[#18181B]">Rp {referralStats.referralEarnings.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Total Referral */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-[#8B5CF6]" strokeWidth={1.5} />
                        <span className="text-[10px] text-[#A1A1AA]">Total Referral</span>
                      </div>
                      <p className="text-lg font-light text-[#18181B]">{referralStats.totalReferrals}</p>
                    </div>
                    {/* Penghasilan Komisi Template */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-[#A1A1AA]">Komisi Template</span>
                      </div>
                      <p className="text-lg font-light text-[#18181B]">Rp {referralStats.templateEarnings.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Penghasilan Komisi Digital Product */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-[#A1A1AA]">Komisi Digital</span>
                      </div>
                      <p className="text-lg font-light text-[#18181B]">Rp {referralStats.digitalProductEarnings.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Saldo Tersedia */}
                    <div className="bg-[#F9F9FB] p-4 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-[#A1A1AA]">Saldo Tersedia</span>
                      </div>
                      <div className="mb-2">
                        <p className="text-lg font-light text-[#18181B]">Rp {referralStats.availableBalance.toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-xs font-light hover:opacity-90 transition whitespace-nowrap"
                      >
                        <DollarSign className="w-3 h-3" strokeWidth={1.5} />
                        Tarik
                      </button>
                    </div>
                  </div>

                  {/* Withdrawal History */}
                  {withdrawHistory.length > 0 && (
                    <div>
                      <h3 className="text-lg font-light text-[#18181B] mb-4">Riwayat Penarikan</h3>
                      <div className="bg-[#F9F9FB] rounded-xl p-4">
                        <div className="space-y-3">
                          {withdrawHistory.map((withdraw) => (
                            <div key={withdraw.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  withdraw.status === 'approved' ? 'bg-green-100' :
                                  withdraw.status === 'rejected' ? 'bg-red-100' :
                                  'bg-yellow-100'
                                }`}>
                                  {withdraw.status === 'approved' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                                  ) : withdraw.status === 'rejected' ? (
                                    <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                                  ) : (
                                    <Clock className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#18181B]">Rp {withdraw.amount.toLocaleString('id-ID')}</p>
                                  <p className="text-xs text-[#A1A1AA]">{withdraw.accountName} - {withdraw.bankName} - {withdraw.accountNumber}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  withdraw.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  withdraw.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {withdraw.status.charAt(0).toUpperCase() + withdraw.status.slice(1)}
                                </span>
                                <p className="text-[10px] text-[#A1A1AA] mt-1">
                                  {new Date(withdraw.createdAt).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order History */}
                  {(affiliateOrders.templateOrders.length > 0 || affiliateOrders.digitalProductOrders.length > 0) && (
                    <div>
                      <h3 className="text-lg font-light text-[#18181B] mb-4">Riwayat Order Produk</h3>
                      <div className="bg-[#F9F9FB] rounded-xl p-4">
                        <div className="space-y-3">
                          {/* Template Orders */}
                          {affiliateOrders.templateOrders.map((order: any) => {
                            const getStatusLabel = (status: string) => {
                              const statusMap: Record<string, string> = {
                                'pending_payment': 'Menunggu Pembayaran',
                                'paid': 'Dibayar',
                                'verified': 'Selesai',
                                'rejected': 'Ditolak',
                                'cancelled': 'Dibatalkan',
                                'pending_verification': 'Menunggu Verifikasi',
                              };
                              return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
                            };
                            return (
                              <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-100">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#18181B] truncate">{order.userTemplate?.masterTemplate?.title || 'Template'}</p>
                                    <p className="text-xs text-[#A1A1AA] mt-1">Template • {order.customerName || 'Unknown'}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                    order.status === 'approved' || order.status === 'completed' || order.status === 'paid' || order.status === 'verified' ? 'bg-green-100 text-green-700' :
                                    order.status === 'rejected' || order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {getStatusLabel(order.status)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#A1A1AA]">Harga:</span>
                                    <span className="text-sm font-medium text-[#18181B]">Rp {order.productPrice?.toLocaleString('id-ID') || '0'}</span>
                                  </div>
                                  {(order.status === 'approved' || order.status === 'completed' || order.status === 'paid' || order.status === 'verified') && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Plus className="w-3 h-3" strokeWidth={2} />
                                      <span className="text-sm font-medium">Rp {order.commission?.toLocaleString('id-ID') || '0'}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[10px] text-[#A1A1AA] mt-2">
                                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            );
                          })}

                          {/* Digital Product Orders */}
                          {affiliateOrders.digitalProductOrders.map((order: any) => {
                            const getStatusLabel = (status: string) => {
                              const statusMap: Record<string, string> = {
                                'pending_payment': 'Menunggu Pembayaran',
                                'paid': 'Dibayar',
                                'verified': 'Selesai',
                                'rejected': 'Ditolak',
                                'cancelled': 'Dibatalkan',
                                'pending_verification': 'Menunggu Verifikasi',
                              };
                              return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
                            };
                            return (
                              <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-100">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#18181B] truncate">{order.userDigitalProduct?.masterDigitalProduct?.title || 'Digital Product'}</p>
                                    <p className="text-xs text-[#A1A1AA] mt-1">Digital Product • {order.customerName || 'Unknown'}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                    order.status === 'approved' || order.status === 'completed' || order.status === 'verified' ? 'bg-green-100 text-green-700' :
                                    order.status === 'rejected' || order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {getStatusLabel(order.status)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#A1A1AA]">Harga:</span>
                                    <span className="text-sm font-medium text-[#18181B]">Rp {order.productPrice?.toLocaleString('id-ID') || '0'}</span>
                                  </div>
                                  {(order.status === 'approved' || order.status === 'completed' || order.status === 'verified') && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Plus className="w-3 h-3" strokeWidth={2} />
                                      <span className="text-sm font-medium">Rp {order.commission?.toLocaleString('id-ID') || '0'}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[10px] text-[#A1A1AA] mt-2">
                                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : activeTab === 'referral' ? (
              <motion.div
                key="referral"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-neutral-100 p-8 min-h-[500px]">
                  {!isPremium ? (
                    // Locked state for FREE users
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-[#8B5CF6]" strokeWidth={1.5} />
                      </div>
                      <h2 className="text-xl font-light text-[#18181B] mb-3">Fitur Premium</h2>
                      <p className="text-sm text-[#A1A1AA] mb-8 max-w-md text-center">
                        Program referral memungkinkan kamu mendapatkan Rp 30.000 untuk setiap teman yang kamu ajak dan upgrade ke Premium membership.
                      </p>
                      <button
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-full hover:opacity-90 transition text-sm font-medium"
                      >
                        <Crown className="w-4 h-4" strokeWidth={1.5} />
                        Upgrade to Premium
                      </button>
                    </div>
                  ) : (
                    // Premium referral content
                    <div className="space-y-8">
                    {/* Referral Link Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-light text-[#18181B] mb-4">Link Referral Kamu</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="flex-1 bg-[#F9F9FB] border border-gray-200 rounded-lg px-4 py-3">
                            <p className="text-sm text-[#A1A1AA] break-all">{typeof window !== 'undefined' ? `${window.location.origin}?ref=${referralCode}` : ''}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}?ref=${referralCode}` : '');
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition text-sm font-light whitespace-nowrap"
                          >
                            <Copy className="w-4 h-4" strokeWidth={1.5} />
                            Salin Link
                          </button>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="bg-[#F9F9FB] rounded-2xl p-6 border border-gray-50">
                        <h4 className="text-md font-light text-[#18181B] mb-2">QR Code Referral</h4>
                        <p className="text-sm text-[#A1A1AA] mb-4">Screenshot atau download QR code ini untuk share ke TikTok, Instagram Story, atau WhatsApp.</p>
                        {referralCode ? (
                          <ReferralQRCode
                            referralCode={referralCode}
                            baseUrl={typeof window !== 'undefined' ? window.location.origin : ''}
                          />
                        ) : (
                          <div className="text-center text-[#A1A1AA] text-sm py-8">
                            Loading referral code...
                          </div>
                        )}
                      </div>

                      {/* Invitee List Section */}
                      <div className="bg-[#F9F9FB] rounded-2xl p-4 md:p-6 border border-gray-50">
                        <h4 className="text-md font-light text-[#18181B] mb-4">Daftar Teman yang Diundang</h4>
                        {referralStats.totalReferrals > 0 ? (
                          <div className="space-y-3">
                            {referralStats.referrals?.map((referral: any) => {
                              const subscription = referral.subscription || { plan: 'free', status: 'inactive' };
                              const commissionEarned = referral.earnings?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
                              const tierColors = {
                                free: 'bg-gray-100 text-gray-600',
                                pro: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
                                premium: 'bg-[#FBBF24]/10 text-[#FBBF24]'
                              };
                              return (
                                <div key={referral.id} className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <User className="w-5 h-5 md:w-6 md:h-6 text-[#8B5CF6]" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm md:text-base font-medium text-[#18181B] truncate">
                                            {referral.referred?.name || referral.referred?.email || 'Unknown'}
                                          </p>
                                          <p className="text-xs text-[#A1A1AA] truncate">
                                            {referral.referred?.email || ''}
                                          </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${tierColors[subscription.plan as keyof typeof tierColors] || tierColors.free}`}>
                                          {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-[#A1A1AA]">
                                          {subscription.status === 'active' ? 'Aktif' : 'Belum aktif'}
                                        </p>
                                        <p className="text-sm md:text-base font-semibold text-[#8B5CF6]">
                                          Rp {commissionEarned.toLocaleString('id-ID')}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center text-[#A1A1AA] text-sm py-8">
                            Belum ada teman yang diundang
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </motion.div>
            ) : activeTab === 'bio' ? (
              <motion.div
                key="bio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BioSettings
                  userId={userId}
                  username={username}
                  storeName={userName}
                  avatarUrl={userAvatar}
                  referralCode={referralCode}
                  initialBioDescription={bioDescription}
                  initialBioStoreUrl={bioStoreUrl}
                  initialBioReferralUrl={bioReferralUrl}
                  initialBioEnabled={bioEnabled}
                  initialShowStoreButton={showStoreButton}
                  initialShowReferralButton={showReferralButton}
                />
              </motion.div>
            ) : activeTab === 'konten-kit' ? (
              <motion.div
                key="konten-kit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <KontenKitSection isPremium={isPremium} isPaid={isPremium || userPlan !== 'free'} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-50">
        <div className="flex justify-around items-center py-3 px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-neutral-400"
          >
            <Home size={20} strokeWidth={2} />
            <span className="text-[10px] font-light">Home</span>
          </Link>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'products' ? 'text-[#8B5CF6]' : 'text-neutral-400'
            }`}
          >
            <LayoutGrid size={20} strokeWidth={activeTab === 'products' ? 2.5 : 2} />
            <span className="text-[10px] font-light">Produk</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'earnings' ? 'text-[#8B5CF6]' : 'text-neutral-400'
            }`}
          >
            <DollarSign size={20} strokeWidth={activeTab === 'earnings' ? 2.5 : 2} />
            <span className="text-[10px] font-light">Earnings</span>
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'referral' ? 'text-[#8B5CF6]' : 'text-neutral-400'
            }`}
          >
            <User size={20} strokeWidth={activeTab === 'referral' ? 2.5 : 2} />
            <span className="text-[10px] font-light">Referral</span>
          </button>
        </div>
      </div>

      {/* Share Modal maintain its props */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        storeUrl={storeUrl}
        copyStatus={copyStatus}
        onCopyLink={handleCopyLink}
      />

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-light text-[#18181B] mb-4">Tarik Saldo</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                  const res = await fetch('/api/referral/withdraw-request', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.access_token || ''}`,
                    },
                    body: JSON.stringify({
                      amount: parseInt(withdrawForm.amount),
                      bankName: withdrawForm.bankName,
                      accountNumber: withdrawForm.accountNumber,
                      accountName: withdrawForm.accountName,
                    }),
                  });
                  if (res.ok) {
                    setIsWithdrawModalOpen(false);
                    setWithdrawForm({ amount: '', bankName: '', accountNumber: '', accountName: '' });
                    // Refresh withdrawal history
                    const historyRes = await fetch('/api/referral/withdraw-history', {
                      headers: {
                        'Authorization': `Bearer ${session.access_token || ''}`,
                      },
                    });
                    if (historyRes.ok) {
                      const data = await historyRes.json();
                      setWithdrawHistory(data.withdrawals || []);
                    }
                    alert('Permintaan penarikan berhasil dikirim!');
                  } else {
                    const errorData = await res.json();
                    alert(errorData.error || 'Gagal mengirim permintaan penarikan');
                  }
                }
              } catch (err) {
                console.error('Failed to submit withdraw request:', err);
                alert('Gagal mengirim permintaan penarikan');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Jumlah (Rp)</label>
                  <input
                    type="number"
                    name="amount"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    required
                    min="1"
                    max={referralStats.availableBalance}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                    placeholder="Masukkan jumlah"
                  />
                  <p className="text-xs text-[#A1A1AA] mt-1">Saldo tersedia: Rp {referralStats.availableBalance.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    name="accountName"
                    value={withdrawForm.accountName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                    placeholder="Nama sesuai rekening/e-wallet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Metode Pembayaran</label>
                  <input
                    type="text"
                    name="bankName"
                    value={withdrawForm.bankName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                    placeholder="Contoh: BCA, Mandiri, DANA, OVO, GoPay"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Nomor Rekening/ID E-Wallet</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={withdrawForm.accountNumber}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                    placeholder="Masukkan nomor rekening atau ID e-wallet"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#18181B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-sm"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#18181B]">
                  {selectedProducts.size} selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitSelectionMode}
                  className="px-4 py-2 rounded-lg text-sm font-light text-[#A1A1AA] hover:text-[#18181B] hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedProducts.size === 0}
                  className="px-4 py-2 rounded-lg text-sm font-light text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-50 p-8 relative z-10"
            >
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="absolute top-6 right-6 text-[#A1A1AA] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <h2 className="text-lg font-light text-[#18181B] mb-1">Upgrade to Join Community</h2>
              <p className="text-[12px] text-[#A1A1AA] mb-6 font-light">Upgrade to Premium to join our exclusive community and connect with other affiliates.</p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsUpgradeModalOpen(false);
                    router.push('/#pricing');
                  }}
                  className={`w-full py-3.5 rounded-2xl font-light tracking-wider text-[10px] transition-all bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white hover:opacity-90 shadow-sm`}
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}