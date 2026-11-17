"use client";

import React from 'react';
import { getSubCategories, hasSubCategories, getGranularCategories, hasGranularCategories } from '@/lib/categories';

interface UnifiedFilterProps {
  // Data
  products: any[];
  templates: any[];
  digitalProducts: any[];
  availableProductCategories: string[];
  availableTemplateCategories: Array<{ value: string; label: string }>;
  availableDigitalProductCategories: Array<{ value: string; label: string }>;
  availableDigitalProductSubCategories: Array<{ value: string; label: string }>;

  // State
  activeTab: 'products' | 'templates' | 'digital-products' | 'all';
  productCategory: string;
  productSubCategory: string;
  productGranularCategory: string;
  templateCategory: string;
  digitalProductCategory: string;
  digitalProductSubCategory: string;
  searchQuery: string;

  // Actions
  onTabChange: (tab: 'products' | 'templates' | 'digital-products' | 'all') => void;
  onProductCategoryChange: (category: string) => void;
  onProductSubCategoryChange: (subCategory: string) => void;
  onProductGranularCategoryChange: (granularCategory: string) => void;
  onTemplateCategoryChange: (category: string) => void;
  onDigitalProductCategoryChange: (category: string) => void;
  onDigitalProductSubCategoryChange: (subCategory: string) => void;
  onSearchChange: (query: string) => void;

  // Styling
  accentColor?: string;
  textColor?: string;
  themeColor?: string;
  hideTypeTabs?: boolean;
  useGradient?: boolean;
}

