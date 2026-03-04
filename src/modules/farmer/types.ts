import type { ProductCategory } from '../product/types';

export interface FarmerProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  unit: string;
  images: string[];
  organic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  unit: string;
  organic: boolean;
  imagePreview?: string;
}
