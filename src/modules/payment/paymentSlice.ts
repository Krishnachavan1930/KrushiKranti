import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface CheckoutPaymentPayload {
    items: {
        productId: string;
        quantity: number;
    }[];
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
    customerPhone: string;
    paymentMethod: string;
}

interface PaymentState {
    paymentStatus: 'idle' | 'loading' | 'success' | 'failed';
    paymentLoading: boolean;
    paymentError: string | null;
    orderId: string | null;
    razorpayOrderId: string | null;
}

const initialState: PaymentState = {
    paymentStatus: 'idle',
    paymentLoading: false,
    paymentError: null,
    orderId: null,
    razorpayOrderId: null,
};

// Async thunk to create a payment order
export const createPaymentOrder = createAsyncThunk(
    'payment/createOrder',
    async (payload: CheckoutPaymentPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/v1/payment/create-order', payload);
            const data = response.data.data;
            return { 
                razorpayOrderId: data.id,
                amount: data.amount,
                currency: data.currency,
                status: data.status
            };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to create payment order';
            return rejectWithValue(message);
        }
    }
);

// Async thunk to verify payment
export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }, { rejectWithValue }) => {
        try {
            const response = await api.post('/v1/payment/verify', {
                razorpayOrderId: paymentData.razorpay_order_id,
                razorpayPaymentId: paymentData.razorpay_payment_id,
                razorpaySignature: paymentData.razorpay_signature,
            });
            const data = response.data.data;
            return {
                success: data.verified === true,
                primaryOrderId: data.primaryOrderId ? String(data.primaryOrderId) : null,
                orderIds: Array.isArray(data.orderIds) ? data.orderIds.map(String) : [],
            };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Payment verification failed';
            return rejectWithValue(message);
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
            state.razorpayOrderId = null;
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
                state.orderId = null;
                state.razorpayOrderId = action.payload.razorpayOrderId;
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
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.paymentLoading = false;
                state.paymentStatus = 'success';
                state.orderId = action.payload.primaryOrderId;
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
