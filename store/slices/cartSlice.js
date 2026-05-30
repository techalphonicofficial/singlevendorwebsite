import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
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
    },
  },
});

export const { addItem, removeItem, clearCart, increaseQuantity, } = cartSlice.actions;
export default cartSlice.reducer;
