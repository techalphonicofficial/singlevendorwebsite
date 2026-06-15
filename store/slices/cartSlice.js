import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCartApi, fetchProductsApi, addCartItemApi, deleteCartItemApi, updateCartItemQtyApi } from '../apiService';

const getVariantSize = (variant) => {
  const sizeAttribute = variant?.attribute_values?.find((attribute) => attribute.attribute_id === 1);
  return sizeAttribute?.value || '';
};

const getCartFromResponse = (payload) => payload?.cart || payload || null;

const mapApiCartItem = (item, fallbackItem = null, productsList = []) => {
  const variant = item.variant || {};
  const product = variant.product || item.product || {};
  const quantity = Number(item.quantity) || 1;
  const price = parseFloat(variant.price || item.price || product.base_price) || 0;
  const fallbackMatchesVariant = fallbackItem && (fallbackItem.variantId || fallbackItem.variant_id) === (item.variant_id || variant.id);

  const productId = variant.product_id || item.product_id || product.id || fallbackItem?.id || item.id;
  const matchedProduct = Array.isArray(productsList) ? productsList.find(p => p.id === productId) : null;
  const rawImageUrl = variant.image || item.image || item.product_image || product.thumbnail || product.galleries?.[0]?.image_url || matchedProduct?.galleries?.[0]?.image_url || matchedProduct?.thumbnail || fallbackItem?.image;

  return {
    id: productId,
    cartItemId: item.id,
    variantId: item.variant_id || variant.id,
    name: product.name || item.product_name || item.name || fallbackItem?.name || matchedProduct?.name,
    price: price || fallbackItem?.price || 0,
    quantity,
    totalPrice: parseFloat(item.total) || (price || fallbackItem?.price || 0) * quantity,
    image: rawImageUrl,
    size: item.size || getVariantSize(variant) || (fallbackMatchesVariant ? fallbackItem.size : ''),
    slug: product.slug || item.slug || item.product_slug || fallbackItem?.slug || matchedProduct?.slug,
  };
};

// Fetch cart data from API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      // Check if products list is already in state
      let productsList = state.products?.items || [];
      const fetchProductsNeeded = productsList.length === 0;

      const cartPromise = fetchCartApi(token);
      const productsPromise = fetchProductsNeeded ? fetchProductsApi({ per_page: 100 }) : null;

      const [cartData, productsData] = await Promise.all([
        cartPromise,
        productsPromise
      ]);

      let products = productsList;
      if (productsData) {
        products = productsData.products?.data || [];
      }

      return {
        cartData,
        products,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async (item, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to add items to cart');
      }

      const variantId = item.variant_id || item.variantId;
      if (!variantId) {
        return rejectWithValue('Please select a valid product variant');
      }

      const data = await addCartItemApi(variantId, item.quantity || 1, token);

      return {
        item,
        data: data.data,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (cartItemId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to modify cart');
      }

      await deleteCartItemApi(cartItemId, token);
      return { cartItemId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async ({ cartItemId, variantId, currentQty, targetQty }, { dispatch, rejectWithValue, getState }) => {
    try {
      if (targetQty <= 0) {
        await dispatch(deleteCartItem(cartItemId)).unwrap();
        return { cartItemId, quantity: 0 };
      }

      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to modify cart');
      }

      await updateCartItemQtyApi(cartItemId, targetQty, token);

      // Fetch the updated cart from backend to sync promotions, totals, etc.
      await dispatch(fetchCart()).unwrap();

      return { cartItemId, quantity: targetQty };
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  }
);

export const clearCartFromServer = createAsyncThunk(
  'cart/clearCartFromServer',
  async (itemsToClear, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      let token = state.auth?.token;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      if (!token) {
        return rejectWithValue('Please login to clear cart');
      }

      const items = itemsToClear || state.cart.items || [];
      const cartItemIds = items
        .map(item => item.cartItemId || item.id)
        .filter(Boolean);

      const deletePromises = cartItemIds.map(id =>
        deleteCartItemApi(id, token).catch(err => {
          console.error(`Error deleting cart item ${id}:`, err);
        })
      );

      await Promise.all(deletePromises);
      dispatch(clearCart());
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  cartData: null,
  promotionData: null,
  loading: false,
  error: null,
  appliedCoupon: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id && item.size === newItem.size);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.image,
          size: newItem.size,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
      state.totalAmount += newItem.price;
    },
    removeItem(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find(item => item.id === id &&
        item.size === size);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter(
          item => !(item.id === id && item.size === size)
        );
      }
    },


    increaseQuantity(state, action) {

      const { id, size } = action.payload;

      const existingItem = state.items.find(
        item =>
          item.id === id &&
          item.size === size
      );

      if (existingItem) {

        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;

        state.totalQuantity++;
        state.totalAmount += existingItem.price;

      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.cartData = null;
      state.promotionData = null;
      state.appliedCoupon = null;
    },
    applyCoupon(state, action) {
      state.appliedCoupon = action.payload;
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartPayload = action.payload?.cartData || action.payload;
        const productsList = action.payload?.products || [];
        const cart = getCartFromResponse(cartPayload);
        const promotion_data = cartPayload?.promotion_data || action.payload?.promotion_data;

        state.cartData = cart;
        state.promotionData = promotion_data;

        if (cart?.items && Array.isArray(cart.items) && cart.items.length > 0) {
          state.items = cart.items.map(item => mapApiCartItem(item, null, productsList));

          state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
        } else {
          state.items = [];
          state.totalQuantity = 0;
          state.totalAmount = 0;
        }
        console.log('=== REDUX CART API: Fetch Cart Succeeded - Updated State ===');
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('=== REDUX CART API: Fetch Cart Failed ===', action.payload);
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const cart = getCartFromResponse(action.payload.data);

        if (cart?.items && Array.isArray(cart.items)) {
          state.cartData = cart;
          const productsList = state.products?.items || [];
          state.items = cart.items.map((cartItem) => mapApiCartItem(cartItem, action.payload.item, productsList));
          state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
          return;
        }

        const newItem = action.payload.item;
        const quantity = newItem.quantity || 1;
        const existingItem = state.items.find(item => item.variantId === newItem.variantId || item.variantId === newItem.variant_id);

        if (!existingItem) {
          state.items.push({
            id: newItem.id,
            variantId: newItem.variantId || newItem.variant_id,
            name: newItem.name,
            slug: newItem.slug,
            price: newItem.price,
            quantity,
            totalPrice: newItem.price * quantity,
            image: newItem.image,
            size: newItem.size,
          });
        } else {
          existingItem.quantity += quantity;
          existingItem.totalPrice += newItem.price * quantity;
        }

        state.totalQuantity += quantity;
        state.totalAmount += newItem.price * quantity;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId } = action.payload;
        state.items = state.items.filter(item => item.cartItemId !== cartItemId);
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId, quantity } = action.payload;
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.cartItemId !== cartItemId);
        } else {
          const item = state.items.find(item => item.cartItemId === cartItemId);
          if (item) {
            item.quantity = quantity;
            item.totalPrice = item.price * quantity;
          }
        }
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addItem, removeItem, clearCart, increaseQuantity, applyCoupon, removeCoupon, } = cartSlice.actions;
export default cartSlice.reducer;
