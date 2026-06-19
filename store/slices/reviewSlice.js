import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addReviewApi, fetchReviewsApi } from '../apiService';
import { fetchOrders } from './orderSlice';

export { fetchOrders };

const initialState = {
  reviews: [],
  orders: [],
  loading: false,
  reviewsLoading: false,
  ordersLoading: false,
  error: null,
  reviewError: null,
};

// Fetch reviews for a product
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchReviewsApi(productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Add a new review
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const data = await addReviewApi(payload, token);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.reviewError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch reviews
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload || [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewError = action.payload;
        state.reviews = [];
      });

    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
        state.orders = [];
      });

    // Add review
    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.reviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new review to the reviews array
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.reviewError = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
