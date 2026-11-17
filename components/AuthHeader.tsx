"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { User, LogOut, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getClientUser } from '@/lib/client-auth';

interface AuthHeaderProps {
  currentPage?: 'catalog' | 'store';
}

export default function AuthHeader({ currentPage = 'catalog' }: AuthHeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

  // Gunakan useCallback agar fungsi checkUser stabil di memori
  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getClientUser();
      if (currentUser) {
        setUser(currentUser);
        // Fetch username from database
        const res = await fetch(`/api/auth/user?id=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setUsername(data.user?.username || currentUser.id);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
    
    // Tambahkan listener auth Supabase agar tidak perlu reload manual
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Lebih aman pakai router.push atau window.location jika perlu hard reset
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // --- RENDER LOGIC ---
  
  // Penting: Kembalikan container kosong yang ukurannya stabil saat loading 
  // agar tidak terjadi layout shift yang memicu re-render pada parent
  if (loading) {
    return (
      <div className="flex items-center gap-4 min-w-[100px] justify-end">
        <div className="w-4 h-4 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-end">
        <a 
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:opacity-80 transition-all"
        >
          <User className="w-4 h-4" />
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4 justify-end">
      {currentPage === 'catalog' && (
        <a 
          href={`/affstore/${user.id}`}
          className="hidden md:flex items-center gap-2 px-4 py-2 border border-black/10 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
        >
          <Store className="w-4 h-4" />
          My Store
        </a>
      )}
      
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-white/50 border border-black/5">
        <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center shrink-0">
          <User className="w-2.5 h-2.5 md:w-3 h-3 text-white" />
        </div>
        <span className="text-[10px] md:text-xs font-medium truncate max-w-[80px] md:max-w-[120px]">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="p-1 hover:bg-black/10 rounded transition-colors"
          title="Logout"
        >
          <LogOut className="w-3 h-3 text-black/60" />
        </button>
      </div>
    </div>
  );
}