import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, verifyOtpApi, sendOtpApi, loginUserApi, updateProfileApi } from '../apiService';

// SSR-safe function to retrieve initial auth state from localStorage
const getStoredAuth = () => {
  if (typeof window !== 'undefined') {
    try {
      const user = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        isAuthenticated: !!token,
      };
    } catch (e) {
      console.error('Error reading auth details from localStorage:', e);
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const storedAuth = getStoredAuth();

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: storedAuth.isAuthenticated,
  loading: false,
  error: null,
  otpStatus: null,
  registrationStatus: null,
  otpData: null,
};

// 1. Register Thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Verify OTP Thunk
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await verifyOtpApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Send OTP Thunk
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await sendOtpApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Login Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Update Profile Thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const data = await updateProfileApi(payload, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpStatus = null;
      state.registrationStatus = null;
      state.otpData = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
      }
    },
    clearAuthErrors: (state) => {
      state.error = null;
    },
    clearRegistrationStatus: (state) => {
      state.registrationStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationStatus = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationStatus = action.payload.message;
        state.otpData = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.data.user));
          localStorage.setItem('auth_token', action.payload.data.token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpStatus = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload.message;
        state.otpData = action.payload.data;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.data.user));
          localStorage.setItem('auth_token', action.payload.data.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.data));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, updateUserProfile, clearAuthErrors, clearRegistrationStatus } = authSlice.actions;

export default authSlice.reducer;
