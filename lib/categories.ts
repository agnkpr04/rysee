export interface CategoryConfig {
  name: string;
  subCategories: string[];
  granularCategories?: { [subCategory: string]: string[] };
}

export const CATEGORIES: CategoryConfig[] = [
  {
    name: "Men",
    subCategories: ['Atasan', 'Bawahan', 'Sepatu'],
    granularCategories: {
      'Atasan': ['T-Shirt', 'Kemeja', 'Crewneck', 'Hoodie', 'Jaket'],
      'Bawahan': ['Celana Jeans', 'Celana Chinos', 'Celana Jogger'],
      'Sepatu': ['Sneakers', 'Casual', 'Formal']
    }
  },
  {
    name: "Women",
    subCategories: ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Bags'],
    granularCategories: {
      'Tops': ['T-Shirt', 'Longsleeve', 'Polo & Collar', 'Shirts / Kemeja', 'Blouse'],
      'Outerwear': ['Hoodie & Sweatshirt', 'Jackets', 'Cardigan', 'Blazer'],
      'Footwear': ['Shoes', 'Sandals'],
      'Bags': ['Sling Bag', 'Tote Bag', 'Shoulder Bag', 'Handbag']
    }
  }

];

export const CATEGORY_NAMES = CATEGORIES.map(cat => cat.name);

export const getSubCategories = (categoryName: string): string[] => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  return category?.subCategories || [];
};

export const hasSubCategories = (categoryName: string): boolean => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  return (category?.subCategories?.length || 0) > 0;
};

export const getGranularCategories = (categoryName: string, subCategoryName: string): string[] => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  if (!category?.granularCategories) return [];
  return category.granularCategories[subCategoryName] || [];
};

export const hasGranularCategories = (categoryName: string, subCategoryName: string): boolean => {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  if (!category?.granularCategories) return false;
  const granularCats = category.granularCategories[subCategoryName];
  return (granularCats?.length || 0) > 0;
};
