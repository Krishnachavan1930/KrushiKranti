import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice';
import uiReducer from './uiSlice';
import productReducer from '../modules/product/productSlice';
import cartReducer from '../modules/cart/cartSlice';
import farmerReducer from '../modules/farmer/farmerSlice';
import wholesalerReducer from '../modules/wholesaler/wholesalerSlice';
import adminReducer from '../modules/admin/adminSlice';
import orderReducer from '../modules/orders/orderSlice';
import chatReducer from '../modules/chat/chatSlice';
import wishlistReducer from '../modules/wishlist/wishlistSlice';
import notificationReducer from '../modules/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    product: productReducer,
    cart: cartReducer,
    farmer: farmerReducer,
    wholesaler: wholesalerReducer,
    admin: adminReducer,
    orders: orderReducer,
    chat: chatReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
