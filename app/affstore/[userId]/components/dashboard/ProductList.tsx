import React from 'react';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: any[];
  downloadStatus: { [key: string]: 'idle' | 'loading' | 'success' | 'error' };
  userId: string;
  onDownload: (assetUrl: string, productId: string) => void;
  onDelete: (productId: string) => void;
  onEditLink: (productId: string, newLink: string) => void;
  editLinkStatus: { loading: boolean; success: boolean; message: string };
  activePlatform: string;
  isSelectionMode?: boolean;
  selectedProducts?: Set<string>;
  onToggleSelection?: (productId: string) => void;
  onEnterSelectionMode?: () => void;
}

export default function ProductList({ products, downloadStatus, userId, onDownload, onDelete, onEditLink, editLinkStatus, activePlatform, isSelectionMode = false, selectedProducts = new Set(), onToggleSelection, onEnterSelectionMode }: ProductListProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            downloadStatus={downloadStatus}
            userId={userId}
            onDownload={onDownload}
            onDelete={onDelete}
            onEditLink={onEditLink}
            editLinkStatus={editLinkStatus}
            activePlatform={activePlatform}
            isSelectionMode={isSelectionMode}
            isSelected={selectedProducts.has(product.productId)}
            onToggleSelection={onToggleSelection}
            onEnterSelectionMode={onEnterSelectionMode}
          />
        ))}
      </div>
    </div>
  );
}
