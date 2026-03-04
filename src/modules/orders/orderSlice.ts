import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from './types';

interface OrderState {
    orders: Order[];
    selectedOrder: Order | null;
    filters: {
        status: OrderStatus | 'all';
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    selectedOrder: null,
    filters: {
        status: 'all',
    },
    pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
    },
    isLoading: false,
    error: null,
};

// Mock service for orders
const mockOrders: Order[] = [
    {
        id: 'ORD-123456',
        userId: 'user_1',
        items: [
            {
                id: 'item_1',
                productId: 'prod_1',
                name: 'Organic Tomatoes',
                price: 40,
                quantity: 5,
                image: 'https://images.unsplash.com/photo-1546473427-e1ad00490b6a?w=400',
                unit: 'kg',
            },
        ],
        totalAmount: 200,
        status: 'delivered',
        shippingAddress: '123 Farm Road, Rural Village',
        paymentMethod: 'UPI',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ORD-789012',
        userId: 'user_1',
        items: [
            {
                id: 'item_2',
                productId: 'prod_2',
                name: 'Basmati Rice',
                price: 120,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                unit: 'kg',
            },
        ],
        totalAmount: 240,
        status: 'pending',
        shippingAddress: '123 Farm Road, Rural Village',
        paymentMethod: 'Card',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ status, page, limit }: { status: OrderStatus | 'all', page: number, limit: number }, { rejectWithValue }) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            let filtered = [...mockOrders];
            if (status !== 'all') {
                filtered = filtered.filter(o => o.status === status);
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / limit);
            const start = (page - 1) * limit;
            const data = filtered.slice(start, start + limit);

            return {
                data,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (id: string, { rejectWithValue }) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // In real app, API would handle this
            return id;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<{ status: OrderStatus | 'all' }>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset to first page
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                };
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                const order = state.orders.find(o => o.id === action.payload);
                if (order) {
                    order.status = 'cancelled';
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, setPage, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
