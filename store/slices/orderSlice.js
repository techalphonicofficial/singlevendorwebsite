import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchOrdersApi,
  fetchOrderDetailApi,
  fetchCheckoutApi,
  placeOrderApi,
  fetchDashboardApi,
  cancelOrderApi,
  cancelOrderItemApi
} from '../apiService';

const initialState = {
  // Orders List
  orders: [],
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  },
  ordersLoading: false,
  ordersError: null,

  // Order Details
  orderDetail: null,
  orderDetailLoading: false,
  orderDetailError: null,

  // Dashboard Data
  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,

  // Checkout Data
  checkoutData: null,
  checkoutLoading: false,
  checkoutError: null,

  // General Action Loading (e.g. Cancelling)
  actionLoading: false,
  actionError: null,
};

// 1. Fetch Orders (Paginated)
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (args, { rejectWithValue }) => {
    try {
      let activeToken;
      let activePage = 1;
      if (typeof args === 'string') {
        activeToken = args;
      } else if (args && typeof args === 'object') {
        activeToken = args.token;
        activePage = args.page || 1;
      }
      const data = await fetchOrdersApi(activeToken, activePage);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Fetch Order Detail
export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async ({ orderNumber, token }, { rejectWithValue }) => {
    try {
      const data = await fetchOrderDetailApi(orderNumber, token);
      return data; // returns { order: { ... } }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Fetch Checkout Details
export const fetchCheckoutDetails = createAsyncThunk(
  'orders/fetchCheckoutDetails',
  async (token, { rejectWithValue }) => {
    try {
      const data = await fetchCheckoutApi(token);
      return data; // returns { cart: { ... }, addresses: [ ... ], promotions: { ... }, payment_gateways: [ ... ] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Place Order
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const data = await placeOrderApi(payload, token);
      return data; // returns success status and placed order details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Fetch Dashboard Data
export const fetchDashboard = createAsyncThunk(
  'orders/fetchDashboard',
  async (token, { rejectWithValue }) => {
    try {
      const data = await fetchDashboardApi(token);
      return data; // returns { customer: { ... }, stats: { ... }, recent_orders: [ ... ] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 6. Cancel Order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const data = await cancelOrderApi(payload, token);
      return data; // returns cancelled order details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 7. Cancel Order Item
export const cancelOrderItem = createAsyncThunk(
  'orders/cancelOrderItem',
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const data = await cancelOrderItemApi(payload, token);
      return data; // returns updated order item details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderDetail: (state) => {
      state.orderDetail = null;
      state.orderDetailError = null;
    },
    clearCheckoutData: (state) => {
      state.checkoutData = null;
      state.checkoutError = null;
    },
    clearActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    // 1. Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload?.data || (Array.isArray(action.payload) ? action.payload : []);
        state.pagination = {
          current_page: action.payload?.current_page || 1,
          last_page: action.payload?.last_page || 1,
          total: action.payload?.total || state.orders.length,
          per_page: action.payload?.per_page || 10,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      });

    // 2. Fetch Order Detail
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.orderDetailLoading = true;
        state.orderDetailError = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.orderDetailLoading = false;
        state.orderDetail = action.payload?.order || action.payload || null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.orderDetailLoading = false;
        state.orderDetailError = action.payload;
      });

    // 3. Fetch Checkout Details
    builder
      .addCase(fetchCheckoutDetails.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(fetchCheckoutDetails.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutData = action.payload;
      })
      .addCase(fetchCheckoutDetails.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload;
      });

    // 4. Place Order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // 5. Fetch Dashboard Data
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });

    // 6. Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update local orders list status if applicable
        const updatedOrder = action.payload?.data || action.payload;
        if (updatedOrder) {
          state.orders = state.orders.map(order => 
            (order.order_id === updatedOrder.id || order.id === updatedOrder.id)
              ? { ...order, status: 'cancelled' }
              : order
          );
          if (state.orderDetail && (state.orderDetail.id === updatedOrder.id || state.orderDetail.order_id === updatedOrder.id)) {
            state.orderDetail.status = 'cancelled';
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });

    // 7. Cancel Order Item
    builder
      .addCase(cancelOrderItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(cancelOrderItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedItem = action.payload?.data || action.payload;
        if (updatedItem && state.orderDetail && state.orderDetail.items) {
          state.orderDetail.items = state.orderDetail.items.map(item => 
            (item.id === updatedItem.id || item.order_item_id === updatedItem.id)
              ? { ...item, status: 'cancelled', cancelled_at: updatedItem.cancelled_at || new Date().toISOString() }
              : item
          );
        }
      })
      .addCase(cancelOrderItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearOrderDetail, clearCheckoutData, clearActionState } = orderSlice.actions;
export default orderSlice.reducer;
