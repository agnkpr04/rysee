"use client";

import { ChevronDown, ChevronUp, Gift } from "lucide-react";
import { useState } from "react";

interface ReferralInfoProps {
  textColor?: string;
  accentColor?: string;
}

export default function ReferralInfo({
  textColor = "#1e293b",
  accentColor = "#3E47A8",
}: ReferralInfoProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#F9F9FB] hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4" style={{ color: accentColor }} />
          <span
            className="text-sm font-medium"
            style={{ color: textColor }}
          >
            Program Referral
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 py-4 space-y-3">
          <p
            className="text-xs font-light leading-relaxed"
            style={{ color: textColor, opacity: 0.75 }}
          >
            Gabung jadi affiliate dan dapatkan komisi dari setiap teman yang
            upgrade membership melalui link referral kamu.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <p
                className="text-xs font-light"
                style={{ color: textColor, opacity: 0.7 }}
              >
                Komisi hingga Rp 60.000 per referral yang upgrade
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <p
                className="text-xs font-light"
                style={{ color: textColor, opacity: 0.7 }}
              >
                Tanpa modal, cukup share link ke teman-temanmu
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <p
                className="text-xs font-light"
                style={{ color: textColor, opacity: 0.7 }}
              >
                Komisi langsung masuk ke saldo kamu
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
