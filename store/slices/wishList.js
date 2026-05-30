import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,

  reducers: {
    addToWishlist(state, action) {
      const item = action.payload;

      const existingItem = state.items.find(
        (i) => i.id === item.id
      );

      if (!existingItem) {
        state.items.push(item);
        state.totalQuantity++;
      }
    },

    removeFromWishlist(state, action) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

          state.totalQuantity--;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;