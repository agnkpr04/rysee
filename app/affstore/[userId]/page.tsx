"use client";

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import UserStoreSection from './components/UserStoreSection';
import UserStore from './components/UserStore';

export default function UserStorePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState<string>('User');
  const [userPlan, setUserPlan] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialStoreData, setInitialStoreData] = useState<any>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // Fetch user data from database (works for both owner and visitors)
        const res = await fetch(`/api/auth/user?id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const fullName = data.user?.name || data.user?.fullName || session?.user?.user_metadata?.full_name || 'User';
          setUserName(fullName);
          setUserPlan(data.userPlan || 'free');

          // Extract store theme data
          if (data.user?.storeTheme) {
            setInitialStoreData({
              storeName: data.user.storeName,
              storeDescription: data.user.storeDescription,
              themeColor: data.user.storeTheme.primaryColor,
              textColor: data.user.storeTheme.textColor,
              accentColor: data.user.storeTheme.accentColor,
              iconColor: data.user.storeTheme.iconColor,
              gradientFrame: data.user.storeTheme.gradientFrame,
              fontName: data.user.storeTheme.fontName,
              fontDescription: data.user.storeTheme.fontDescription,
              fontBody: data.user.storeTheme.fontBody,
              profileFrameType: data.user.storeTheme.profileFrameType,
              frameThickness: data.user.storeTheme.frameThickness,
            });
          }

          // Check if the logged-in user is viewing their own profile
          if (session?.user && session.user.id === userId) {
            setIsOwner(true);
            // Save to cache
            if (typeof window !== 'undefined' && fullName) {
              localStorage.setItem('userName', fullName);
            }
          } else {
            setIsOwner(false);
          }
        } else {
          // Fallback to Supabase auth metadata
          const fullName = session?.user?.user_metadata?.full_name || 'User';
          setUserName(fullName);
          if (session?.user && session.user.id === userId) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

  // If owner, show dashboard. If visitor, show public store preview
  if (isOwner) {
    return (
      <main>
        <UserStoreSection
          userId={userId}
          userName={userName}
          initialStoreData={initialStoreData}
        />
      </main>
    );
  }

  return (
    <UserStore
      userId={userId}
      userName={userName}
      userPlan={userPlan}
      initialStoreData={initialStoreData}
      isOwner={false}
    />
  );
}