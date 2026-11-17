"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const res = await fetch('/api/membership/status');
          if (res.ok) {
            const data = await res.json();
            setIsPremium(data.isPremium || false);
          }
          // Fetch user data to get username
          const userRes = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setUsername(userData.user?.username || session.user.id);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const res = await fetch('/api/membership/status');
          if (res.ok) {
            const data = await res.json();
            setIsPremium(data.isPremium || false);
          }
          // Fetch user data to get username
          const userRes = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setUsername(userData.user?.username || session.user.id);
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="group">
          <h1 className="text-xl font-bold tracking-tighter italic group-hover:opacity-70 transition-opacity">
            RYSEE<span className="font-light not-italic text-black/40">.PRO</span>
          </h1>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-8">
          <Link href="/" className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-mono text-black/60 hover:text-black transition-colors">
            Showcase
          </Link>
          
          <Link href="/membership" className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-mono text-black/60 hover:text-black transition-colors">
            Pricing
          </Link>

          {/* DYNAMIC BUTTONS */}
          <div className="flex items-center gap-4 ml-4">
            {!user ? (
              <Link 
                href="/auth/login" 
                className="text-[10px] uppercase tracking-[0.2em] font-mono bg-black text-white px-6 py-2 rounded-full hover:bg-black/80 transition-all"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                {/* My Store Link */}
                <Link 
                  href={`/affstore/${user?.id}`}
                  className="text-[10px] uppercase tracking-[0.2em] font-mono text-black border border-black/10 px-5 py-2 rounded-full hover:bg-black/5 transition-all"
                >
                  My Store
                </Link>

                {/* Status Badge / Upgrade */}
                {!isPremium ? (
                  <Link 
                    href="/#pricing" 
                    className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-mono text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 rounded-full hover:bg-[#D4AF37]/10 transition-all"
                  >
                    Upgrade Premium
                  </Link>
                ) : (
                  <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] italic">
                    Premium Member
                  </span>
                )}

                {/* Logout - Kecil Saja */}
                <button 
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-[0.2em] font-mono text-black/30 hover:text-red-500 transition-colors ml-2"
                >
                  Exit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}