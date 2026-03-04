import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FarmerProduct, FarmerStats, RevenueData, ProductFormData } from './types';

interface FarmerState {
  products: FarmerProduct[];
  stats: FarmerStats;
  revenueData: RevenueData[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// Mock data
const mockProducts: FarmerProduct[] = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes from our farm',
    category: 'vegetables',
    retailPrice: 60,
    wholesalePrice: 45,
    quantity: 500,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1546470427-227c7a3e9853?w=400'],
    organic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Fresh Spinach',
    description: 'Nutrient-rich spinach leaves',
    category: 'vegetables',
    retailPrice: 40,
    wholesalePrice: 30,
    quantity: 200,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
    organic: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
  },
  {
    id: '3',
    name: 'Basmati Rice',
    description: 'Premium quality basmati rice',
    category: 'grains',
    retailPrice: 120,
    wholesalePrice: 95,
    quantity: 1000,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    organic: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
  },
];

const mockStats: FarmerStats = {
  totalProducts: 12,
  totalOrders: 156,
  totalRevenue: 245800,
  pendingOrders: 8,
};

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 18500 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 28500 },
  { month: 'May', revenue: 32000 },
  { month: 'Jun', revenue: 27500 },
  { month: 'Jul', revenue: 35000 },
  { month: 'Aug', revenue: 31000 },
  { month: 'Sep', revenue: 29000 },
  { month: 'Oct', revenue: 38000 },
  { month: 'Nov', revenue: 42000 },
  { month: 'Dec', revenue: 45000 },
];

const initialState: FarmerState = {
  products: [],
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  },
  revenueData: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async thunks
export const fetchFarmerProducts = createAsyncThunk(
  'farmer/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockProducts;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFarmerStats = createAsyncThunk(
  'farmer/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { stats: mockStats, revenueData: mockRevenueData };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'farmer/addProduct',
  async (productData: ProductFormData, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newProduct: FarmerProduct = {
        id: Date.now().toString(),
        ...productData,
        images: productData.imagePreview ? [productData.imagePreview] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newProduct;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'farmer/updateProduct',
  async (
    { id, data }: { id: string; data: ProductFormData },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedProduct: FarmerProduct = {
        id,
        ...data,
        images: data.imagePreview ? [data.imagePreview] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updatedProduct;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'farmer/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchFarmerProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarmerProducts.fulfilled, (state, action: PayloadAction<FarmerProduct[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchFarmerProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchFarmerStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFarmerStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.revenueData = action.payload.revenueData;
      })
      .addCase(fetchFarmerStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<FarmerProduct>) => {
        state.isSubmitting = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<FarmerProduct>) => {
        state.isSubmitting = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = farmerSlice.actions;
export default farmerSlice.reducer;
