import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishList';
import sizeReducer from "./slices/sizeSlice";
import toastReducer from "./slices/toastSlice";
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import bannerReducer from './slices/bannerSlice';
import reviewReducer from './slices/reviewSlice';
import orderReducer from './slices/orderSlice';
import pageReducer from './slices/pageSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    sizes: sizeReducer,
    toast: toastReducer,
    auth: authReducer,
    products: productReducer,
    banners: bannerReducer,
    reviews: reviewReducer,
    orders: orderReducer,
    pages: pageReducer,
  },
});


