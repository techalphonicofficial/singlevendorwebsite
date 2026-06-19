import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBannersApi } from '../apiService';

export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBannersApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  banners: [],
  loading: false,
  error: null,
  topBanners: [],
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
        // Filter banners with position = "top" AND have video_path
        state.topBanners = state.banners.filter(banner => banner.position === 'top' && banner.video_path);
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
