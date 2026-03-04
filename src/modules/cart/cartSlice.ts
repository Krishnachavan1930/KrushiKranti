import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from './types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        subtotal: calculateSubtotal(parsed.items || []),
        itemCount: calculateItemCount(parsed.items || []),
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { items: [], subtotal: 0, itemCount: 0 };
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify({ items }));
};

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'id'>>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        existingItem.quantity = Math.min(newQuantity, existingItem.maxStock);
      } else {
        state.items.push({
          ...action.payload,
          id: `cart-${action.payload.productId}-${Date.now()}`,
        });
      }

      state.subtotal = calculateSubtotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.maxStock));
      }
      state.subtotal = calculateSubtotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
