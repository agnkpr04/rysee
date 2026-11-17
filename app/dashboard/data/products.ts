export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
  affiliateUrl: string;
  shortDescription: string;
}

export const products: Product[] = [
  {
    id: "nikah-v1",
    title: "Elegant Wedding Digital",
    category: "Outfit Pria",
    price: 150000,
    thumbnail: "/images/nikah-v1.jpg",
    shortDescription: "Undangan digital mewah dengan fitur RSVP otomatis.",
    affiliateUrl: "https://shopee.co.id/link-kamu",
  },
  {
    id: "obsidian-dark-v1",
    title: "Obsidian Portfolio",
    category: "Outfit Wanita",
    price: 450000,
    thumbnail: "/images/obsidian.jpg",
    shortDescription: "High-end portfolio for creative directors.",
    affiliateUrl: "https://tiktok.com/link-kamu",
  }
];

export const categories = ["Semua", "Outfit Pria", "OutfitWanita"];