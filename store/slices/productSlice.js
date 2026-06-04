import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsApi, fetchProductDetailApi } from '../apiService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const data = await fetchProductsApi(queryParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchProductDetailApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  filters: {
    categories: [],
    brands: [],
    attributes: [],
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    total: 0,
    nextPageUrl: null,
    prevPageUrl: null,
  },
  selectedProduct: null,
  loading: false,
  error: null,
  detailLoading: false,
  detailError: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.selectedProduct = null;
      state.detailError = null;
      state.detailLoading = false;
    },
    clearProductErrors: (state) => {
      state.error = null;
      state.detailError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products?.data || [];
        state.filters = action.payload.filters || { categories: [], brands: [], attributes: [] };
        state.pagination = {
          currentPage: action.payload.products?.currentPage || 1,
          totalPages: action.payload.products?.totalPages || 1,
          perPage: action.payload.products?.perPage || 20,
          total: action.payload.products?.total || 0,
          nextPageUrl: action.payload.products?.nextPageUrl || null,
          prevPageUrl: action.payload.products?.prevPageUrl || null,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch Product Detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload.product || action.payload; // handles both {product: obj} or flat obj
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || action.error.message;
      });
  },
});

export const { clearProductDetails, clearProductErrors } = productSlice.actions;

export default productSlice.reducer;
