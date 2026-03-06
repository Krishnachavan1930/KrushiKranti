import type { Product, ProductCategory, ProductFilters, PaginatedResponse } from './types';
import api from '../../services/api';

// Helper to extract error message from API errors
const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message || err.message || defaultMsg;
};

export interface CreateProductData {
  name: string;
  description: string;
  category: ProductCategory;
  retailPrice: number;
  wholesalePrice: number;
  unit: string;
  stock: number;
  images: string[];
  location: string;
  organic: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export const productService = {
  /**
   * Get paginated list of products with filters
   */
  async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 8
  ): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams();
      params.append('page', String(page - 1)); // Spring Boot uses 0-based pagination
      params.append('size', String(limit));
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
      if (filters.organic !== undefined) params.append('organic', String(filters.organic));

      const response = await api.get<{
        data: {
          content: Product[];
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
        };
      }>(`/v1/products?${params.toString()}`);

      const pageData = response.data.data;
      return {
        data: pageData.content,
        total: pageData.totalElements,
        page: pageData.number + 1, // Convert back to 1-based
        limit: pageData.size,
        totalPages: pageData.totalPages,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch products'));
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<{ data: Product }>(`/v1/products/${id}`);
      return response.data.data;
    } catch (error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return null;
      }
      throw new Error(getErrorMessage(error, 'Failed to fetch product'));
    }
  },

  /**
   * Create a new product (Farmer only)
   */
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const response = await api.post<{ data: Product }>('/v1/products', data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create product'));
    }
  },

  /**
   * Update an existing product (Farmer only)
   */
  async updateProduct({ id, ...data }: UpdateProductData): Promise<Product> {
    try {
      const response = await api.put<{ data: Product }>(`/v1/products/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update product'));
    }
  },

  /**
   * Delete a product (Farmer only)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/v1/products/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete product'));
    }
  },

  /**
   * Get products for a specific farmer
   */
  async getFarmerProducts(farmerId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<{
        data: {
          content: Product[];
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
        };
      }>(`/v1/products/farmer/${farmerId}?page=${page - 1}&size=${limit}`);

      const pageData = response.data.data;
      return {
        data: pageData.content,
        total: pageData.totalElements,
        page: pageData.number + 1,
        limit: pageData.size,
        totalPages: pageData.totalPages,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch farmer products'));
    }
  },

  /**
   * Get my products (for logged-in farmer)
   */
  async getMyProducts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<{
        data: {
          content: Product[];
          totalElements: number;
          totalPages: number;
          number: number;
          size: number;
        };
      }>(`/v1/products/my-products?page=${page - 1}&size=${limit}`);

      const pageData = response.data.data;
      return {
        data: pageData.content,
        total: pageData.totalElements,
        page: pageData.number + 1,
        limit: pageData.size,
        totalPages: pageData.totalPages,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch your products'));
    }
  },

  /**
   * Get available product categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const response = await api.get<{ data: ProductCategory[] }>('/v1/products/categories');
      return response.data.data;
    } catch {
      // Fallback to default categories if API fails
      return ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'];
    }
  },

  /**
   * Search products by query
   */
  async searchProducts(query: string, page: number = 1, limit: number = 8): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ search: query }, page, limit);
  },
};
