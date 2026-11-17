"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Download, ExternalLink, Trash2, Edit, X, FolderOpen, CheckSquare, Square, Play, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  product: any;
  downloadStatus: { [key: string]: 'idle' | 'loading' | 'success' | 'error' };
  userId: string;
  onDownload: (assetUrl: string, productId: string) => void;
  onDelete: (productId: string) => void;
  onEditLink: (productId: string, newLink: string) => void;
  editLinkStatus: { loading: boolean; success: boolean; message: string };
  activePlatform: string;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (productId: string) => void;
  onEnterSelectionMode?: () => void;
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function ProductCard({ product, downloadStatus, userId, onDownload, onDelete, onEditLink, editLinkStatus, activePlatform, isSelectionMode = false, isSelected = false, onToggleSelection, onEnterSelectionMode }: ProductCardProps) {
  const masterProduct = product.product || {};
  const assets = Array.isArray(masterProduct.contentUrl) ? masterProduct.contentUrl : [];
  const hasAssets = assets.length > 0;
  const hasVideo = masterProduct.videoUrl && (masterProduct.assetType === 'video' || masterProduct.assetType === 'both');
  const status = downloadStatus[product.productId] || 'idle';

  // Determine platform for frame gradient
  const isShopee = masterProduct.shopeeLink || masterProduct.productUrl?.includes('shopee');
  const isTikTok = masterProduct.tiktokLink || masterProduct.productUrl?.includes('tiktok');
  const frameGradient = isShopee ? 'from-[#FF9933] to-[#FFCC33]' : isTikTok ? 'from-[#69C9D0] via-[#EE1D52] to-[#69C9D0]' : '';

  // Extract URLs from asset objects (handle both string and object formats)
  const assetUrls = assets.map((asset: any) => typeof asset === 'string' ? asset : asset.url);

  // Include video URL if available
  if (hasVideo && masterProduct.videoUrl) {
    assetUrls.push(masterProduct.videoUrl);
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLink, setEditLink] = useState(product.affiliateLink || '');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (activeDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 10,
        left: rect.right - 140
      });
    }
  }, [activeDropdown]);

  const handleEditSubmit = () => {
    if (editLink.trim()) {
      onEditLink(product.productId, editLink.trim());
      if (!editLinkStatus.loading) {
        setIsEditModalOpen(false);
      }
    }
  };

  const handleDownloadAllAssets = () => {
    console.log('Download all assets clicked', { assetUrls, productId: product.productId });
    if (assetUrls.length === 0) {
      console.error('No assets to download');
      return;
    }
    assetUrls.forEach((url: string, index: number) => {
      setTimeout(() => {
        console.log(`Downloading asset ${index + 1}:`, url);
        onDownload(url, product.productId);
      }, index * 500); // Stagger downloads by 500ms to avoid rate limiting
    });
  };

  return (
    <>
      <motion.div
        className="group relative cursor-pointer"
      >
      {/* Card Container */}
      <div className={`aspect-[4/5] bg-[#F9F9FB] rounded-[1px] mb-4 overflow-hidden relative shadow-sm ${frameGradient ? `bg-gradient-to-r ${frameGradient} p-[2px]` : 'border border-gray-50'}`}>
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSelection?.(product.productId); }}
            className="absolute top-3 left-3 z-20 w-6 h-6 rounded-md bg-white/90 backdrop-blur-sm border-2 border-gray-200 flex items-center justify-center hover:border-[#8B5CF6] transition-all shadow-sm"
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-[#8B5CF6] fill-[#8B5CF6]" strokeWidth={2} />
            ) : (
              <Square className="w-4 h-4 text-gray-400" strokeWidth={2} />
            )}
          </button>
        )}
        <div className="w-full h-full bg-[#F9F9FB] rounded-[1px] overflow-hidden">
          {masterProduct.thumbnail && !imageError ? (
            <>
              <Image
                src={masterProduct.thumbnail}
                alt={masterProduct.title || ''}
                width={400}
                height={500}
                className="w-full h-full object-cover"
                unoptimized={true}
                onError={() => setImageError(true)}
              />
              {masterProduct.videoUrl && (masterProduct.assetType === 'video' || masterProduct.assetType === 'both') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-[1px] flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-[#8B5CF6] fill-[#8B5CF6]" strokeWidth={2} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#A1A1AA]" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Glassmorphism Bar - Full Width at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-white/50 px-4 py-3 flex justify-between items-center">
          <p className="text-xs font-light bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
            Rp {masterProduct.price?.toLocaleString('id-ID')}
          </p>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={(e) => { e.stopPropagation(); setActiveDropdown(!activeDropdown); }}
              className="flex items-center justify-center p-1 text-[#18181B] hover:opacity-70 transition-opacity"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Title Below Card */}
      <div className="px-2">
        <h4 className="text-[11px] font-light tracking-wider truncate text-[#18181B]">{masterProduct.title}</h4>
      </div>

      {/* Dropdown Menu using Portal */}
      {activeDropdown && createPortal(
        <div className="fixed inset-0 z-[100]" onClick={() => setActiveDropdown(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[140px]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {hasAssets && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsAssetModalOpen(true); setActiveDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors w-full"
              >
                <FolderOpen className="w-3 h-3" strokeWidth={1.5} />
                View Assets
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setEditLink(product.affiliateLink || ''); setIsEditModalOpen(true); setActiveDropdown(false); }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors w-full"
            >
              <Edit className="w-3 h-3" strokeWidth={1.5} />
              Edit Link
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product.productId); setActiveDropdown(false); }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <Trash2 className="w-3 h-3" strokeWidth={1.5} />
              Hapus
            </button>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Edit Link Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            />
            <div
              className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-50 p-8 relative z-10"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 text-[#A1A1AA] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <h2 className="text-lg font-light text-[#18181B] mb-1">Edit Affiliate Link</h2>
              <p className="text-[12px] text-[#A1A1AA] mb-6 font-light">Update link for <span className="font-medium text-[#18181B]">{masterProduct.title}</span></p>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://shope.ee/..."
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full bg-[#F9F9FB] border border-gray-50 rounded-2xl py-3 px-4 outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all text-xs font-light"
                />
                {editLinkStatus.message && (
                  <p className={`text-[11px] font-light ${editLinkStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                    {editLinkStatus.message}
                  </p>
                )}
                <button
                  onClick={handleEditSubmit}
                  disabled={editLinkStatus.loading}
                  className={`w-full py-3.5 rounded-2xl font-light tracking-wider text-[10px] transition-all bg-gradient-to-r ${accentGradient} text-white hover:opacity-90 shadow-sm ${editLinkStatus.loading ? 'opacity-70' : ''}`}
                >
                  {editLinkStatus.loading ? 'Updating...' : 'Update Link'}
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    onEnterSelectionMode?.();
                  }}
                  className="w-full py-3.5 rounded-2xl font-light tracking-wider text-[10px] transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-sm"
                >
                  Edit Beberapa
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this product from your store?')) {
                      onDelete(product.productId);
                      setIsEditModalOpen(false);
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl font-light tracking-wider text-[10px] transition-all bg-red-500 text-white hover:bg-red-600 shadow-sm"
                >
                  Remove from Store
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset Preview Modal */}
      {isAssetModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsAssetModalOpen(false)}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-50 p-6 relative z-10 pointer-events-auto"
          >
            <button
              onClick={() => setIsAssetModalOpen(false)}
              className="absolute top-4 right-4 text-[#A1A1AA] hover:text-[#18181B] z-10"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <h2 className="text-lg font-light text-[#18181B] mb-4">Product Assets</h2>
            {assetUrls.length > 0 ? (
              <>
                <div className="flex gap-4 overflow-x-auto pb-4 mb-2 no-scrollbar">
                  {assetUrls.map((url: string, index: number) => {
                    const isVideo = url === masterProduct.videoUrl || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
                    return (
                      <div
                        key={index}
                        className="flex-shrink-0 w-48 md:w-64 aspect-square bg-[#F9F9FB] rounded-xl overflow-hidden"
                      >
                        {isVideo ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Asset ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleDownloadAllAssets}
                  className={`w-full py-3 rounded-xl font-light tracking-wider text-[11px] transition-all bg-gradient-to-r ${accentGradient} text-white hover:opacity-90 shadow-sm flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  Download All Assets ({assetUrls.length})
                </button>
              </>
            ) : (
              <div className="text-center py-12 text-[#A1A1AA]">No assets available</div>
            )}
          </motion.div>
        </div>,
        document.body
      )}
      </motion.div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
