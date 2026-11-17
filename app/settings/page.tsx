"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Trash2, Camera, Save, ChevronDown, Trophy, Settings, LogOut, Home, Store, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoginModal from '../affstore/components/LoginModal';
import MinimalFooter from '@/components/MinimalFooter';
import GlobalNavbar from '@/components/GlobalNavbar';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Profile settings
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [usernameError, setUsernameError] = useState<string>('');
  
  // Account settings
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user data from database for avatar and full name
        try {
          const res = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setAvatarUrl(data.user?.avatar_url || session.user.user_metadata?.avatar_url || '');
            setUsername(data.user?.username || '');
            // Full name from database first, fallback to auth metadata
            setFullName(data.user?.name || session.user.user_metadata?.full_name || '');
          } else {
            setAvatarUrl(session.user.user_metadata?.avatar_url || '');
            setFullName(session.user.user_metadata?.full_name || '');
          }
        } catch (err) {
          console.error('Failed to fetch user avatar from database:', err);
          setAvatarUrl(session.user.user_metadata?.avatar_url || '');
          setFullName(session.user.user_metadata?.full_name || '');
        }
        
        setEmail(session.user.email || '');

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
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
          setIsPremium(false);
          setUserPlan('free');
        }
      }
      setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setEmail(session.user.email || '');

        // Fetch avatar and username from database (fullName from database first, then auth metadata)
        try {
          const res = await fetch(`/api/auth/user?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            const dbAvatarUrl = data.user?.avatar_url;
            const dbUsername = data.user?.username;
            const dbFullName = data.user?.name;

            // Full name from database first, fallback to auth metadata
            setFullName(dbFullName || session.user.user_metadata?.full_name || '');

            if (dbAvatarUrl) {
              setAvatarUrl(dbAvatarUrl);
            } else {
              setAvatarUrl(session.user.user_metadata?.avatar_url || '');
            }

            if (dbUsername) {
              setUsername(dbUsername);
            }
          } else {
            // Fallback to Supabase auth metadata
            setFullName(session.user.user_metadata?.full_name || '');
            setAvatarUrl(session.user.user_metadata?.avatar_url || '');
          }
        } catch (err) {
          console.error('Failed to fetch user data from database:', err);
          // Fallback to Supabase auth metadata
          setFullName(session.user.user_metadata?.full_name || '');
          setAvatarUrl(session.user.user_metadata?.avatar_url || '');
        }

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
          }
        } catch (err) {
          console.error('Failed to fetch membership status:', err);
          setIsPremium(false);
          setUserPlan('free');
        }
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.refresh();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      alert('Please login to update your profile');
      return;
    }

    // Validate username
    if (username) {
      if (username.length < 3) {
        setUsernameError('Username must be at least 3 characters');
        return;
      }
      if (username.length > 20) {
        setUsernameError('Username must be at most 20 characters');
        return;
      }
      // Username validation: only lowercase letters, numbers, and hyphens
      if (!/^[a-z0-9-]+$/.test(username)) {
        setUsernameError('Username can only contain lowercase letters, numbers, and hyphens');
        return;
      }
      // Username cannot start or end with hyphen
      if (username.startsWith('-') || username.endsWith('-')) {
        setUsernameError('Username cannot start or end with a hyphen');
        return;
      }
      // Username cannot have consecutive hyphens
      if (username.includes('--')) {
        setUsernameError('Username cannot have consecutive hyphens');
        return;
      }
    }

    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error('Failed to upload avatar. Please try again.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        finalAvatarUrl = publicUrl;
      }

      // Update user metadata using Supabase v2 syntax
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: finalAvatarUrl,
        },
      });

      if (updateError) {
        console.error('Auth update error:', updateError);
        throw new Error('Failed to update profile. Please try again.');
      }

      // Sync avatar_url and username to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const syncResponse = await fetch('/api/auth/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: fullName,
            avatar_url: finalAvatarUrl,
            username: username || undefined,
            source: 'settings',
          }),
        });

        if (!syncResponse.ok) {
          const syncResult = await syncResponse.json();
          if (syncResult.error?.includes('username')) {
            setUsernameError('Username already taken');
            throw new Error('Username already taken');
          }
          throw new Error(syncResult.error || 'Failed to sync profile to database');
        }
      }

      // Refresh session to get updated metadata
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      if (refreshedSession?.user) {
        setUser(refreshedSession.user);
        setFullName(refreshedSession.user.user_metadata?.full_name || '');
        setAvatarUrl(refreshedSession.user.user_metadata?.avatar_url || '');
      }

      // Cache full name to localStorage for persistence across logout/login
      if (typeof window !== 'undefined') {
        localStorage.setItem('userFullName', fullName);
      }

      // Clear only avatar cache to force refresh, keep other data intact
      if (typeof window !== 'undefined') {
        const { data: { session: sessionForClear } } = await supabase.auth.getSession();
        if (sessionForClear?.user) {
          localStorage.removeItem(`storeAvatar_${sessionForClear.user.id}`);
          localStorage.removeItem('username'); // Clear username cache to force refresh from database
          // Don't clear userName, userPlan, userIsPremium as they are needed for page loading
        }
      }

      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      }

      // Refresh router to sync changes across all components
      router.refresh();

      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data including products and analytics. Continue?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
      });

      if (res.ok) {
        await supabase.auth.signOut();
        router.push('/');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-sans text-[#18181B] antialiased">
      <GlobalNavbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#18181B] mb-3">
              Settings
            </h1>
            <div className="w-16 h-0.5 mx-auto mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]"></div>
            <p className="text-sm font-light text-[#A1A1AA]">
              Manage your account and profile settings
            </p>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-2xl border border-gray-50 p-4 md:p-8 shadow-sm">
            <h2 className="text-lg font-light text-[#18181B] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
              Profile Settings
            </h2>

            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#F9F9FB] overflow-hidden border border-gray-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-[#A1A1AA]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#7C3AED] transition-colors shadow-sm">
                  <Camera className="w-4 h-4 text-white" strokeWidth={1.5} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-medium text-[#18181B] mb-1">Profile Picture</p>
                <p className="text-xs text-[#A1A1AA]">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#F9F9FB] border border-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8B5CF6] transition-all font-light"
                placeholder="Enter your full name"
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">Username</label>
              <div className="flex flex-col sm:flex-row">
                <span className="bg-[#F9F9FB] border border-gray-50 border-r-0 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none px-4 py-3 text-sm text-[#A1A1AA] font-light">rysee.my.id/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    setUsername(value);
                    setUsernameError('');
                  }}
                  className="flex-1 bg-[#F9F9FB] border border-gray-50 border-t-0 sm:border-t sm:border-l-0 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none px-4 py-3 text-sm outline-none focus:border-[#8B5CF6] transition-all font-light"
                  placeholder="username"
                />
              </div>
              {usernameError && (
                <p className="text-xs text-red-500 mt-1">{usernameError}</p>
              )}
              <p className="text-xs text-[#A1A1AA] mt-1">Lowercase letters, numbers, and hyphens only</p>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`w-full py-3 bg-gradient-to-r ${accentGradient} text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm`}
            >
              {isSaving ? 'Saving...' : <><Save className="w-4 h-4" strokeWidth={1.5} /> Save Profile</>}
            </button>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl border border-gray-50 p-4 md:p-8 shadow-sm">
            <h2 className="text-lg font-light text-[#18181B] mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8B5CF6]" strokeWidth={1.5} />
              Account Settings
            </h2>

            {/* Email (read-only) */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[#F9F9FB] border border-gray-50 rounded-xl px-4 py-3 text-sm outline-none opacity-60 font-light"
              />
              <p className="text-xs text-[#A1A1AA] mt-1">Email cannot be changed</p>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-[#A1A1AA]">Change Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#F9F9FB] border border-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8B5CF6] transition-all font-light"
                placeholder="Current password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#F9F9FB] border border-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8B5CF6] transition-all font-light"
                placeholder="New password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#F9F9FB] border border-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8B5CF6] transition-all font-light"
                placeholder="Confirm new password"
              />
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="w-full py-3 bg-[#18181B] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : <><Lock className="w-4 h-4" strokeWidth={1.5} /> Update Password</>}
              </button>
            </div>
          </div>


          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl border border-red-100 p-4 md:p-8 shadow-sm">
            <h2 className="text-lg font-light text-red-800 mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              Danger Zone
            </h2>

            <p className="text-sm text-red-700 mb-4 font-light">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : <><Trash2 className="w-4 h-4" strokeWidth={1.5} /> Delete Account</>}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          router.refresh();
        }}
      />

      <MinimalFooter />
    </div>
  );
}
