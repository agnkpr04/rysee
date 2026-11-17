import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import UserStore from '../../affstore/[userId]/components/UserStore';

async function fetchUserData(userId: string) {
  try {
    // Use environment variable or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/auth/user?id=${userId}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      
      // Fetch membership status
      const membershipRes = await fetch(`${baseUrl}/api/membership/status?userId=${userId}`, {
        cache: 'no-store'
      });
      let membershipData = { plan: 'free', eliteBadgeColor: 'crimson' };
      if (membershipRes.ok) {
        membershipData = await membershipRes.json();
      }

      // Fetch initial products
      const productsRes = await fetch(`${baseUrl}/api/user-products?userId=${userId}&offset=0&limit=8`, {
        cache: 'no-store'
      });
      let initialProducts = [];
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        initialProducts = productsData.products || [];
      }

      return {
        userName: data.user?.storeName || data.user?.name || 'User',
        userPlan: membershipData.plan || 'free',
        eliteBadgeColor: data.user?.eliteBadgeColor || membershipData.eliteBadgeColor || 'crimson',
        initialAvatarUrl: data.user?.avatar_url || data.user?.storeLogo || '',
        initialStoreData: {
          storeName: data.user?.storeName || data.user?.name || 'User',
          storeDescription: data.user?.storeDescription || '',
          themeColor: data.user?.storeTheme?.primaryColor || '#D1D1D4',
          textColor: data.user?.storeTheme?.textColor || '#1e293b',
          accentColor: data.user?.storeTheme?.accentColor || '#3E47A8',
          iconColor: data.user?.storeTheme?.iconColor || '#64748b',
          gradientFrame: data.user?.storeTheme?.gradientFrame || 'none',
          fontName: data.user?.storeTheme?.fontName || 'Poppins',
          fontDescription: data.user?.storeTheme?.fontDescription || 'Poppins',
          fontBody: data.user?.storeTheme?.fontBody || 'Poppins',
          profileFrameType: data.user?.storeTheme?.profileFrameType || 'none',
          frameThickness: data.user?.storeTheme?.frameThickness || 2,
        },
        initialProducts
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}

export default async function UserStorePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  // Check if user is logged in and is the owner
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const supabase = createServerClient(cookieHeader);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const userData = await fetchUserData(userId);

  if (!userData) {
    redirect('/');
  }

  // Pass isOwner flag to UserStore for editable mode
  const isOwner = session?.user?.id === userId;

  return (
    <UserStore 
      userId={userId}
      userName={userData.userName}
      userPlan={userData.userPlan}
      eliteBadgeColor={userData.eliteBadgeColor}
      initialProducts={userData.initialProducts}
      initialAvatarUrl={userData.initialAvatarUrl}
      initialStoreData={userData.initialStoreData}
      isOwner={isOwner}
    />
  );
}