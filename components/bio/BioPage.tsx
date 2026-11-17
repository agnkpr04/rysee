"use client";

import BioHeader from "./BioHeader";
import BioButton from "./BioButton";
import BioGuideSection from "./BioGuideSection";

interface BioData {
  id: string;
  name?: string | null;
  username?: string | null;
  storeName?: string | null;
  storeDescription?: string | null;
  avatarUrl?: string | null;
  storeTheme?: Record<string, any> | null;
  bioDescription?: string | null;
  showStoreButton?: boolean | null;
  showReferralButton?: boolean | null;
  referralCode?: string | null;
  storeUrl: string;
  referralUrl: string;
}

interface BioPageProps {
  bio: BioData;
}

export default function BioPage({ bio }: BioPageProps) {
  const theme = (bio.storeTheme as Record<string, any>) || {};
  const themeColor = theme.primaryColor || theme.themeColor || "#D1D1D4";
  const textColor = theme.textColor || "#1e293b";
  const accentColor = theme.accentColor || "#3E47A8";
  const profileFrameType = theme.profileFrameType || "none";
  const frameThickness = theme.frameThickness || 3;

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #fdf4ff 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Desktop Landing Page */}
      <div className="hidden md:flex w-full max-w-4xl flex-col items-center space-y-8">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-xs font-medium text-purple-600">Platform Affiliate Digital</span>
        </div>

        {/* Profile Section */}
        <div className="text-center">
          <BioHeader
            avatarUrl={bio.avatarUrl}
            storeName={bio.storeName}
            bioDescription={bio.bioDescription}
            themeColor={themeColor}
            textColor="#1e293b"
            profileFrameType={profileFrameType}
            frameThickness={frameThickness}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 w-full max-w-lg">
          {bio.showStoreButton && (
            <BioButton
              label="Lihat Produk"
              href={bio.storeUrl}
              accentColor={accentColor}
              textColor="#ffffff"
            />
          )}
          {bio.showReferralButton && bio.referralCode && (
            <BioButton
              label="Gabung Rysee"
              href={bio.referralUrl}
              accentColor={textColor}
              textColor="#ffffff"
            />
          )}
        </div>

        {/* Guide Section */}
        <div className="w-full max-w-lg">
          <BioGuideSection accentColor={accentColor} />
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-xs text-gray-400 font-light">Powered by Rysee</p>
        </div>
      </div>

      {/* Mobile Link-in-Bio */}
      <div className="md:hidden w-full max-w-md">
        <BioHeader
          avatarUrl={bio.avatarUrl}
          storeName={bio.storeName}
          bioDescription={bio.bioDescription}
          themeColor={themeColor}
          textColor={textColor}
          profileFrameType={profileFrameType}
          frameThickness={frameThickness}
        />

        <div className="space-y-3 mb-6 mx-4">
          {bio.showStoreButton && (
            <BioButton
              label="Lihat Produk"
              href={bio.storeUrl}
              accentColor={accentColor}
              textColor="#ffffff"
            />
          )}

          {bio.showReferralButton && bio.referralCode && (
            <BioButton
              label="Gabung Rysee"
              href={bio.referralUrl}
              accentColor={textColor}
              textColor="#ffffff"
            />
          )}
        </div>

        <BioGuideSection accentColor={accentColor} />

        <div className="mt-8 text-center">
          <p
            className="text-[10px] font-light"
            style={{ color: textColor, opacity: 0.4 }}
          >
            Powered by Rysee
          </p>
        </div>
      </div>
    </div>
  );
}
