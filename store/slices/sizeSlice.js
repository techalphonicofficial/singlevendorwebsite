
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSizes: {}
};

const sizeSlice = createSlice({
  name: "sizes",
  initialState,

  reducers: {
    setSelectedSize: (state, action) => {
      const { productId, size } = action.payload;
      state.selectedSizes[productId] = size;
    },

    removeSelectedSize: (state, action) => {
  delete state.selectedSizes[action.payload];
},
  }
});

export const { setSelectedSize,removeSelectedSize } =
  sizeSlice.actions;

export default sizeSlice.reducer;