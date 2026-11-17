"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Copy, Check, Link as LinkIcon, Store, Rocket, Eye, EyeOff, Save, Loader2 } from "lucide-react";

interface BioSettingsProps {
  userId: string;
  username?: string | null;
  storeName?: string | null;
  avatarUrl?: string | null;
  referralCode?: string | null;
  initialBioDescription?: string | null;
  initialBioStoreUrl?: string | null;
  initialBioReferralUrl?: string | null;
  initialBioEnabled?: boolean | null;
  initialShowStoreButton?: boolean | null;
  initialShowReferralButton?: boolean | null;
}

export default function BioSettings({
  userId,
  username,
  storeName,
  avatarUrl,
  referralCode,
  initialBioDescription = "",
  initialBioStoreUrl = "",
  initialBioReferralUrl = "",
  initialBioEnabled = true,
  initialShowStoreButton = true,
  initialShowReferralButton = true,
}: BioSettingsProps) {
  const [bioDescription, setBioDescription] = useState(initialBioDescription || "");
  const [bioStoreUrl, setBioStoreUrl] = useState(initialBioStoreUrl || "");
  const [bioReferralUrl, setBioReferralUrl] = useState(initialBioReferralUrl || "");
  const [bioEnabled, setBioEnabled] = useState(initialBioEnabled ?? true);
  const [showStoreButton, setShowStoreButton] = useState(initialShowStoreButton ?? true);
  const [showReferralButton, setShowReferralButton] = useState(initialShowReferralButton ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const bioLink = username ? `${window.location.origin}/bio/${username}` : "";
  const defaultStoreUrl = `/affstore/${userId}`;
  const defaultReferralUrl = `/?ref=${referralCode || ""}`;

  const handleCopyLink = () => {
    if (!bioLink) return;
    navigator.clipboard.writeText(bioLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSave = async () => {
    if (!username) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("Sesi tidak valid. Silakan login ulang.");
        return;
      }

      const res = await fetch(`/api/bio/${username}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bioDescription: bioDescription || null,
          bioStoreUrl: bioStoreUrl || null,
          bioReferralUrl: bioReferralUrl || null,
          bioEnabled,
          showStoreButton,
          showReferralButton,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan bio settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 py-6">
      {/* Bio Link */}
      <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
        <h3 className="text-sm font-medium text-[#18181B] mb-4">Link Bio Publik</h3>
        <div className="flex flex-col gap-3">
          <div className="px-4 py-3 bg-[#F9F9FB] rounded-lg border border-gray-100 text-sm font-light text-[#71717A] break-all">
            {bioLink || "Username belum diatur"}
          </div>
          <button
            onClick={handleCopyLink}
            disabled={!bioLink}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white rounded-lg text-sm font-light hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? "Tersalin" : "Salin Link"}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
        <h3 className="text-sm font-medium text-[#18181B] mb-4">Preview Profil</h3>
        <div className="flex items-center gap-4 p-4 bg-[#F9F9FB] rounded-xl">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-light">
              {(storeName || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#18181B]">{storeName || "My Store"}</p>
            <p className="text-xs text-[#A1A1AA] font-light">@{username || "username"}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm space-y-5">
        <h3 className="text-sm font-medium text-[#18181B]">Pengaturan Bio</h3>

        {/* Toggle Bio Enabled */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9FB]">
          <div className="flex items-center gap-2">
            {bioEnabled ? <Eye className="w-4 h-4 text-[#8B5CF6]" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
            <div>
              <p className="text-sm text-[#18181B] font-light">Aktifkan Halaman Bio</p>
              <p className="text-xs text-[#A1A1AA] font-light">Halaman bio bisa diakses publik</p>
            </div>
          </div>
          <button
            onClick={() => setBioEnabled(!bioEnabled)}
            className={`relative w-11 h-6 rounded-full transition ${bioEnabled ? "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]" : "bg-gray-200"}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bioEnabled ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* Bio Description */}
        <div>
          <label className="block text-sm font-medium text-[#18181B] mb-2">Deskripsi Bio</label>
          <textarea
            value={bioDescription}
            onChange={(e) => setBioDescription(e.target.value)}
            placeholder="Tulis deskripsi singkat tentang dirimu atau tokomu..."
            className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D946EF]/20 focus:border-[#D946EF] outline-none text-sm font-light resize-none"
            rows={3}
          />
          <p className="text-xs text-[#A1A1AA] font-light mt-1">{bioDescription.length}/500 karakter</p>
        </div>

        {/* Custom Store URL */}
        <div>
          <label className="text-sm font-medium text-[#18181B] mb-2 flex items-center gap-2">
            <Store className="w-4 h-4" /> Link Toko Custom
          </label>
          <input
            type="text"
            value={bioStoreUrl}
            onChange={(e) => setBioStoreUrl(e.target.value)}
            placeholder={`Default: ${defaultStoreUrl}`}
            className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D946EF]/20 focus:border-[#D946EF] outline-none text-sm font-light"
          />
          <p className="text-xs text-[#A1A1AA] font-light mt-1">Kosongkan untuk pakai link toko default</p>
        </div>

        {/* Custom Referral URL */}
        <div>
          <label className="text-sm font-medium text-[#18181B] mb-2 flex items-center gap-2">
            <Rocket className="w-4 h-4" /> Link Referral Custom
          </label>
          <input
            type="text"
            value={bioReferralUrl}
            onChange={(e) => setBioReferralUrl(e.target.value)}
            placeholder={`Default: ${defaultReferralUrl}`}
            className="w-full px-4 py-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D946EF]/20 focus:border-[#D946EF] outline-none text-sm font-light"
          />
          <p className="text-xs text-[#A1A1AA] font-light mt-1">Kosongkan untuk pakai link referral default</p>
        </div>

        {/* Toggle Buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#18181B]">Visibilitas Tombol</p>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9FB]">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#8B5CF6]" />
              <p className="text-sm text-[#18181B] font-light">Tampilkan Tombol Toko</p>
            </div>
            <button
              onClick={() => setShowStoreButton(!showStoreButton)}
              className={`relative w-11 h-6 rounded-full transition ${showStoreButton ? "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showStoreButton ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9F9FB]">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#EC4899]" />
              <p className="text-sm text-[#18181B] font-light">Tampilkan Tombol Referral</p>
            </div>
            <button
              onClick={() => setShowReferralButton(!showReferralButton)}
              className={`relative w-11 h-6 rounded-full transition ${showReferralButton ? "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899]" : "bg-gray-200"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showReferralButton ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving || !username}
          className={`w-full py-3 rounded-lg text-white font-light text-sm flex items-center justify-center gap-2 transition ${
            isSaving || !username ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] hover:opacity-90"
          }`}
        >
          {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : saveSuccess ? <><Check className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> Simpan Pengaturan</>}
        </button>
      </div>
    </div>
  );
}
