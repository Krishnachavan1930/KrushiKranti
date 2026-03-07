import api from '../../services/api';

export interface AddToCartRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartRequest {
    productId: string;
    quantity: number;
}

export interface CartItemResponse {
    id: string; // The cart item ID
    productId: string;
    productName: string;
    productImage: string;
    category: string;
    price: number;
    wholesalePrice: number;
    quantity: number;
    unit: string;
    maxStock: number;
    subtotal: number;
    createdAt: string;
}

export interface CartResponse {
    items: CartItemResponse[];
    cartTotal: number;
    itemCount: number;
}

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return err.response?.data?.message || err.message || defaultMsg;
};

export const cartService = {
    async getCart(): Promise<CartResponse> {
        try {
            const response = await api.get<{ data: CartResponse }>('/v1/cart');
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to fetch cart'));
        }
    },

    async addToCart(request: AddToCartRequest): Promise<CartItemResponse> {
        try {
            const response = await api.post<{ data: CartItemResponse }>('/v1/cart/add', request);
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to add item to cart'));
        }
    },

    async updateCartItem(request: UpdateCartRequest): Promise<CartItemResponse> {
        try {
            const response = await api.put<{ data: CartItemResponse }>('/v1/cart/update', request);
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to update cart item'));
        }
    },

    async removeCartItem(productId: string): Promise<void> {
        try {
            await api.delete(`/v1/cart/remove/${productId}`);
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to remove item from cart'));
        }
    },

    async clearCart(): Promise<void> {
        try {
            await api.delete('/v1/cart/clear');
        } catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to clear cart'));
        }
    },

    async getCartItemCount(): Promise<number> {
        try {
            const response = await api.get<{ data: number }>('/v1/cart/count');
            return response.data.data;
        } catch (error) {
            // If unauthorized, return 0 instead of throwing to prevent spammy errors
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 401 || err.response?.status === 403) {
                return 0;
            }
            throw new Error(getErrorMessage(error, 'Failed to fetch cart count'));
        }
    },
};
