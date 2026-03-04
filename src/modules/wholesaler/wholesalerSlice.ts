import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BulkRequest, InventoryItem, WholesalerStats } from './types';

interface WholesalerState {
  requests: BulkRequest[];
  inventory: InventoryItem[];
  stats: WholesalerStats;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// Mock data
const mockRequests: BulkRequest[] = [
  {
    id: '1',
    productId: 'p1',
    productName: 'Organic Tomatoes',
    productImage: 'https://images.unsplash.com/photo-1546470427-227c7a3e9853?w=400',
    farmerId: 'f1',
    farmerName: 'Ramesh Kumar',
    wholesalerId: 'w1',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 45,
    totalPrice: 22500,
    status: 'pending',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    productId: 'p2',
    productName: 'Fresh Spinach',
    productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    wholesalerId: 'w1',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 30,
    totalPrice: 6000,
    status: 'approved',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
  },
  {
    id: '3',
    productId: 'p3',
    productName: 'Basmati Rice',
    productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    farmerId: 'f1',
    farmerName: 'Ramesh Kumar',
    wholesalerId: 'w1',
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 95,
    totalPrice: 95000,
    status: 'rejected',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: 'p2',
    productName: 'Fresh Spinach',
    productImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    farmerName: 'Suresh Patel',
    quantity: 180,
    unit: 'kg',
    purchasePrice: 6000,
    purchaseDate: '2024-01-19',
    status: 'in-stock',
  },
  {
    id: '2',
    productId: 'p4',
    productName: 'Red Onions',
    productImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    farmerName: 'Amit Sharma',
    quantity: 50,
    unit: 'kg',
    purchasePrice: 2000,
    purchaseDate: '2024-01-10',
    status: 'low-stock',
  },
  {
    id: '3',
    productId: 'p5',
    productName: 'Green Peas',
    productImage: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400',
    farmerName: 'Vijay Singh',
    quantity: 0,
    unit: 'kg',
    purchasePrice: 4500,
    purchaseDate: '2024-01-05',
    status: 'out-of-stock',
  },
];

const mockStats: WholesalerStats = {
  totalRequests: 45,
  approvedOrders: 32,
  pendingRequests: 8,
  inventoryItems: 15,
  totalInventoryValue: 185000,
};

const initialState: WholesalerState = {
  requests: [],
  inventory: [],
  stats: {
    totalRequests: 0,
    approvedOrders: 0,
    pendingRequests: 0,
    inventoryItems: 0,
    totalInventoryValue: 0,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async thunks
export const fetchWholesalerStats = createAsyncThunk(
  'wholesaler/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockStats;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRequests = createAsyncThunk(
  'wholesaler/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockRequests;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInventory = createAsyncThunk(
  'wholesaler/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockInventory;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sendBulkRequest = createAsyncThunk(
  'wholesaler/sendBulkRequest',
  async (
    { productId, productName, productImage, farmerName, quantity, unit, pricePerUnit }: {
      productId: string;
      productName: string;
      productImage: string;
      farmerName: string;
      quantity: number;
      unit: string;
      pricePerUnit: number;
    },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRequest: BulkRequest = {
        id: Date.now().toString(),
        productId,
        productName,
        productImage,
        farmerId: 'f1',
        farmerName,
        wholesalerId: 'w1',
        quantity,
        unit,
        pricePerUnit,
        totalPrice: quantity * pricePerUnit,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newRequest;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const approveRequest = createAsyncThunk(
  'wholesaler/approveRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const rejectRequest = createAsyncThunk(
  'wholesaler/rejectRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const wholesalerSlice = createSlice({
  name: 'wholesaler',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchWholesalerStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWholesalerStats.fulfilled, (state, action: PayloadAction<WholesalerStats>) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchWholesalerStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action: PayloadAction<BulkRequest[]>) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action: PayloadAction<InventoryItem[]>) => {
        state.isLoading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send bulk request
      .addCase(sendBulkRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(sendBulkRequest.fulfilled, (state, action: PayloadAction<BulkRequest>) => {
        state.isSubmitting = false;
        state.requests.unshift(action.payload);
      })
      .addCase(sendBulkRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Approve request
      .addCase(approveRequest.fulfilled, (state, action: PayloadAction<string>) => {
        const request = state.requests.find((r) => r.id === action.payload);
        if (request) {
          request.status = 'approved';
          request.updatedAt = new Date().toISOString();
        }
      })
      // Reject request
      .addCase(rejectRequest.fulfilled, (state, action: PayloadAction<string>) => {
        const request = state.requests.find((r) => r.id === action.payload);
        if (request) {
          request.status = 'rejected';
          request.updatedAt = new Date().toISOString();
        }
      });
  },
});

export const { clearError } = wholesalerSlice.actions;
export default wholesalerSlice.reducer;
