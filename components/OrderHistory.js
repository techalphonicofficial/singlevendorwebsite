import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiBox, FiTrash2, FiMapPin, FiCreditCard, FiArrowLeft, FiX, FiCheck } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { fetchOrders, fetchOrderDetail, cancelOrder, cancelOrderItem, clearOrderDetail } from '../store/slices/orderSlice';
import { showToast } from '../store/slices/toastSlice';
import './userprofile.css';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { 
    orders = [], 
    pagination = { current_page: 1, last_page: 1, total: 0, per_page: 10 }, 
    ordersLoading = false, 
    orderDetail = null, 
    orderDetailLoading = false, 
    actionLoading = false 
  } = useSelector((state) => state.orders || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);

  // Load orders on page change
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchOrders({ token, page: currentPage }));
    }
  }, [isAuthenticated, token, currentPage, dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel the entire order ${orderNumber}?`)) {
      return;
    }
    const reason = prompt('Please enter the reason for cancellation:');
    if (!reason || !reason.trim()) {
      dispatch(showToast({ message: 'Cancellation reason is required.', type: 'error' }));
      return;
    }

    try {
      await dispatch(cancelOrder({ payload: { order_id: orderId, reason }, token })).unwrap();
      dispatch(showToast({ message: 'Order cancelled successfully!', type: 'success' }));
      // Reload current page of orders
      dispatch(fetchOrders({ token, page: currentPage }));
      // If we are looking at the detail view of this order, reload it
      if (selectedOrderNumber === orderNumber) {
        dispatch(fetchOrderDetail({ orderNumber, token }));
      }
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to cancel order.', type: 'error' }));
    }
  };

  const handleCancelItem = async (orderItemId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel this item?`)) {
      return;
    }
    const reason = prompt('Please enter the reason for cancellation:');
    if (!reason || !reason.trim()) {
      dispatch(showToast({ message: 'Cancellation reason is required.', type: 'error' }));
      return;
    }

    try {
      await dispatch(cancelOrderItem({ payload: { order_item_id: orderItemId, reason }, token })).unwrap();
      dispatch(showToast({ message: 'Item cancelled successfully!', type: 'success' }));
      // Reload order details
      dispatch(fetchOrderDetail({ orderNumber, token }));
      // Also reload main list to keep price/status updated
      dispatch(fetchOrders({ token, page: currentPage }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to cancel item.', type: 'error' }));
    }
  };

  const handleViewDetails = (orderNumber) => {
    setSelectedOrderNumber(orderNumber);
    dispatch(fetchOrderDetail({ orderNumber, token }));
  };

  const handleBackToList = () => {
    setSelectedOrderNumber(null);
    dispatch(clearOrderDetail());
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'delivered':
      case 'completed':
        return <span className="status-badge-premium status-delivered-premium">Delivered</span>;
      case 'processing':
      case 'confirmed':
        return <span className="status-badge-premium status-processing-premium">Processing</span>;
      case 'shipped':
        return <span className="status-badge-premium status-shipped-premium">Shipped</span>;
      case 'pending':
        return <span className="status-badge-premium status-pending-premium">Pending</span>;
      case 'cancelled':
        return <span className="status-badge-premium" style={{ backgroundColor: '#fde8e8', color: '#e02424' }}>Cancelled</span>;
      default:
        return <span className="status-badge-premium">{status}</span>;
    }
  };

  // Render Order Details View
  if (selectedOrderNumber) {
    return (
      <div className="dashboard-card-premium">
        <div className="card-header-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0ede8', paddingBottom: '20px' }}>
          <button onClick={handleBackToList} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#bf8a52', fontWeight: 600 }}>
            <FiArrowLeft size={18} /> Back to List
          </button>
          <h3 style={{ margin: 0 }}>Order Detail: {selectedOrderNumber}</h3>
        </div>

        {orderDetailLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <Loader2 className="spinner" size={40} style={{ color: '#d4a574', animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: '10px', color: '#666' }}>Loading order details...</span>
          </div>
        )}

        {!orderDetailLoading && !orderDetail && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Failed to load order details or order not found.</p>
          </div>
        )}

        {!orderDetailLoading && orderDetail && (
          <div style={{ marginTop: '24px' }}>
            {/* Header Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', backgroundColor: '#fcfcfb', padding: '20px', borderRadius: '10px', border: '1px solid #f0ede8', marginBottom: '24px' }}>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Placed On</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{new Date(orderDetail.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Status</p>
                <div>{getStatusBadge(orderDetail.status)}</div>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Payment Method</p>
                <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>{orderDetail.payment_method || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Grand Total</p>
                <p style={{ margin: 0, fontWeight: 700, color: '#bf8a52', fontSize: '18px' }}>₹{parseFloat(orderDetail.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Main Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="order-detail-grid">
              {/* Left Column: Items */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Order Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orderDetail.items?.map((item) => {
                    const isItemPending = item.status?.toLowerCase() === 'pending' || item.status?.toLowerCase() === 'processing';
                    return (
                      <div key={item.id} style={{ display: 'flex', gap: '16px', border: '1px solid #f0ede8', borderRadius: '10px', padding: '16px', background: '#fff', position: 'relative' }}>
                        {/* Image */}
                        <div style={{ width: '80px', height: '90px', position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                          {item.variant?.product?.galleries?.[0]?.image_url || item.product_image ? (
                            <img 
                              src={item.variant?.product?.galleries?.[0]?.image_url || item.product_image} 
                              alt={item.product_name || item.variant?.product?.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}><FiBox size={30} /></div>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, paddingRight: '70px', lineHeight: 1.4 }}>
                            {item.product_name || item.variant?.product?.name || 'Product Variant'}
                          </h5>
                          {item.variant?.sku && (
                            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#888' }}>SKU: <span style={{ fontFamily: 'monospace' }}>{item.variant.sku}</span></p>
                          )}
                          <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                            <p style={{ margin: 0 }}>Qty: <strong>{item.quantity}</strong></p>
                            <p style={{ margin: 0 }}>Price: <strong>₹{parseFloat(item.unit_price).toLocaleString('en-IN')}</strong></p>
                          </div>
                          {item.status && (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: item.status?.toLowerCase() === 'cancelled' ? '#dc3545' : '#28a745' }}>
                                Status: {item.status}
                              </span>
                              {item.cancelled_at && (
                                <span style={{ fontSize: '11px', color: '#888' }}>(Cancelled on {new Date(item.cancelled_at).toLocaleDateString()})</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <p style={{ margin: 0, fontWeight: 700, color: '#1a1a1a' }}>
                            ₹{parseFloat(item.unit_price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                          {isItemPending && (
                            <button
                              onClick={() => handleCancelItem(item.id, selectedOrderNumber)}
                              className="action-btn-premium action-cancel"
                              style={{ padding: '6px 12px', fontSize: '12px', marginTop: '12px' }}
                              disabled={actionLoading}
                            >
                              Cancel Item
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Address & Pricing Summary */}
              <div>
                {/* Shipping Address */}
                {orderDetail.shipping_address && (
                  <div style={{ border: '1px solid #f0ede8', borderRadius: '10px', padding: '20px', marginBottom: '24px', background: '#fff' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiMapPin style={{ color: '#bf8a52' }} /> Shipping Address
                    </h5>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>{orderDetail.shipping_address.full_name}</p>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#555', lineHeight: 1.4 }}>
                      {orderDetail.shipping_address.street}, {orderDetail.shipping_address.city} - {orderDetail.shipping_address.postal_code}
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Phone: {orderDetail.shipping_address.phone}</p>
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div style={{ border: '1px solid #f0ede8', borderRadius: '10px', padding: '20px', background: '#fff' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 16px 0' }}>Cost Breakdown</h5>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                    <span>Subtotal</span>
                    <span>₹{parseFloat(orderDetail.total_amount - (orderDetail.shipping_amount || 0) + parseFloat(orderDetail.discount_amount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {parseFloat(orderDetail.discount_amount) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#27ae60' }}>
                      <span>Discount {orderDetail.coupon_code ? `(${orderDetail.coupon_code})` : ''}</span>
                      <span>- ₹{parseFloat(orderDetail.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {parseFloat(orderDetail.shipping_amount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                      <span>Shipping Charge</span>
                      <span>₹{parseFloat(orderDetail.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e5e5e5', paddingTop: '12px', marginTop: '12px', fontWeight: 700, fontSize: '15px' }}>
                    <span>Total Amount</span>
                    <span style={{ color: '#bf8a52' }}>₹{parseFloat(orderDetail.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Cancel Whole Order */}
                {(orderDetail.status?.toLowerCase() === 'pending' || orderDetail.status?.toLowerCase() === 'processing') && (
                  <button
                    onClick={() => handleCancelOrder(orderDetail.id, selectedOrderNumber)}
                    className="action-btn-premium action-cancel"
                    style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    disabled={actionLoading}
                  >
                    Cancel Entire Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Order List View
  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium">
        <h3>Order History</h3>
      </div>

      {ordersLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Loader2 className="spinner" size={36} style={{ color: '#d4a574', animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px', color: '#666' }}>Loading order history...</span>
        </div>
      )}

      {!ordersLoading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
          <FiBox size={48} style={{ marginBottom: '16px', color: '#d5cfc6' }} />
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>No orders found</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>You haven't placed any orders with us yet.</p>
        </div>
      )}

      {!ordersLoading && orders.length > 0 && (
        <div className="order-cards-container">
          {orders.map((order, index) => {
            const dateStr = order.created_at 
              ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'N/A';
            const timeStr = order.created_at
              ? new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : 'N/A';

            const firstItem = order.items?.[0];
            const itemCount = order.items?.length || 0;

            return (
              <div key={order.order_id || order.id || index} className="order-card-modern">
                <div className="order-card-header">
                  <div className="order-id-badge" style={{ cursor: 'pointer' }} onClick={() => handleViewDetails(order.order_number)}>
                    {order.order_number}
                  </div>
                  <div className="order-date-time">
                    <FiCalendar className="icon-sm" /> <span>{dateStr}</span>
                    <span className="dot-separator">•</span>
                    <FiClock className="icon-sm" /> <span>{timeStr}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-product-info" style={{ cursor: 'pointer' }} onClick={() => handleViewDetails(order.order_number)}>
                    <div className="order-product-icon">
                      {firstItem?.product_image ? (
                        <img 
                          src={firstItem.product_image} 
                          alt={firstItem.product_name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      ) : (
                        <FiBox />
                      )}
                    </div>
                    <div className="order-product-details">
                      <h4>
                        {firstItem?.product_name || 'Order Items'}
                        {itemCount > 1 && <span style={{ color: '#bf8a52', fontSize: '13px', marginLeft: '6px' }}> (+{itemCount - 1} more item{itemCount > 2 ? 's' : ''})</span>}
                      </h4>
                      <p className="order-product-price">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="order-card-actions">
                    {getStatusBadge(order.status)}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewDetails(order.order_number)} 
                        className="action-btn-premium action-replace"
                        style={{ border: '1px solid #bf8a52', color: '#bf8a52', background: 'transparent' }}
                      >
                        Details
                      </button>
                      {(order.status?.toLowerCase() === 'pending' || order.status?.toLowerCase() === 'processing') && (
                        <button 
                          onClick={() => handleCancelOrder(order.order_id || order.id, order.order_number)} 
                          className="action-btn-premium action-cancel"
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px', padding: '10px 0' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              
              {[...Array(pagination.last_page)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: currentPage === i + 1 ? '#bf8a52' : '#ddd',
                    background: currentPage === i + 1 ? '#bf8a52' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#333',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: currentPage === pagination.last_page ? '#eee' : '#fff', cursor: currentPage === pagination.last_page ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
