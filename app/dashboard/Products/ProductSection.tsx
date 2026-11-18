"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Plus, ExternalLink, Trash2, Package, X, Pencil, Search } from 'lucide-react';
import { CATEGORY_NAMES, getSubCategories, getGranularCategories, hasGranularCategories } from '@/lib/categories';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string;
  productUrl: string | null;
  shopeeLink: string | null;
  tiktokLink: string | null;
  contentUrl: any;
  videoUrl: string | null;
  assetType: string | null;
  category: string | null;
  subCategory: string | null;
  granularCategory: string | null;
  createdAt: string;
}

export default function ProductSection() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: "Men",
    subCategory: '',
    granularCategory: '',
    price: '',
    thumbnail: null as File | null,
    shopeeLink: '',
    tiktokLink: '',
    assets: null as FileList | null,
    videoUrl: '',
    assetType: 'image' as 'image' | 'video' | 'both',
  });
  const [error, setError] = useState('');

  // Filter states
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [activeGranularCategory, setActiveGranularCategory] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('[ProductSection] Component rendered, isLoading:', isLoading);

  useEffect(() => {
    console.log('[ProductSection] useEffect triggered');
    const checkSession = async () => {
      console.log('[ProductSection] checkSession called');
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('admin_session='));
      console.log('[ProductSection] Session cookie:', sessionCookie);
      if (!sessionCookie) {
        console.log('[ProductSection] No session cookie, redirecting');
        router.push('/admin/login');
        return;
      }

      console.log('[ProductSection] Calling fetchProducts');
      await fetchProducts();
    };

    checkSession();
  }, [router]);

  const fetchProducts = async () => {
    try {
      console.log('[ProductSection] Fetching products...');
      const res = await fetch('/api/master-products');
      console.log('[ProductSection] Response status:', res.status);
      if (res.status === 401 || res.status === 403) {
        console.log('[ProductSection] Unauthorized, redirecting to login');
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      console.log('[ProductSection] Products data:', data);
      setProducts(data.products || []);
    } catch (err) {
      console.error('[ProductSection] Failed to fetch products:', err);
      alert('[ProductSection] Failed to fetch products: ' + (err as Error).message);
    } finally {
      console.log('[ProductSection] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSubCategory = activeSubCategory === "All" || !activeSubCategory || product.subCategory === activeSubCategory;
      const matchesGranularCategory = activeGranularCategory === "All" || !activeGranularCategory || product.granularCategory === activeGranularCategory;
      const matchesPlatform = activePlatform === "All" ||
        (activePlatform === "Shopee" && (product.shopeeLink || product.productUrl?.includes('shopee'))) ||
        (activePlatform === "TikTok" && (product.tiktokLink || product.productUrl?.includes('tiktok')));
      return matchesSearch && matchesCategory && matchesSubCategory && matchesGranularCategory && matchesPlatform;
    });
  }, [products, searchQuery, activeCategory, activeSubCategory, activeGranularCategory, activePlatform]);

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: "Men",
      subCategory: '',
      granularCategory: '',
      price: '',
      thumbnail: null,
      shopeeLink: '',
      tiktokLink: '',
      assets: null,
      videoUrl: '',
      assetType: 'image',
    });
    setError('');
    setIsEditMode(false);
    setEditingProductId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description || '',
      category: product.category || "Men",
      subCategory: product.subCategory || '',
      granularCategory: product.granularCategory || '',
      price: product.price.toString(),
      thumbnail: null,
      shopeeLink: product.shopeeLink || '',
      tiktokLink: product.tiktokLink || '',
      assets: null,
      videoUrl: product.videoUrl || '',
      assetType: (product.assetType as 'image' | 'video' | 'both') || 'image',
    });
    setError('');
    setIsEditMode(true);
    setEditingProductId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/master-products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProducts();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.price) {
      setError('Title and price are required');
      return;
    }

    if (isEditMode && !formData.thumbnail) {
      // Thumbnail is optional for edit mode
    } else if (!isEditMode && !formData.thumbnail) {
      setError('Thumbnail is required for new products');
      return;
    }

    if (!formData.shopeeLink && !formData.tiktokLink) {
      setError('At least one platform link (Shopee or TikTok) is required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (isEditMode && editingProductId) {
        formDataToSend.append('id', editingProductId);
      }
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      if (formData.subCategory) {
        formDataToSend.append('subCategory', formData.subCategory);
      }
      if (formData.granularCategory) {
        formDataToSend.append('granularCategory', formData.granularCategory);
      }
      formDataToSend.append('price', formData.price);
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      if (formData.shopeeLink) {
        formDataToSend.append('shopeeLink', formData.shopeeLink);
      }
      if (formData.tiktokLink) {
        formDataToSend.append('tiktokLink', formData.tiktokLink);
      }
      if (formData.videoUrl) {
        formDataToSend.append('videoUrl', formData.videoUrl);
      }
      formDataToSend.append('assetType', formData.assetType);

      if (formData.assets && formData.assets.length > 0) {
        Array.from(formData.assets).forEach((file) => {
          formDataToSend.append('assets', file);
        });
      }

      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch('/api/master-products', {
        method,
        body: formDataToSend,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const error = await res.json();
        setError(error.error || 'Failed to create product');
      }
    } catch (err) {
      console.error('Failed to create product:', err);
      setError('Failed to create product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total</p>
              <p className="text-lg md:text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Assets</p>
              <p className="text-lg md:text-2xl font-bold">{products.filter(p => p.contentUrl && Array.isArray(p.contentUrl) && p.contentUrl.length > 0).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Shopee</p>
              <p className="text-lg md:text-2xl font-bold">{products.filter(p => p.productUrl?.includes('shopee')).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-4 md:px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-base md:text-lg font-semibold">Master Products</h2>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs md:text-sm w-fit"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Product</span>
              <span className="md:hidden">Add</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category, Subcategory, Granular, Platform filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              <select
                value={activeCategory}
                onChange={(e) => { setActiveCategory(e.target.value); setActiveSubCategory('All'); setActiveGranularCategory('All'); }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                {CATEGORY_NAMES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Subcategory Filter */}
              {activeCategory !== 'All' && (
                <select
                  value={activeSubCategory}
                  onChange={(e) => { setActiveSubCategory(e.target.value); setActiveGranularCategory('All'); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  {getSubCategories(activeCategory).map((subCat) => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              )}

              {/* Granular Category Filter */}
              {hasGranularCategories(activeCategory, activeSubCategory) && (
                <select
                  value={activeGranularCategory}
                  onChange={(e) => setActiveGranularCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  {getGranularCategories(activeCategory, activeSubCategory).map((granularCat) => (
                    <option key={granularCat} value={granularCat}>{granularCat}</option>
                  ))}
                </select>
              )}

              {/* Platform Filter */}
              <select
                value={activePlatform}
                onChange={(e) => setActivePlatform(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Platforms</option>
                <option value="Shopee">Shopee</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <div className="divide-y">
            {filteredProducts.map((product) => {
              const isShopee = product.shopeeLink || product.productUrl?.includes('shopee');
              const isTikTok = product.tiktokLink || product.productUrl?.includes('tiktok');
              const assets = Array.isArray(product.contentUrl) ? product.contentUrl : [];

              return (
                <div key={product.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-black/5">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {assets.length > 0 && (
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-md text-[8px] font-bold text-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <ImageIcon className="w-2 h-2" /> {assets.length}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{product.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                        {product.category && <span className="bg-gray-100 text-gray-600 text-[8px] md:text-[10px] font-medium px-2 py-0.5 rounded">{product.category}</span>}
                        <span className="text-black/80 font-medium font-mono text-xs md:text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                      </p>
                      <div className="flex gap-2 mt-1">
                        {isShopee && <span className="bg-[#EE4D2D]/5 text-[#EE4D2D] text-[8px] font-bold px-2 py-0.5 rounded border border-[#EE4D2D]/10 tracking-widest">SHOPEE</span>}
                        {isTikTok && <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded italic">TikTok</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <a
                      href={product.shopeeLink || product.tiktokLink || product.productUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Source Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-3 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#18181B]">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-50 rounded-lg transition"
              >
                <X className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  placeholder="Flare Pants Editorial Edition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                >
                  {CATEGORY_NAMES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Sub Category (optional)</label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value, granularCategory: '' })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  disabled={!formData.category}
                >
                  <option value="">Select sub category</option>
                  {getSubCategories(formData.category).map((subCat) => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
              {hasGranularCategories(formData.category, formData.subCategory) && (
                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1">Granular Category (optional)</label>
                  <select
                    value={formData.granularCategory}
                    onChange={(e) => setFormData({ ...formData, granularCategory: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  >
                    <option value="">Select granular category</option>
                    {getGranularCategories(formData.category, formData.subCategory).map((granularCat) => (
                      <option key={granularCat} value={granularCat}>{granularCat}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  placeholder="Product description..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Price (IDR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  placeholder="149000"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Thumbnail Image{!isEditMode && ' *'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  required={!isEditMode}
                />
                {isEditMode && <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep current thumbnail</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Shopee Link (optional)</label>
                <input
                  type="url"
                  value={formData.shopeeLink}
                  onChange={(e) => setFormData({ ...formData, shopeeLink: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  placeholder="shopee.co.id/product/..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">TikTok Link (optional)</label>
                <input
                  type="url"
                  value={formData.tiktokLink}
                  onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                  placeholder="tiktok.com/@user/video/..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Content Assets (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFormData({ ...formData, assets: e.target.files })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">Asset Type</label>
                <select
                  value={formData.assetType}
                  onChange={(e) => setFormData({ ...formData, assetType: e.target.value as 'image' | 'video' | 'both' })}
                  className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                >
                  <option value="image">Image Only</option>
                  <option value="video">Video Only</option>
                  <option value="both">Both Image & Video</option>
                </select>
              </div>
              {formData.assetType === 'video' || formData.assetType === 'both' ? (
                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1">Video URL (Cloudinary)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent text-xs"
                    placeholder="https://res.cloudinary.com/..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Upload video to Cloudinary and paste URL here</p>
                </div>
              ) : null}
              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 py-1.5 border border-gray-50 rounded-lg hover:bg-gray-50 transition text-xs font-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg hover:opacity-90 transition text-xs font-light"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
