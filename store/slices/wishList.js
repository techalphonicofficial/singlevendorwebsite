import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWishlistApi, addWishlistItemApi, removeWishlistItemApi, fetchProductsApi } from '../apiService';

const mapApiWishlistItem = (item, fallbackItem = null, productsList = []) => {
  const product = item.product || item || {};
  const productId = item.product_id || product.id || fallbackItem?.id || item.id;
  const matchedProduct = Array.isArray(productsList) ? productsList.find(p => p.id === productId) : null;
  const rawImageUrl = item.image || product.thumbnail || product.galleries?.[0]?.image_url || matchedProduct?.galleries?.[0]?.image_url || matchedProduct?.thumbnail || fallbackItem?.image || '';
  
  return {
    id: productId,
    wishlistItemId: item.id || null,
    name: product.name || item.name || fallbackItem?.name || matchedProduct?.name || 'Ethnic Wear Item',
    price: parseFloat(item.price || product.base_price || product.price || fallbackItem?.price || matchedProduct?.base_price || 0),
    image: rawImageUrl,
    slug: product.slug || item.slug || fallbackItem?.slug || matchedProduct?.slug || '',
  };
};

// 1. Fetch Wishlist Thunk
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to fetch wishlist');
      }

      // Check if products list is already in state to enrich items
      let productsList = state.products?.items || [];
      const fetchProductsNeeded = productsList.length === 0;

      const wishlistPromise = fetchWishlistApi(token);
      const productsPromise = fetchProductsNeeded ? fetchProductsApi({ per_page: 100 }) : null;

      const [wishlistData, productsData] = await Promise.all([
        wishlistPromise,
        productsPromise
      ]);

      let products = productsList;
      if (productsData) {
        products = productsData.products?.data || [];
      }

      return {
        wishlistData,
        products,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Add to Wishlist Thunk
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to manage wishlist');
      }

      const response = await addWishlistItemApi(product.id, token);

      return {
        product,
        data: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Remove from Wishlist Thunk
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to manage wishlist');
      }

      await removeWishlistItemApi(productId, token);

      return { productId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const wishlistPayload = action.payload?.wishlistData || action.payload;
        const wishlist = wishlistPayload?.wishlist || wishlistPayload;
        const productsList = action.payload?.products || [];

        if (wishlist?.items && Array.isArray(wishlist.items)) {
          state.items = wishlist.items.map(item => mapApiWishlistItem(item, null, productsList));
          state.totalQuantity = state.items.length;
        } else {
          state.items = [];
          state.totalQuantity = 0;
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const addedProduct = action.payload.product;
        const existingItem = state.items.find(item => item.id === addedProduct.id);

        if (!existingItem) {
          state.items.push(mapApiWishlistItem(addedProduct, addedProduct));
          state.totalQuantity = state.items.length;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { productId } = action.payload;
        state.items = state.items.filter(item => item.id !== productId);
        state.totalQuantity = state.items.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;