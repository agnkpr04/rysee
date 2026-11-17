"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { getSubCategories, hasSubCategories, getGranularCategories, hasGranularCategories } from '@/lib/categories';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  activeSubCategory: string;
  activeGranularCategory: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onGranularCategoryChange: (granularCategory: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, activeSubCategory, activeGranularCategory, onCategoryChange, onSubCategoryChange, onGranularCategoryChange }: CategoryFilterProps) {
  const subCategories = getSubCategories(activeCategory);
  const hasSubCats = hasSubCategories(activeCategory);
  const granularCategories = getGranularCategories(activeCategory, activeSubCategory);
  const hasGranularCats = hasGranularCategories(activeCategory, activeSubCategory);

  return (
    <div className="flex flex-col gap-4 w-full md:w-auto">
      {/* Parent Categories */}
      <div className="flex items-center gap-4 md:gap-6 text-[11px] uppercase tracking-wider font-light overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { onCategoryChange(cat); onSubCategoryChange('All'); onGranularCategoryChange('All'); }}
            className={`transition-colors whitespace-nowrap ${activeCategory === cat ? '' : 'hover:text-black'}`}
            style={{ color: activeCategory === cat ? '#8B5CF6' : '#A1A1AA' }}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Sub Categories - Only show when category has subcategories */}
      {hasSubCats && (
        <div className="flex items-center gap-4 md:gap-6 text-[11px] uppercase tracking-wider font-light overflow-x-auto">
          <button
            onClick={() => { onSubCategoryChange('All'); onGranularCategoryChange('All'); }}
            className={`transition-colors whitespace-nowrap ${activeSubCategory === 'All' ? '' : 'hover:text-black'}`}
            style={{ color: activeSubCategory === 'All' ? '#8B5CF6' : '#A1A1AA' }}
          >
            All
          </button>
          {subCategories.map((subCat) => (
            <button
              key={subCat}
              onClick={() => { onSubCategoryChange(subCat); onGranularCategoryChange('All'); }}
              className={`transition-colors whitespace-nowrap ${activeSubCategory === subCat ? '' : 'hover:text-black'}`}
              style={{ color: activeSubCategory === subCat ? '#8B5CF6' : '#A1A1AA' }}
            >
              {subCat}
            </button>
          ))}
        </div>
      )}
      {/* Granular Categories - Only show when subcategory has granular options */}
      {hasGranularCats && (
        <div className="flex items-center gap-4 md:gap-6 text-[11px] uppercase tracking-wider font-light overflow-x-auto">
          <button
            onClick={() => onGranularCategoryChange('All')}
            className={`transition-colors whitespace-nowrap ${activeGranularCategory === 'All' ? '' : 'hover:text-black'}`}
            style={{ color: activeGranularCategory === 'All' ? '#8B5CF6' : '#A1A1AA' }}
          >
            All
          </button>
          {granularCategories.map((granularCat) => (
            <button
              key={granularCat}
              onClick={() => onGranularCategoryChange(granularCat)}
              className={`transition-colors whitespace-nowrap ${activeGranularCategory === granularCat ? '' : 'hover:text-black'}`}
              style={{ color: activeGranularCategory === granularCat ? '#8B5CF6' : '#A1A1AA' }}
            >
              {granularCat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}