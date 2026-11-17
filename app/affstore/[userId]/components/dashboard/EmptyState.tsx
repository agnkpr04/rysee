import React from 'react';
import Link from 'next/link';
import { Plus, SearchX, PackagePlus } from 'lucide-react';

interface EmptyStateProps {
  type: 'empty' | 'filtered';
}

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === 'filtered') {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6 bg-white border border-dashed border-gray-100 rounded-2xl transition-all">
        <div className="w-12 h-12 md:w-16 md:h-16 mb-4 bg-[#F9F9FB] rounded-xl flex items-center justify-center border border-gray-50">
          <SearchX className="w-5 h-5 md:w-6 md:h-6 text-[#A1A1AA]" strokeWidth={1.5} />
        </div>
        
        <div className="text-center">
          <h3 className="text-[15px] md:text-lg font-medium tracking-tight text-[#18181B] mb-1">
            Tidak ada hasil
          </h3>
          <p className="text-[12px] md:text-sm text-[#A1A1AA] font-light">
            Coba kategori lain atau reset filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 bg-white border border-gray-50 rounded-2xl shadow-sm">
      <div className="relative mb-6">
        <div className={`absolute inset-0 bg-gradient-to-tr ${accentGradient} opacity-[0.1] blur-xl rounded-full`} />
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-50 shadow-sm">
          <PackagePlus className="w-8 h-8 text-[#18181B]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h3 className="text-lg md:text-xl font-medium tracking-tight text-[#18181B]">
          Mulai Toko Anda
        </h3>
        <p className="text-[12px] md:text-[13px] text-[#A1A1AA] font-light max-w-[240px] leading-relaxed">
          Pilih produk terbaik dan bangun koleksi digital Anda sekarang.
        </p>
      </div>

      <Link
        href="/affstore"
        className="group relative px-8 py-3 bg-[#18181B] rounded-full overflow-hidden transition-all duration-300 active:scale-95"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative flex items-center gap-2.5">
          <Plus className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          <span className="text-[12px] font-light tracking-wider text-white uppercase">
            Tambah Produk
          </span>
        </div>
      </Link>
    </div>
  );
}