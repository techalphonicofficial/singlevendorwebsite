import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPageBySlugApi } from '../apiService';

export const fetchPageBySlug = createAsyncThunk(
  'pages/fetchPageBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const data = await fetchPageBySlugApi(slug);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch page');
    }
  }
);

const initialState = {
  pageData: {}, // Map of slug -> page & banner data
  loading: {},  // Map of slug -> loading state
  error: {},    // Map of slug -> error state
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearPageData: (state, action) => {
      const slug = action.payload;
      if (slug) {
        delete state.pageData[slug];
        delete state.loading[slug];
        delete state.error[slug];
      } else {
        state.pageData = {};
        state.loading = {};
        state.error = {};
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageBySlug.pending, (state, action) => {
        const slug = action.meta.arg;
        state.loading[slug] = true;
        state.error[slug] = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action) => {
        const slug = action.meta.arg;
        state.loading[slug] = false;
        state.pageData[slug] = action.payload.data || action.payload;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
        const slug = action.meta.arg;
        state.loading[slug] = false;
        state.error[slug] = action.payload || 'Failed to fetch page';
      });
  },
});

export const { clearPageData } = pageSlice.actions;
export default pageSlice.reducer;
