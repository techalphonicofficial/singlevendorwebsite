import React, { useEffect } from 'react';
import { Package, Heart, Award, MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import './userprofile.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboard, cancelOrder } from '../store/slices/orderSlice';
import { showToast } from '../store/slices/toastSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const { dashboardData, dashboardLoading, dashboardError, actionLoading } = useSelector((state) => state.orders || {});

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchDashboard(token));
    }
  }, [isAuthenticated, token, dispatch]);

  const handleCancelOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel order ${orderNumber}?`)) {
      return;
    }
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason || !reason.trim()) {
      dispatch(showToast({ message: 'Cancellation reason is required.', type: 'error' }));
      return;
    }

    try {
      await dispatch(cancelOrder({ payload: { order_id: orderId, reason }, token })).unwrap();
      dispatch(showToast({ message: 'Order cancelled successfully!', type: 'success' }));
      // Refresh dashboard data
      dispatch(fetchDashboard(token));
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to cancel order.', type: 'error' }));
    }
  };

  const renderActions = (order) => {
    const status = order.status?.toLowerCase();
    if (status === 'pending' || status === 'processing') {
      return (
        <button
          className="action-btn-premium action-cancel"
          disabled={actionLoading}
          onClick={() => handleCancelOrder(order.order_id || order.id, order.order_number)}
        >
          {actionLoading ? 'Cancelling...' : 'Cancel'}
        </button>
      );
    }
    if (status === 'delivered') {
      return (
        <div className="action-flex">
          <button className="action-btn-premium action-replace">
            Replace
          </button>
          <button className="action-btn-premium action-refund">
            Refund
          </button>
        </div>
      );
    }
    return <span className="action-disabled">-</span>;
  };

  if (dashboardLoading && !dashboardData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader2 className="spinner" size={40} style={{ color: '#d4a574', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '10px', fontSize: '16px', color: '#666' }}>Loading dashboard data...</span>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
        <p>Error loading dashboard: {dashboardError}</p>
        <button 
          onClick={() => dispatch(fetchDashboard(token))} 
          style={{ padding: '8px 16px', backgroundColor: '#d4a574', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total_orders: 0,
    total_spent: "0.00",
    pending_orders: 0,
    deliver_orders: 0
  };

  const recentOrdersList = dashboardData?.recent_orders || [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-premium">
        {isAuthenticated && <h2>Namaste, {dashboardData?.customer?.name || user?.name || 'Customer'}!</h2>}
        <p>Welcome to your personal dashboard. Manage your elegant ensembles, track your bespoke orders, and view your exclusive privilege points all in one place.</p>
      </div>

      {/* STATS CARDS */}
      <div className="dashboard-stats">
        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>{stats.total_orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Package size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>{stats.pending_orders}</h3>
            <p>In Progress / Pending</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Award size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>₹{parseFloat(stats.total_spent || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <p>Total Spent</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Heart size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>{stats.deliver_orders || 0}</h3>
            <p>Delivered Orders</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS OVERVIEW */}
      <div className="dashboard-bottom-full">
        <div className="dashboard-card-premium table-card">
          <div className="card-header-premium">
            <h3>Recent Purchases</h3>
          </div>
          <div className="table-responsive">
            {recentOrdersList.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#888' }}>You haven't placed any orders yet.</p>
            ) : (
              <table className="recent-orders-table-premium">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th className="text-center">Status</th>
                    <th className="action-column">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrdersList.map((order, index) => {
                    const orderDate = order.created_at 
                      ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'N/A';
                    return (
                      <tr key={order.order_id || index} className="table-row-premium">
                        <td className="order-id-cell">{order.order_number}</td>
                        <td className="order-date-cell">{orderDate}</td>
                        <td className="order-total-cell">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                        <td className="text-center">
                          <span className={`status-badge-premium status-${order.status?.toLowerCase()}-premium`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="action-column">
                          {renderActions(order)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
