'use client';

interface TemplateFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

export default function TemplateFilter({ selectedCategory, onCategoryChange }: TemplateFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full transition-colors text-xs font-medium ${
            selectedCategory === category.value
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
              : 'bg-[#F9F9FB] text-[#18181B] hover:bg-[#F0F0F2]'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
