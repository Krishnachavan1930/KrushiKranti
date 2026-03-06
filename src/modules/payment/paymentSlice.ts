import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PaymentState {
    paymentStatus: 'idle' | 'loading' | 'success' | 'failed';
    paymentLoading: boolean;
    paymentError: string | null;
    orderId: string | null;
}

const initialState: PaymentState = {
    paymentStatus: 'idle',
    paymentLoading: false,
    paymentError: null,
    orderId: null,
};

// Async thunk to create a payment order
export const createPaymentOrder = createAsyncThunk(
    'payment/createOrder',
    async (_amount: number, { rejectWithValue }) => {
        try {
            // Simulate API call to backend to create Razorpay order
            // const response = await api.post('/payments/create-order', { amount });
            // return response.data;

            return new Promise<{ orderId: string }>((resolve) => {
                setTimeout(() => resolve({ orderId: `order_${Math.random().toString(36).substr(2, 9)}` }), 1000);
            });
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create payment order');
        }
    }
);

// Async thunk to verify payment
export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (_paymentData: any, { rejectWithValue }) => {
        try {
            // Simulate API call to backend to verify payment
            // const response = await api.post('/payments/verify', paymentData);
            // return response.data;

            return new Promise<{ success: boolean }>((resolve) => {
                setTimeout(() => resolve({ success: true }), 1000);
            });
        } catch (error: any) {
            return rejectWithValue(error.message || 'Payment verification failed');
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.paymentStatus = 'idle';
            state.paymentLoading = false;
            state.paymentError = null;
            state.orderId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentOrder.pending, (state) => {
                state.paymentLoading = true;
                state.paymentStatus = 'loading';
                state.paymentError = null;
            })
            .addCase(createPaymentOrder.fulfilled, (state, action) => {
                state.paymentLoading = false;
                state.paymentStatus = 'idle';
                state.orderId = action.payload.orderId;
            })
            .addCase(createPaymentOrder.rejected, (state, action) => {
                state.paymentLoading = false;
                state.paymentStatus = 'failed';
                state.paymentError = action.payload as string;
            })
            .addCase(verifyPayment.pending, (state) => {
                state.paymentLoading = true;
                state.paymentStatus = 'loading';
            })
            .addCase(verifyPayment.fulfilled, (state) => {
                state.paymentLoading = false;
                state.paymentStatus = 'success';
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.paymentLoading = false;
                state.paymentStatus = 'failed';
                state.paymentError = action.payload as string;
            });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