export default function UnifiedFilter({
  products,
  templates,
  digitalProducts,
  availableProductCategories,
  availableTemplateCategories,
  availableDigitalProductCategories,
  availableDigitalProductSubCategories,
  activeTab,
  productCategory,
  productSubCategory,
  productGranularCategory,
  templateCategory,
  digitalProductCategory,
  digitalProductSubCategory,
  searchQuery,
  onTabChange,
  onProductCategoryChange,
  onProductSubCategoryChange,
  onProductGranularCategoryChange,
  onTemplateCategoryChange,
  onDigitalProductCategoryChange,
  onDigitalProductSubCategoryChange,
  onSearchChange,
  accentColor = '#8B5CF6',
  textColor = '#A1A1AA',
  themeColor = '#8B5CF6',
  hideTypeTabs = false,
  useGradient = false
}: UnifiedFilterProps) {
  const hasProducts = products.length > 0;
  const hasTemplates = templates.length > 0;
  const hasDigitalProducts = digitalProducts.length > 0;
  const showTabs = (hasProducts && hasTemplates) || (hasProducts && hasDigitalProducts) || (hasTemplates && hasDigitalProducts);

  const productSubCategories = getSubCategories(productCategory);
  const hasProductSubCats = hasSubCategories(productCategory);
  const productGranularCategories = getGranularCategories(productCategory, productSubCategory);
  const hasProductGranularCats = hasGranularCategories(productCategory, productSubCategory);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Left: Category Filters */}
      <div className="flex-1 flex flex-col gap-4 overflow-x-auto">
        {/* Type Tabs - Only show if multiple types exist and not hidden */}
        {!hideTypeTabs && showTabs && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            {/* {hasProducts && (
              <button
                onClick={() => onTabChange('products')}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${activeTab === 'products' ? '' : 'hover:text-black'}`}
                style={{ color: activeTab === 'products' ? 'white' : textColor, backgroundColor: activeTab === 'products' ? accentColor : 'transparent' }}
              >
                Produk
              </button>
            )} */}
            {hasTemplates && (
              <button
                onClick={() => onTabChange('templates')}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${activeTab === 'templates' ? '' : 'hover:text-black'}`}
                style={{ color: activeTab === 'templates' ? 'white' : textColor, backgroundColor: activeTab === 'templates' ? accentColor : 'transparent' }}
              >
                Templates
              </button>
            )}
            {hasDigitalProducts && (
              <button
                onClick={() => onTabChange('digital-products')}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${activeTab === 'digital-products' ? '' : 'hover:text-black'}`}
                style={{ color: activeTab === 'digital-products' ? 'white' : textColor, backgroundColor: activeTab === 'digital-products' ? accentColor : 'transparent' }}
              >
                Digital Products
              </button>
            )}
            <div className="w-px h-4 bg-black/10" />
          </div>
        )}

        {/* Product Categories */}
        {/* {(activeTab === 'products' || (!showTabs && hasProducts)) && hasProducts && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            {availableProductCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onProductCategoryChange(cat);
                  onProductSubCategoryChange('All');
                  onProductGranularCategoryChange('All');
                }}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${productCategory === cat ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: productCategory === cat ? 'white' : textColor, backgroundColor: productCategory === cat ? accentColor : 'transparent' } : { color: productCategory === cat ? 'white' : textColor }}
              >
                {cat}
              </button>
            ))}
          </div>
        )} */}

        {/* Product Sub Categories */}
        {/* {(activeTab === 'products' || (!showTabs && hasProducts)) && hasProducts && hasProductSubCats && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            <button
              onClick={() => {
                onProductSubCategoryChange('All');
                onProductGranularCategoryChange('All');
              }}
              className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${productSubCategory === 'All' ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
              style={!useGradient ? { color: productSubCategory === 'All' ? 'white' : textColor, backgroundColor: productSubCategory === 'All' ? accentColor : 'transparent' } : { color: productSubCategory === 'All' ? 'white' : textColor }}
            >
              All
            </button>
            {productSubCategories.map((subCat) => (
              <button
                key={subCat}
                onClick={() => {
                  onProductSubCategoryChange(subCat);
                  onProductGranularCategoryChange('All');
                }}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${productSubCategory === subCat ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: productSubCategory === subCat ? 'white' : textColor, backgroundColor: productSubCategory === subCat ? accentColor : 'transparent' } : { color: productSubCategory === subCat ? 'white' : textColor }}
              >
                {subCat}
              </button>
            ))}
          </div>
        )} */}

        {/* Product Granular Categories */}
        {/* {(activeTab === 'products' || (!showTabs && hasProducts)) && hasProducts && hasProductGranularCats && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            <button
              onClick={() => onProductGranularCategoryChange('All')}
              className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${productGranularCategory === 'All' ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
              style={!useGradient ? { color: productGranularCategory === 'All' ? 'white' : textColor, backgroundColor: productGranularCategory === 'All' ? accentColor : 'transparent' } : { color: productGranularCategory === 'All' ? 'white' : textColor }}
            >
              All
            </button>
            {productGranularCategories.map((granularCat) => (
              <button
                key={granularCat}
                onClick={() => onProductGranularCategoryChange(granularCat)}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${productGranularCategory === granularCat ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: productGranularCategory === granularCat ? 'white' : textColor, backgroundColor: productGranularCategory === granularCat ? accentColor : 'transparent' } : { color: productGranularCategory === granularCat ? 'white' : textColor }}
              >
                {granularCat}
              </button>
            ))}
          </div>
        )} */}

        {/* Template Categories */}
        {(activeTab === 'templates' || (!showTabs && hasTemplates)) && hasTemplates && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            <button
              onClick={() => onTemplateCategoryChange('')}
              className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${templateCategory === '' ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
              style={!useGradient ? { color: templateCategory === '' ? 'white' : textColor, backgroundColor: templateCategory === '' ? accentColor : 'transparent' } : { color: templateCategory === '' ? 'white' : textColor }}
            >
              All
            </button>
            {availableTemplateCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onTemplateCategoryChange(cat.value)}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${templateCategory === cat.value ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: templateCategory === cat.value ? 'white' : textColor, backgroundColor: templateCategory === cat.value ? accentColor : 'transparent' } : { color: templateCategory === cat.value ? 'white' : textColor }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Digital Product Categories */}
        {(activeTab === 'digital-products' || (!showTabs && hasDigitalProducts)) && hasDigitalProducts && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            {availableDigitalProductCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onDigitalProductCategoryChange(cat.value)}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${digitalProductCategory === cat.value ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: digitalProductCategory === cat.value ? 'white' : textColor, backgroundColor: digitalProductCategory === cat.value ? accentColor : 'transparent' } : { color: digitalProductCategory === cat.value ? 'white' : textColor }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Digital Product Sub Categories - Only show when a product type is selected */}
        {(activeTab === 'digital-products' || (!showTabs && hasDigitalProducts)) && hasDigitalProducts && digitalProductCategory !== '' && digitalProductSubCategory !== undefined && (
          <div className="flex items-center gap-4 md:gap-6 text-[11px] tracking-wider font-light overflow-x-auto w-full" style={{ color: textColor }}>
            {availableDigitalProductSubCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onDigitalProductSubCategoryChange(cat.value)}
                className={`transition-colors whitespace-nowrap px-2 py-1 rounded ${digitalProductSubCategory === cat.value ? (useGradient ? 'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white' : '') : 'hover:text-black'}`}
                style={!useGradient ? { color: digitalProductSubCategory === cat.value ? 'white' : textColor, backgroundColor: digitalProductSubCategory === cat.value ? accentColor : 'transparent' } : { color: digitalProductSubCategory === cat.value ? 'white' : textColor }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Search */}
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/10 border border-black/10 rounded-[1px] py-2 px-5 text-[12px] outline-none focus:border-[#8B5CF6] transition-all font-light placeholder:text-[#A1A1AA]"
          style={{ color: textColor }}
        />
      </div>
    </div>
  );
}
