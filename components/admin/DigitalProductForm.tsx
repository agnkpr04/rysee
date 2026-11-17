'use client';

import { useState } from 'react';

interface DigitalProductFormProps {
  ebook?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function DigitalProductForm({ ebook, onSubmit, onCancel }: DigitalProductFormProps) {
  const [formData, setFormData] = useState({
    id: ebook?.id || '',
    title: ebook?.title || '',
    description: ebook?.description || '',
    price: ebook?.price || 0,
    originalPrice: ebook?.originalPrice || 0,
    badge: ebook?.badge || '',
    thumbnail: ebook?.thumbnail || '',
    previewImages: ebook?.previewImages || [],
    downloadUrl: ebook?.downloadUrl || '',
    productType: ebook?.productType || 'ebook',
    category: ebook?.category || 'business',
    subCategory: ebook?.subCategory || '',
    contentCategory: ebook?.contentCategory || '',
    features: ebook?.features?.join(', ') || '',
    status: ebook?.status || 'active',
  });

  const productTypeOptions = [
    { value: 'notion-template', label: 'Notion Templates' },
    { value: 'design-templates', label: 'Design Templates' },
    { value: 'ebook', label: 'E-books' },
    { value: 'digital-vault', label: 'Digital Vault' },
    { value: 'video', label: 'Video' },
    { value: 'social-media-kit', label: 'Social Media Assets' },
    { value: 'graphic-assets', label: 'Graphic Assets' },
  ];

  const badgeOptions = [
    { value: '', label: 'None' },
    { value: 'best-seller', label: 'Best Seller' },
    { value: 'recommendation', label: 'Recommendation' },
    { value: 'new', label: 'New' },
    { value: 'hot', label: 'Hot' },
    { value: 'limited', label: 'Limited Edition' },
  ];

  const categoryOptions: Record<string, { value: string; label: string }[]> = {
    'notion-template': [
      { value: 'productivity', label: 'Productivity' },
      { value: 'finance', label: 'Finance' },
      { value: 'planning', label: 'Planning' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'design-templates': [
      { value: 'instagram-post', label: 'Instagram Post' },
      { value: 'story', label: 'Story' },
      { value: 'presentation', label: 'Presentation' },
      { value: 'cv', label: 'CV/Resume' },
      { value: 'wedding', label: 'Wedding Invitation' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'ebook': [
      { value: 'business', label: 'Business & Entrepreneurship' },
      { value: 'self-improvement', label: 'Self Improvement' },
      { value: 'finance', label: 'Finance' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'education', label: 'Education' },
      { value: 'islamic-kids-education', label: 'Islamic Kids Education' },
      { value: 'kids-learning-activity', label: 'Kids Learning & Activity' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
    ],
    'video': [
      { value: 'product-videos', label: 'Product Videos' },
    ],
    'social-media-kit': [
      { value: 'thumbnail', label: 'Thumbnail YouTube' },
      { value: 'branding-kit', label: 'Social Media Branding Kits' },
      { value: 'highlight-cover', label: 'Instagram Highlight Covers' },
    ],
    'graphic-assets': [
      { value: 'icons', label: 'Icons' },
      { value: 'illustrations', label: 'Illustrations' },
      { value: 'logos', label: 'Logos' },
      { value: 'ui-kits', label: 'UI Kits' },
      { value: 'mockups', label: 'Mockups' },
      { value: 'textures', label: 'Textures' },
      { value: 'fonts', label: 'Fonts' },
      { value: 'printables', label: 'Printables' },
    ],
    'digital-vault': [
      { value: 'business', label: 'Business & Entrepreneurship' },
      { value: 'self-improvement', label: 'Self Improvement' },
      { value: 'finance', label: 'Finance' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'education', label: 'Education' },
      { value: 'wellness-lifestyle', label: 'Wellness/Lifestyle' },
      { value: 'technology-programming', label: 'Technology/Programming' },
      { value: 'exclusive', label: 'Exclusive Content' },
    ],
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'preview') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (type === 'thumbnail') {
          setFormData(prev => ({ ...prev, thumbnail: data.url }));
        } else if (type === 'preview') {
          setFormData(prev => ({ ...prev, previewImages: [...prev.previewImages, data.url] }));
        }
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreviewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previewImages: prev.previewImages.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      features: formData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (IDR)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Original Price (IDR) - Optional</label>
        <input
          type="number"
          value={formData.originalPrice}
          onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Leave empty if no discount"
        />
        <p className="text-xs text-gray-500 mt-1">If filled, this price will be shown as crossed-out (original price)</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Badge - Optional</label>
        <select
          value={formData.badge}
          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        >
          {badgeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'thumbnail');
          }}
          className="w-full border rounded-lg px-4 py-2"
          disabled={uploading}
          required
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img src={formData.thumbnail} alt="Thumbnail preview" className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preview Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach(file => handleFileUpload(file, 'preview'));
          }}
          className="w-full border rounded-lg px-4 py-2"
          disabled={uploading}
        />
        {formData.previewImages.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {formData.previewImages.map((url: string, index: number) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemovePreviewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Download URL (PDF)</label>
        <input
          type="text"
          value={formData.downloadUrl}
          onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="https://drive.google.com/file/d/..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product Type</label>
        <select
          value={formData.productType}
          onChange={(e) => {
            const newProductType = e.target.value;
            setFormData({ 
              ...formData, 
              productType: newProductType,
              category: categoryOptions[newProductType]?.[0]?.value || ''
            });
          }}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          {productTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          {categoryOptions[formData.productType]?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sub Category (Optional)</label>
        <input
          type="text"
          value={formData.subCategory}
          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="e.g., Project Management, Daily Planner"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="PDF, Printable, 100+ pages"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : (ebook ? 'Update' : 'Create')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
