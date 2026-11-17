'use client';

import { useState } from 'react';
import { MasterTemplate } from '@/lib/templates/types';

interface TemplateFormProps {
  template?: MasterTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    id: template?.id || '',
    title: template?.title || '',
    description: template?.description || '',
    price: template?.price || 0,
    originalPrice: template?.originalPrice || 0,
    badge: template?.badge || '',
    thumbnail: template?.thumbnail || '',
    previewUrl: template?.previewUrl || '',
    previewImages: template?.previewImages || [],
    category: template?.category || 'landing-page',
    features: template?.features.join(', ') || '',
    technology: template?.technology?.join(', ') || 'Next.js, React, Tailwind CSS, TypeScript',
    deliverables: template?.deliverables?.join(', ') || '',
    status: template?.status || 'active',
  });

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
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      badge: formData.badge || null,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      technology: formData.technology.split(',').map(f => f.trim()).filter(f => f),
      deliverables: formData.deliverables.split(',').map(f => f.trim()).filter(f => f),
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Badge</label>
        <select
          value={formData.badge}
          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">None</option>
          <option value="best-seller">Best Seller</option>
          <option value="recommendation">Recommendation</option>
          <option value="new">New</option>
          <option value="hot">Hot</option>
          <option value="limited">Limited Edition</option>
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
        <label className="block text-sm font-medium mb-1">Live Preview URL</label>
        <input
          type="text"
          value={formData.previewUrl}
          onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preview Images</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'preview');
          }}
          className="w-full border rounded-lg px-4 py-2"
          disabled={uploading}
        />
        {formData.previewImages.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {formData.previewImages.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemovePreviewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          <option value="landing-page">Landing Page</option>
          <option value="portfolio">Portfolio</option>
          <option value="ecommerce">E-commerce</option>
          <option value="blog">Blog</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Responsive, Modern Design, SEO Friendly"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Technology (comma-separated)</label>
        <input
          type="text"
          value={formData.technology}
          onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Next.js, React, Tailwind CSS, TypeScript"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deliverables (comma-separated)</label>
        <input
          type="text"
          value={formData.deliverables}
          onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Source Code, Documentation, Assets"
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
          {uploading ? 'Uploading...' : (template ? 'Update' : 'Create')}
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
