"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeUrl: string;
  copyStatus: 'idle' | 'copied';
  onCopyLink: () => void;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function ShareModal({ 
  isOpen, 
  onClose, 
  storeUrl, 
  copyStatus, 
  onCopyLink
}: ShareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-50 p-8 relative z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#A1A1AA] hover:text-[#18181B] transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <h2 className="text-lg font-light text-[#18181B] mb-1 tracking-tight">Share Your Store</h2>
            <p className="text-[12px] text-[#A1A1AA] mb-6 font-light">Copy your store link below</p>

            <div className="space-y-3">
              <button
                onClick={onCopyLink}
                className="w-full py-3.5 rounded-xl font-light tracking-wider text-[10px] transition-all bg-gray-50 text-[#18181B] hover:bg-gray-100 border border-gray-50 flex items-center justify-center gap-2"
              >
                {copyStatus === 'copied' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={1.5} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" strokeWidth={1.5} /> Copy Link
                  </>
                )}
              </button>

              <div className="bg-[#F9F9FB] rounded-lg px-4 py-3 mt-4">
                <p className="text-[11px] text-[#A1A1AA] font-light break-all">{storeUrl}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
