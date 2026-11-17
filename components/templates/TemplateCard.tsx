'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MasterTemplate } from '@/lib/templates/types';
import { Plus, CheckCircle2, ExternalLink, Globe } from 'lucide-react';

interface TemplateCardProps {
  template: MasterTemplate;
  onClick?: () => void;
  isAdded?: boolean;
  onAdd?: () => void;
}

export default function TemplateCard({ template, onClick, isAdded = false, onAdd }: TemplateCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = (template.previewImages && template.previewImages.filter(Boolean).length > 0)
    ? template.previewImages.filter(Boolean)[0]
    : template.thumbnail;

  return (
    <div
      className="bg-white rounded-[1px] shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10">
        {imgSrc && !imgError ? (
          <Image
            src={imgSrc}
            alt={template.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-[#A1A1AA]" strokeWidth={1.5} />
          </div>
        )}
        {template.badge && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white px-1.5 py-0.5 rounded text-[9px] font-light uppercase tracking-wider shadow-sm">
            {template.badge.replace('-', ' ')}
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-[12px] font-bold mb-1 line-clamp-1">{template.title}</h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            {template.originalPrice && template.originalPrice > template.price && (
              <span className="text-[10px] text-gray-400 line-through">
                Rp {template.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
            <span className="text-xs font-bold text-[#8B5CF6]">
              Rp {template.price.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex gap-1">
            {template.previewUrl && (
              <a
                href={template.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center p-1 rounded-[1px] bg-white border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all h-7 w-7"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAdd) onAdd();
              }}
              className={`flex items-center justify-center p-1 rounded-[1px] transition-colors h-7 w-7 ${
                isAdded
                  ? 'bg-[#F9F9FB] text-[#A1A1AA] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90'
              }`}
              disabled={isAdded}
            >
              {isAdded ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
