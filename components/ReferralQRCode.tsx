"use client";

import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy } from 'lucide-react';
import { useState } from 'react';

interface ReferralQRCodeProps {
  referralCode: string;
  baseUrl?: string;
}

export default function ReferralQRCode({ referralCode, baseUrl = '' }: ReferralQRCodeProps) {
  const referralUrl = `${baseUrl}?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const pngFile = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `rysee-referral-${referralCode}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!referralCode) {
    return (
      <div className="text-center text-[#A1A1AA] text-sm">
        Loading referral code...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
        <QRCodeCanvas
          value={referralUrl}
          size={200}
          level="H"
          includeMargin={false}
        />
      </div>
      <div className="flex gap-3 w-full justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition text-sm font-light flex-1 justify-center"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Download QR</span>
          <span className="sm:hidden">Download</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-light text-[#18181B] flex-1 justify-center"
        >
          {copied ? (
            <>
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Copied!</span>
              <span className="sm:hidden">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Copy Link</span>
              <span className="sm:hidden">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
