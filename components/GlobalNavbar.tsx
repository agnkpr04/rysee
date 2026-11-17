"use client";

import { useEffect, useState, useRef } from 'react';
import { User, Home, ShoppingCart, CreditCard, ChevronDown, HelpCircle, BookOpen, Menu, X, Crown, Globe, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import LoginModal from '../app/affstore/components/LoginModal';
import TierBadge from './TierBadge';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const ryseeGradient = "from-[#8B5CF6] via-[#D946EF] to-[#FBBF24]";

interface GlobalNavbarProps {
  isSticky?: boolean;
}

export default function GlobalNavbar({ isSticky = false }: GlobalNavbarProps) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [username, setUsername] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Load from cache on client-side only (after mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedUserPlan = localStorage.getItem('userPlan') || 'free';
      const cachedAvatarUrl = localStorage.getItem('userAvatar') || '';
      const cachedIsPremium = localStorage.getItem('userIsPremium') === 'true';
      const cachedUserId = localStorage.getItem('userId') || null;
      const cachedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      setUserPlan(cachedUserPlan);
      setAvatarUrl(cachedAvatarUrl);
      setIsPremium(cachedIsPremium);
      if (cachedIsLoggedIn && cachedUserId) {
        setUser({ id: cachedUserId });
      }
    }
  }, []);

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
            setUserPlan(data.plan || 'free');
            // Save to cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('userPlan', data.plan || 'free');
              localStorage.setItem('userIsPremium', String(data.isPremium || false));
              localStorage.setItem('userId', session.user.id);
              localStorage.setItem('isLoggedIn', 'true');
            }
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
          setIsPremium(false);
          setUserPlan('free');
        }

        try {
          const res = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            const avatar = data.user?.storeLogo || data.user?.avatar_url || session.user.user_metadata?.avatar_url || '';
            setAvatarUrl(avatar);
            setUsername(data.user?.username || session.user.id);
            // Save avatar to cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAvatar', avatar);
              if (data.user?.username) {
                localStorage.setItem('username', data.user.username);
              }
              if (data.user?.name) {
                localStorage.setItem('userFullName', data.user.name);
              }
            }
          } else {
            const avatar = session.user.user_metadata?.avatar_url || '';
            setAvatarUrl(avatar);
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAvatar', avatar);
            }
          }
        } catch (err) {
          console.error('Failed to fetch user avatar from database:', err);
          const avatar = session.user.user_metadata?.avatar_url || '';
          setAvatarUrl(avatar);
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAvatar', avatar);
          }
        }
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // Clear auth data on logout, but keep user data cache for instant loading
      if (!session) {
        if (typeof window !== 'undefined') {
          // Only clear auth-related data, keep user data cache
          localStorage.removeItem('userId');
          localStorage.removeItem('isLoggedIn');
          // Don't clear userPlan, userAvatar, userIsPremium, username, userFullName
          // This allows instant data loading when user logs back in
        }
        setUserPlan('free');
        setIsPremium(false);
        setAvatarUrl('');
        return;
      }

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
            setUserPlan(data.plan || 'free');
            // Save to cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('userPlan', data.plan || 'free');
              localStorage.setItem('userIsPremium', String(data.isPremium || false));
              localStorage.setItem('userId', session.user.id);
              localStorage.setItem('isLoggedIn', 'true');
            }
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
          setIsPremium(false);
          setUserPlan('free');
        }

        try {
          const res = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            const avatar = data.user?.storeLogo || data.user?.avatar_url || session.user.user_metadata?.avatar_url || '';
            setAvatarUrl(avatar);
            setUsername(data.user?.username || session.user.id);
            // Save avatar to cache
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAvatar', avatar);
              if (data.user?.username) {
                localStorage.setItem('username', data.user.username);
              }
              if (data.user?.name) {
                localStorage.setItem('userFullName', data.user.name);
              }
            }
          } else {
            const avatar = session.user.user_metadata?.avatar_url || '';
            setAvatarUrl(avatar);
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAvatar', avatar);
            }
          }
        } catch (err) {
          console.error('Failed to fetch user avatar from database:', err);
          const avatar = session.user.user_metadata?.avatar_url || '';
          setAvatarUrl(avatar);
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAvatar', avatar);
          }
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for profile updates from settings page
  useEffect(() => {
    const handleProfileUpdate = () => {
      const refreshData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const res = await fetch(`/api/auth/user?id=${session.user.id}`);
            if (res.ok) {
              const data = await res.json();
              const avatar = data.user?.storeLogo || data.user?.avatar_url || session.user.user_metadata?.avatar_url || '';
              setAvatarUrl(avatar);
              setUsername(data.user?.username || session.user.id);
              if (typeof window !== 'undefined') {
                localStorage.setItem('userAvatar', avatar);
                if (data.user?.username) {
                  localStorage.setItem('username', data.user.username);
                }
                if (data.user?.name) {
                  localStorage.setItem('userFullName', data.user.name);
                }
              }
            }
          } catch (err) {
            console.error('[GlobalNavbar] Failed to refresh profile data:', err);
          }
        }
      };
      refreshData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <>
      {/* Header / Navigation - PC Mode */}
      <nav className={`hidden md:flex w-full px-8 py-6 items-center justify-between border-b border-gray-50 relative z-50 ${isSticky ? 'sticky top-0 bg-white/95 backdrop-blur-sm' : ''}`}>
        {/* Left: Logo */}
        <div className="flex items-center gap-0 flex-1">
          <Link href="/" className="flex items-center gap-0">
            <img src="/images/2.png" alt="Rysee Logo" className="h-6 w-auto" />
          </Link>
        </div>
        
        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Beranda</Link>
          {/* <Link href="/affstore" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Products</Link> */}
          <Link href="/templates" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Website</Link>
          <Link href="/digital-products" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Produk Digital</Link>
          <Link href="/pricing" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Harga</Link>
          <Link href="/guide" className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Panduan</Link>
        </div>

        {/* Right: User Buttons */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Combined Membership Button */}
          {!user ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-[12px] font-medium tracking-wider bg-[#8B5CF6] text-white px-4 py-2 rounded-full hover:bg-[#7C3AED] transition-all"
            >
              Join
            </button>
          ) : userPlan === 'premium' || userPlan === 'pro' ? (
            <Link
              href={`/affstore/${user?.id || ''}`}
              className="hover:opacity-90 transition-all"
            >
              <TierBadge tier={userPlan} size="md" variant="solid" />
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="hover:opacity-90 transition-all"
            >
              <TierBadge tier="free" size="md" variant="outline" />
            </Link>
          )}
          
          {user ? (
            <Link href={`/affstore/${user?.id || ''}`} className="flex items-center gap-2 outline-none group">
              <div className="w-8 h-8 rounded-full bg-[#F9F9FB] border border-gray-50 overflow-hidden group-hover:border-[#8B5CF6] transition-all flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
                )}
              </div>
            </Link>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="text-[12px] font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition">Login</button>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className={`md:hidden w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 relative z-50 ${isSticky ? 'sticky top-0 bg-white/95 backdrop-blur-sm' : ''}`}>
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1">
            <img src="/images/2.png" alt="Rysee Logo" className="h-6 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user && (userPlan === 'premium' || userPlan === 'pro') && (
            <TierBadge tier={userPlan} size="sm" variant="solid" />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#A1A1AA]" /> : <Menu className="w-5 h-5 text-[#A1A1AA]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 backdrop-blur-md bg-white/30 z-40"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[60%] max-w-[280px] bg-white z-50 transform transition-transform duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium tracking-wider text-[#18181B]">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full transition"
            >
              <X className="w-5 h-5 text-[#A1A1AA]" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <Link href="/pricing" className="flex items-center gap-2 text-xs font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition py-3 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <CreditCard className="w-3 h-3" strokeWidth={1.5} />
              Harga
            </Link>
            <Link href="/guide" className="flex items-center gap-2 text-xs font-light tracking-wider text-[#A1A1AA] hover:text-[#18181B] transition py-3 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
              <BookOpen className="w-3 h-3" strokeWidth={1.5} />
              Panduan
            </Link>
          </div>
        </div>
      </div>

      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          router.refresh();
        }}
      />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 z-50">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider">
            <Home className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <span className="text-[#A1A1AA]">Beranda</span>
          </Link>
          {/* <Link href="/affstore" className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider">
            <ShoppingCart className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <span className="text-[#A1A1AA]">Products</span>
          </Link> */}
          <Link href="/templates" className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider">
            <Globe className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <span className="text-[#A1A1AA]">Website</span>
          </Link>
          <Link href="/digital-products" className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider">
            <ShoppingBag className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
            <span className="text-[#A1A1AA]">Produk Digital</span>
          </Link>
          {user ? (
            <Link
              href={`/affstore/${user?.id || ''}`}
              className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider"
            >
              <div className="w-5 h-5 rounded-full bg-[#F9F9FB] border border-gray-50 overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3 h-3 text-[#A1A1AA]" strokeWidth={1.5} />
                )}
              </div>
              <span className="text-[#A1A1AA]">Profil</span>
            </Link>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex flex-col items-center gap-1 text-[10px] font-light tracking-wider"
            >
              <User className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
              <span className="text-[#A1A1AA]">Profil</span>
            </button>
          )}
        </div>

      </div>
    </>
  );
}
