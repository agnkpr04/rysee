export interface MasterTemplate {
  id: string;
  title: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  thumbnail: string;
  previewUrl: string | null;
  previewImages: string[];
  category: string;
  subCategory: string | null;
  features: string[];
  technology: string[];
  deliverables: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTemplate {
  id: string;
  userId: string;
  masterTemplateId: string;
  affiliateLink: string;
  createdAt: Date;
  masterTemplate: MasterTemplate;
}

export interface TemplateOrder {
  id: string;
  userTemplateId: string;
  userId: string;
  affiliateId: string | null;
  status: string;
  downloadUrl: string | null;
  downloadExpireAt: Date | null;
  downloadCount: number;
  paymentProof: string | null;
  createdAt: Date;
  userTemplate: UserTemplate;
}

export interface CreateMasterTemplateRequest {
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  previewUrl?: string;
  category: string;
  subCategory?: string;
  features: string[];
  technology?: string[];
  deliverables?: string[];
}

export interface CreateUserTemplateRequest {
  masterTemplateId: string;
  affiliateLink: string;
}

export interface CreateTemplateOrderRequest {
  userTemplateId: string;
  affiliateId?: string;
}
