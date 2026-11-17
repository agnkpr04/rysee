"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface StoreEditorData {
  themeColor: string;
  textColor: string;
  accentColor: string;
  iconColor: string;
  gradientFrame: string;
  storeName: string;
  storeDescription: string;
  fontName: string;
  fontDescription: string;
  fontBody: string;
}

interface InitialStoreData {
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
}

export function useStoreEditor(userId: string, initialStoreName?: string, initialUserName?: string, userPlan?: string, initialStoreData?: InitialStoreData, isOwnerFromServer?: boolean) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOwner, setIsOwner] = useState(isOwnerFromServer || false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(userPlan || 'free');

  // Track if this is the first render to avoid resetting on initial mount
  const [hasMounted, setHasMounted] = useState(false);

  // Update current plan when userPlan prop changes
  useEffect(() => {
    if (userPlan) {
      const prevPlan = currentPlan;
      setCurrentPlan(userPlan);
      
      // Only reset features on actual plan DOWNGRADES (not on initial mount)
      if (hasMounted && prevPlan !== userPlan) {
        if (userPlan === 'free') {
          setGradientFrame('none');
          setProfileFrameType('none');
          setFontName('Poppins');
          setFontDescription('Poppins');
          setFontBody('Poppins');
        } else if (userPlan === 'pro') {
          setGradientFrame('none');
          setProfileFrameType('none');
        }
      }
      setHasMounted(true);
    }
  }, [userPlan]);

  // Color states - use initial data if available
  const [themeColor, setThemeColor] = useState(initialStoreData?.themeColor || '#D1D1D4');
  const [textColor, setTextColor] = useState(initialStoreData?.textColor || '#1e293b');
  const [accentColor, setAccentColor] = useState(initialStoreData?.accentColor || '#3E47A8');
  const [iconColor, setIconColor] = useState(initialStoreData?.iconColor || '#64748b');
  const [gradientFrame, setGradientFrame] = useState(initialStoreData?.gradientFrame || 'none');

  // Store content states - use initial data if available
  const [storeName, setStoreName] = useState(initialStoreData?.storeName || initialStoreName || 'My Store');
  const [storeDescription, setStoreDescription] = useState(initialStoreData?.storeDescription || '');

  // Font states - use initial data if available
  const [fontName, setFontName] = useState(initialStoreData?.fontName || 'Poppins');
  const [fontDescription, setFontDescription] = useState(initialStoreData?.fontDescription || 'Poppins');
  const [fontBody, setFontBody] = useState(initialStoreData?.fontBody || 'Poppins');

  // Profile frame type - use initial data if available
  const [profileFrameType, setProfileFrameType] = useState(initialStoreData?.profileFrameType || 'none');

  // Frame thickness - use initial data if available
  const [frameThickness, setFrameThickness] = useState(initialStoreData?.frameThickness || 2);

  // Original values for cancel reset - use initial data if available
  const [originalThemeColor, setOriginalThemeColor] = useState(initialStoreData?.themeColor || '#D1D1D4');
  const [originalTextColor, setOriginalTextColor] = useState(initialStoreData?.textColor || '#1e293b');
  const [originalAccentColor, setOriginalAccentColor] = useState(initialStoreData?.accentColor || '#3E47A8');
  const [originalIconColor, setOriginalIconColor] = useState(initialStoreData?.iconColor || '#64748b');
  const [originalGradientFrame, setOriginalGradientFrame] = useState(initialStoreData?.gradientFrame || 'none');
  const [originalStoreName, setOriginalStoreName] = useState(initialStoreData?.storeName || initialStoreName || '');
  const [originalStoreDescription, setOriginalStoreDescription] = useState(initialStoreData?.storeDescription || '');
  const [originalFontName, setOriginalFontName] = useState(initialStoreData?.fontName || 'Poppins');
  const [originalFontDescription, setOriginalFontDescription] = useState(initialStoreData?.fontDescription || 'Poppins');
  const [originalFontBody, setOriginalFontBody] = useState(initialStoreData?.fontBody || 'Poppins');
  const [originalProfileFrameType, setOriginalProfileFrameType] = useState(initialStoreData?.profileFrameType || 'none');
  const [originalFrameThickness, setOriginalFrameThickness] = useState(initialStoreData?.frameThickness || 2);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        // Always check session for ownership (hybrid approach)
        // Server-side isOwnerFromServer is initial value, client-side check is fallback
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === userId) {
          setIsOwner(true);
        }

        // Skip data fetch if initial data is already provided from server
        if (initialStoreData && initialStoreData.storeName) {
          return;
        }

        // Load user data from API (only if not provided from server)
        const userRes = await fetch(`/api/auth/user?id=${userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user) {
            const loadedStoreName = userData.user.storeName || userData.user.name || 'My Store';
            const loadedStoreDescription = userData.user.storeDescription || '';
            const loadedTextColor = userData.user.storeTheme?.textColor || '#1e293b';
            const loadedThemeColor = userData.user.storeTheme?.primaryColor || '#D1D1D4';
            const loadedAccentColor = userData.user.storeTheme?.accentColor || '#3E47A8';
            const loadedIconColor = userData.user.storeTheme?.iconColor || '#64748b';

            // Load all theme values from database (tier enforcement is on the save side)
            const loadedFontName = userData.user.storeTheme?.fontName || 'Poppins';
            const loadedFontDescription = userData.user.storeTheme?.fontDescription || 'Poppins';
            const loadedFontBody = userData.user.storeTheme?.fontBody || 'Poppins';
            const loadedGradientFrame = userData.user.storeTheme?.gradientFrame || 'none';
            const loadedProfileFrameType = userData.user.storeTheme?.profileFrameType || 'none';
            const loadedFrameThickness = userData.user.storeTheme?.frameThickness || 2;

            setStoreName(loadedStoreName);
            setStoreDescription(loadedStoreDescription);
            setTextColor(loadedTextColor);
            setThemeColor(loadedThemeColor);
            setAccentColor(loadedAccentColor);
            setIconColor(loadedIconColor);
            setFontName(loadedFontName);
            setFontDescription(loadedFontDescription);
            setFontBody(loadedFontBody);
            setGradientFrame(loadedGradientFrame);
            setProfileFrameType(loadedProfileFrameType);
            setFrameThickness(loadedFrameThickness);

            // Save original values
            setOriginalStoreName(loadedStoreName);
            setOriginalStoreDescription(loadedStoreDescription);
            setOriginalTextColor(loadedTextColor);
            setOriginalThemeColor(loadedThemeColor);
            setOriginalAccentColor(loadedAccentColor);
            setOriginalIconColor(loadedIconColor);
            setOriginalGradientFrame(loadedGradientFrame);
            setOriginalFontName(loadedFontName);
            setOriginalFontDescription(loadedFontDescription);
            setOriginalFontBody(loadedFontBody);
            setOriginalProfileFrameType(loadedProfileFrameType);
            setOriginalFrameThickness(loadedFrameThickness);
          }
        }
      } catch (err) {
        console.error("Failed to load store", err);
      }
    };
    if (userId) initializeStore();
  }, [userId]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = { userId, themeColor, textColor, accentColor, iconColor, gradientFrame, storeName, storeDescription, fontName, fontDescription, fontBody, profileFrameType, frameThickness };
      console.log('Saving store settings:', payload);

      // Get auth token for secure request
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/store-settings', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('Save response:', data);

      if (res.ok) {
        // Update original values to match what was just saved
        setOriginalThemeColor(themeColor);
        setOriginalTextColor(textColor);
        setOriginalAccentColor(accentColor);
        setOriginalIconColor(iconColor);
        setOriginalGradientFrame(gradientFrame);
        setOriginalStoreName(storeName);
        setOriginalStoreDescription(storeDescription);
        setOriginalFontName(fontName);
        setOriginalFontDescription(fontDescription);
        setOriginalFontBody(fontBody);
        setOriginalProfileFrameType(profileFrameType);
        setOriginalFrameThickness(frameThickness);
        setIsEditMode(false);

        // Dispatch event to notify other components (e.g. DashboardHeader)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } else {
        console.error('Save failed with error:', data.error);
        const errorMsg = data.error || 'Unknown error';
        const errorDetails = data.details ? ` (${data.details})` : '';
        alert('Gagal menyimpan perubahan: ' + errorMsg + errorDetails);
      }
    } catch (error) {
      console.error("Save failed", error);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setThemeColor(originalThemeColor);
    setTextColor(originalTextColor);
    setAccentColor(originalAccentColor);
    setIconColor(originalIconColor);
    setGradientFrame(originalGradientFrame);
    setStoreName(originalStoreName);
    setStoreDescription(originalStoreDescription);
    setFontName(originalFontName);
    setFontDescription(originalFontDescription);
    setFontBody(originalFontBody);
    setProfileFrameType(originalProfileFrameType);
    setFrameThickness(originalFrameThickness);
    setIsEditMode(false);
  };

  return {
    // State
    isEditMode,
    isOwner,
    isSaving,
    themeColor,
    textColor,
    accentColor,
    iconColor,
    gradientFrame,
    storeName,
    storeDescription,
    fontName,
    fontDescription,
    fontBody,
    profileFrameType,
    frameThickness,

    // Handlers
    setIsEditMode,
    setThemeColor,
    setTextColor,
    setAccentColor,
    setIconColor,
    setGradientFrame,
    setStoreName,
    setStoreDescription,
    setFontName,
    setFontDescription,
    setFontBody,
    setProfileFrameType,
    setFrameThickness,
    handleSaveAll,
    handleCancel,
  };
}
