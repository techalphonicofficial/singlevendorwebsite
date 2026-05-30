import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishList';
import sizeReducer from "./slices/sizeSlice";
import toastReducer from "./slices/toastSlice";
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    sizes: sizeReducer,
    toast: toastReducer,
    auth: authReducer,
  },
});


