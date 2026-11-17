"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Plus, ShoppingBag, Package } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface DigitalProductDetailModalProps {
  product: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    badge: string | null;
    thumbnail: string;
    previewUrl: string | null;
    previewImages: string[];
    downloadUrl?: string;
    category: string;
    subCategory: string | null;
    productType: string | null;
    contentCategory: string | null;
    features: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToStore?: (productId: string) => void;
  isAdded?: boolean;
  showAddButton?: boolean;
  onPurchase?: (product: any) => void;
  showPurchaseButton?: boolean;
}

export default function DigitalProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToStore,
  isAdded = false,
  showAddButton = true,
  onPurchase,
  showPurchaseButton = false,
}: DigitalProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  const filteredPreviewImages = product.previewImages?.filter(Boolean) || [];
  const allImages = filteredPreviewImages.length > 0
    ? filteredPreviewImages
    : product.thumbnail ? [product.thumbnail] : [];

  const handleImgError = (index: number) => {
    setBrokenImages(prev => new Set([...prev, index]));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>

          {/* Left: Image Carousel */}
          <div className="w-full md:w-1/2 bg-[#F9F9FB] relative">
            <div className="aspect-[16/9] relative overflow-hidden">
              {allImages[currentImageIndex] && !brokenImages.has(currentImageIndex) ? (
                <Image
                  src={allImages[currentImageIndex]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => handleImgError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-full bg-[#F9F9FB] flex items-center justify-center">
                  <Package className="w-12 h-12 text-[#A1A1AA]" strokeWidth={1.5} />
                </div>
              )}
              
              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inline Preview Carousel */}
            {allImages.length > 1 && (
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {allImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-[#8B5CF6]' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      {url && !brokenImages.has(index) ? (
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={() => handleImgError(index)}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F9F9FB] flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
            <h2 className="text-xl font-light text-[#18181B] mb-2">{product.title}</h2>

            <div className="flex items-center gap-2 mb-4">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              )}
              <span className="text-2xl font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.badge && (
                <span className="text-[10px] px-2 py-1 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white rounded-full font-light uppercase tracking-wider">
                  {product.badge.replace('-', ' ')}
                </span>
              )}
              <span className="text-[10px] px-2 py-1 bg-[#F9F9FB] text-[#A1A1AA] rounded-full font-light uppercase tracking-wider">
                {product.productType || 'Digital Product'}
              </span>
              {product.category && (
                <span className="text-[10px] px-2 py-1 bg-[#F9F9FB] text-[#A1A1AA] rounded-full font-light uppercase tracking-wider">
                  {product.category}
                </span>
              )}
              {product.subCategory && (
                <span className="text-[10px] px-2 py-1 bg-[#F9F9FB] text-[#A1A1AA] rounded-full font-light uppercase tracking-wider">
                  {product.subCategory}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#18181B] mb-2">Description</h3>
                <p className="text-xs font-light text-[#A1A1AA] leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#18181B] mb-2">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-xs font-light text-[#A1A1AA] flex items-start gap-2">
                      <span className="text-[#8B5CF6] mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Store Button */}
            {showAddButton && onAddToStore && (
              <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={() => onAddToStore(product.id)}
                  disabled={isAdded}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                    isAdded
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-xs font-light tracking-wider">Added to Store</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-xs font-light tracking-wider">Add to Store</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Purchase Button */}
            {showPurchaseButton && onPurchase && (
              <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={() => onPurchase(product)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-xs font-light tracking-wider">Purchase</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
