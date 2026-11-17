"use client";

import React from 'react';
import { Save, Edit3, Loader2, Palette, Lock, Crown } from 'lucide-react';
import ColorPicker from '@/app/user/[userId]/components/ColorPicker';

// Preset colors for Premium plan
const PREMIUM_PRESET_COLORS = [
  '#D1D1D4', // Light Gray
  '#E8D5B7', // Beige
  '#C5E1A5', // Light Green
  '#B3E5FC', // Light Blue
  '#F8BBD0', // Light Pink
  '#000000', // Black
  '#374151', // Dark Gray
  '#FFFFFF', // White
  '#8B5CF6', // Purple
  '#D946EF', // Pink
  '#EC4899', // Rose
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
];

interface StoreEditorProps {
  isEditMode: boolean;
  isOwner: boolean;
  isSaving: boolean;
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
  userPlan?: string;
  profileFrameType: string;
  frameThickness: number;
  onThemeColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onAccentColorChange: (color: string) => void;
  onIconColorChange: (color: string) => void;
  onGradientFrameChange: (gradient: string) => void;
  onStoreNameChange: (name: string) => void;
  onStoreDescriptionChange: (desc: string) => void;
  onFontNameChange: (font: string) => void;
  onFontDescriptionChange: (font: string) => void;
  onFontBodyChange: (font: string) => void;
  onProfileFrameTypeChange: (frameType: string) => void;
  onFrameThicknessChange: (thickness: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function StoreEditor({
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
  userPlan,
  profileFrameType,
  frameThickness,
  onThemeColorChange,
  onTextColorChange,
  onAccentColorChange,
  onIconColorChange,
  onGradientFrameChange,
  onStoreNameChange,
  onStoreDescriptionChange,
  onFontNameChange,
  onFontDescriptionChange,
  onFontBodyChange,
  onProfileFrameTypeChange,
  onFrameThicknessChange,
  onSave,
  onCancel,
}: StoreEditorProps) {
  return (
    <>
      {/* === FLOATING EDIT CONTROLS (Visible when in edit mode) === */}
      {isOwner && isEditMode && (
        <div className="fixed bottom-16 left-2 right-2 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:right-auto z-[100] flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 w-full md:max-w-xl px-4 md:px-6">
          <div className="bg-white/95 backdrop-blur-xl px-4 md:px-6 py-4 md:py-5 rounded-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            {/* Color Pickers - Grid Layout */}
            {userPlan === 'free' ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Warna Toko</label>
                </div>
                <div
                  className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
                  title="Color customization is available for Premium plan. Upgrade to unlock this feature."
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Upgrade to Premium for color customization</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-xs transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <ColorPicker
                  value={themeColor}
                  onChange={onThemeColorChange}
                  label="Theme"
                  restricted={userPlan === 'premium'}
                  presetColorsOnly={userPlan === 'premium' ? PREMIUM_PRESET_COLORS : undefined}
                />
                <ColorPicker
                  value={textColor}
                  onChange={onTextColorChange}
                  label="Text"
                  restricted={userPlan === 'premium'}
                  presetColorsOnly={userPlan === 'premium' ? PREMIUM_PRESET_COLORS : undefined}
                />
                <ColorPicker
                  value={accentColor}
                  onChange={onAccentColorChange}
                  label="Accent"
                  restricted={userPlan === 'premium'}
                  presetColorsOnly={userPlan === 'premium' ? PREMIUM_PRESET_COLORS : undefined}
                />
                <ColorPicker
                  value={iconColor}
                  onChange={onIconColorChange}
                  label="Icon"
                  restricted={userPlan === 'premium'}
                  presetColorsOnly={userPlan === 'premium' ? PREMIUM_PRESET_COLORS : undefined}
                />
              </div>
            )}

            {/* Store Name & Description */}
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                value={storeName}
                onChange={(e) => onStoreNameChange(e.target.value)}
                placeholder="Nama Toko"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all placeholder:text-slate-400"
              />
              <textarea
                value={storeDescription}
                onChange={(e) => onStoreDescriptionChange(e.target.value)}
                placeholder="Deskripsi Toko"
                rows={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Gradient Frame Selector - PREMIUM only */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Gradient Frame</label>
              {userPlan === 'premium' ? (
                <select
                  value={gradientFrame}
                  onChange={(e) => onGradientFrameChange(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all"
                  title="Choose a gradient frame for your product cards"
                >
                  <option value="none">None</option>
                  <option value="shopee">Orange Yellow</option>
                  <option value="tiktok">Cyan Pink</option>
                  <option value="purple">Purple Gradient</option>
                  <option value="blue">Blue Gradient</option>
                  <option value="green">Green Gradient</option>
                  <option value="crimson">Crimson Red</option>
                </select>
              ) : (
                <div
                  className="flex-1 flex items-center justify-between bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
                  title="Gradient frames are available for Premium plan. Upgrade to unlock this feature."
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Upgrade to Premium for gradient frames</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-xs transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>

            {/* Profile Frame Selector - PREMIUM only */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Profile Frame</label>
              {userPlan === 'premium' ? (
                <select
                  value={profileFrameType}
                  onChange={(e) => onProfileFrameTypeChange(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all"
                  title="Choose a special frame for your profile avatar"
                >
                  <option value="none">None</option>
                  <option value="pro">PREMIUM Frame</option>
                  <option value="elite">ELITE Frame (Red)</option>
                  <option value="elite-yellow">ELITE Frame (Yellow)</option>
                  <option value="elite-orange">ELITE Frame (Orange)</option>
                  <option value="elite-pink">ELITE Frame (Pink)</option>
                </select>
              ) : (
                <div
                  className="flex-1 flex items-center justify-between bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
                  title="Profile frames are available for Premium plan. Upgrade to unlock this feature."
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Upgrade to Premium for profile frames</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-xs transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>

            {/* Font Selectors */}
            {userPlan === 'free' ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Font Kustomisasi</label>
                </div>
                <div
                  className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500"
                  title="Font customization is available for Premium plan. Upgrade to unlock this feature."
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Upgrade to Premium for font customization</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-xs transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Font Nama Toko</label>
                  <select
                    value={fontName}
                    onChange={(e) => onFontNameChange(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all"
                    title="Choose a font for your store name."
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Great Vibes">Great Vibes</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Font Deskripsi</label>
                  <select
                    value={fontDescription}
                    onChange={(e) => onFontDescriptionChange(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all"
                    title="Choose a font for your store description."
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Great Vibes">Great Vibes</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Font Body</label>
                  <select
                    value={fontBody}
                    onChange={(e) => onFontBodyChange(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3E47A8] transition-all"
                    title="Choose a font for product titles."
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Great Vibes">Great Vibes</option>
                  </select>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 bg-[#3E47A8] text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
