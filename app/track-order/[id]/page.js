'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  fetchOrderDetail, 
  cancelOrder, 
  cancelOrderItem, 
  clearOrderDetail 
} from '../../../store/slices/orderSlice';
import { showToast } from '../../../store/slices/toastSlice';
import { getImageUrl } from '../../../store/apiConfig';
import '../track.css';
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Check, 
  XCircle, 
  ArrowLeft, 
  CreditCard, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  ImageIcon
} from 'lucide-react';
// Steps List configuration
const stepsList = [
  { status: 'pending', label: 'Order Placed', desc: 'We have received your order.' },
  { status: 'confirmed', label: 'Confirmed', desc: 'Seller has accepted your order.' },
  { status: 'shipped', label: 'Shipped', desc: 'Your package is on the way.' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Package will arrive today.' },
  { status: 'delivered', label: 'Delivered', desc: 'Order has been delivered.' }
];

const firstValue = (...values) => values.find((value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== '';
});

const getOrderItemImage = (item) => {
  const rawImage = firstValue(
    item.product_image,
    item.image,
    item.image_url,
    item.variant_image,
    item.variant?.image,
    item.variant?.image_url,
    item.variant?.product?.thumbnail,
    item.variant?.product?.image,
    item.variant?.product?.image_url,
    item.variant?.product?.galleries?.[0]?.image_url,
    item.product?.thumbnail,
    item.product?.image,
    item.product?.image_url,
    item.product?.galleries?.[0]?.image_url,
    item.galleries?.[0]?.image_url
  );

  if (!rawImage) return '';
  if (typeof rawImage === 'string' && rawImage.startsWith('/api/proxy-image')) return rawImage;
  return getImageUrl(rawImage);
};

const getOrderItemName = (item) => firstValue(
  item.product_name,
  item.name,
  item.variant?.product?.name,
  item.product?.name,
  item.variant_name,
  'Product Item'
);

const getOrderItemMeta = (item) => {
  const meta = [];
  const variantName = firstValue(item.variant_name, item.variant?.name, item.variant?.sku);
  const size = firstValue(item.size, item.variant?.size, item.variant?.attributes?.size);
  const color = firstValue(item.color, item.colour, item.variant?.color, item.variant?.colour);

  if (variantName) meta.push(`Style: ${variantName}`);
  if (size) meta.push(`Size: ${size}`);
  if (color) meta.push(`Color: ${color}`);

  return meta.join(' | ');
};

const parseAmount = (value) => {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (value, minimumFractionDigits = 0) => (
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(parseAmount(value))
);

export default function TrackOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.id;
  const isNewOrder = searchParams.get('success') === 'true';

  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { 
    orderDetail = null, 
    orderDetailLoading = false, 
    orderDetailError = null,
    actionLoading = false 
  } = useSelector((state) => state.orders || {});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated && token && orderNumber) {
      dispatch(fetchOrderDetail({ orderNumber, token }));
    }
    return () => {
      if (mounted) {
        dispatch(clearOrderDetail());
      }
    };
  }, [mounted, isAuthenticated, token, orderNumber, dispatch]);

  const handleCancelOrder = async () => {
    if (!orderDetail) return;
    if (!window.confirm(`Are you sure you want to cancel your entire order ${orderDetail.order_number}?`)) {
      return;
    }
    const reason = prompt('Please enter the reason for cancellation:');
    if (!reason || !reason.trim()) {
      dispatch(showToast({ message: 'Cancellation reason is required.', type: 'error' }));
      return;
    }

    try {
      await dispatch(cancelOrder({ payload: { order_id: orderDetail.id, reason }, token })).unwrap();
      dispatch(showToast({ message: 'Order cancelled successfully!', type: 'success' }));
      // Reload order details
      dispatch(fetchOrderDetail({ orderNumber, token }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to cancel order.', type: 'error' }));
    }
  };

  const handleCancelItem = async (itemId) => {
    if (!window.confirm(`Are you sure you want to cancel this item?`)) {
      return;
    }
    const reason = prompt('Please enter the reason for cancellation:');
    if (!reason || !reason.trim()) {
      dispatch(showToast({ message: 'Cancellation reason is required.', type: 'error' }));
      return;
    }

    try {
      await dispatch(cancelOrderItem({ payload: { order_item_id: itemId, reason }, token })).unwrap();
      dispatch(showToast({ message: 'Item cancelled successfully!', type: 'success' }));
      // Reload order details
      dispatch(fetchOrderDetail({ orderNumber, token }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to cancel item.', type: 'error' }));
    }
  };

  if (!mounted) {
    return null; // Hydration guard
  }

  if (!isAuthenticated) {
    return (
      <div className="track-container d-flex align-items-center justify-content-center">
        <div className="text-center p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <ShieldAlert size={48} className="text-warning mb-3 mx-auto" />
          <h3 className="fw-bold mb-2">Access Denied</h3>
          <p className="text-muted mb-4">Please log in to track your order details.</p>
          <Link href="/" className="btn btn-warning px-4 py-2 rounded-pill fw-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (orderDetailLoading) {
    return (
      <div className="track-container d-flex align-items-center justify-content-center">
        <div className="text-center py-5">
          <Loader2 className="spinner mb-3 mx-auto" size={40} style={{ color: '#bf8a52', animation: 'spin 1s linear infinite' }} />
          <p className="text-muted">Fetching your tracking details...</p>
        </div>
      </div>
    );
  }

  if (orderDetailError) {
    return (
      <div className="track-container d-flex align-items-center justify-content-center">
        <div className="text-center p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <XCircle size={48} className="text-danger mb-3 mx-auto" />
          <h3 className="fw-bold mb-2">Failed to Load Order</h3>
          <p className="text-muted mb-4">{orderDetailError}</p>
          <div className="d-flex gap-3 justify-content-center">
            <button 
              onClick={() => dispatch(fetchOrderDetail({ orderNumber, token }))} 
              className="btn btn-warning px-4 py-2 rounded-pill fw-semibold"
            >
              Retry
            </button>
            <Link href="/userProfile?tab=orders" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="track-container d-flex align-items-center justify-content-center">
        <div className="text-center p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <Package size={48} className="text-muted mb-3 mx-auto" />
          <h3 className="fw-bold mb-2">Order Not Found</h3>
          <p className="text-muted mb-4">We could not retrieve order number <strong>{orderNumber}</strong>.</p>
          <Link href="/userProfile?tab=orders" className="btn btn-warning px-4 py-2 rounded-pill fw-semibold">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Determine current active step index
  const currentStatus = orderDetail.status?.toLowerCase() || 'pending';
  const isCancelled = currentStatus === 'cancelled';
  const isReturned = currentStatus === 'returned';

  let activeIndex = 0;
  if (currentStatus === 'confirmed' || currentStatus === 'processing') {
    activeIndex = 1;
  } else if (currentStatus === 'shipped') {
    activeIndex = 2;
  } else if (currentStatus === 'out_for_delivery') {
    activeIndex = 3;
  } else if (currentStatus === 'delivered' || currentStatus === 'completed') {
    activeIndex = 4;
  }

  // Calculate percentage width for progress bar line
  const progressPercent = isCancelled || isReturned ? 0 : (activeIndex / (stepsList.length - 1)) * 100;

  // Render step icons
  const getStepIcon = (index, isCompleted, isActive) => {
    if (isCompleted) return <Check size={18} strokeWidth={3} />;
    switch (index) {
      case 0: return <Package size={18} />;
      case 1: return <CheckCircle2 size={18} />;
      case 2: return <Truck size={18} />;
      case 3: return <MapPin size={18} />;
      case 4: return <CheckCircle2 size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const isCancellable = currentStatus === 'pending' || currentStatus === 'confirmed';
  const orderItems = orderDetail.items || [];
  const subtotal = firstValue(orderDetail.subtotal, orderDetail.sub_total, orderDetail.items_total, orderDetail.total_amount);
  const shipping = firstValue(orderDetail.shipping_charge, orderDetail.shipping_amount, orderDetail.delivery_charge, 0);
  const discount = firstValue(orderDetail.coupon_discount, orderDetail.discount_amount, 0);
  const shippingAddress = orderDetail.shipping_address || {};
  const recipientName = firstValue(shippingAddress.full_name, shippingAddress.name, orderDetail.customer_name, orderDetail.name, 'Recipient');
  const streetAddress = firstValue(shippingAddress.address, shippingAddress.street, shippingAddress.line1, orderDetail.address, 'Address not listed');
  const city = firstValue(shippingAddress.city, orderDetail.city);
  const state = firstValue(shippingAddress.state, orderDetail.state);
  const pincode = firstValue(shippingAddress.pincode, shippingAddress.postal_code, shippingAddress.zip, orderDetail.pincode);
  const phone = firstValue(shippingAddress.phone, orderDetail.phone, 'N/A');

  return (
    <div className="track-container">
      <div className="container-lg">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <Link href="/userProfile?tab=orders" className="text-decoration-none text-muted d-flex align-items-center gap-2 fw-semibold">
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
          <span className="text-muted fs-7">Order Ref: <strong>{orderDetail.order_number}</strong></span>
        </div>

        {/* Success Confirmation Banner */}
        {isNewOrder && (
          <div className="track-card success-banner mb-4">
            <div className="success-icon-box">
              <Sparkles size={32} />
            </div>
            <h2 className="success-title">Thank You for Your Order!</h2>
            <p className="success-subtitle">
              Your order has been placed successfully. Below is the live tracking status of your shipment.
            </p>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div className="cancelled-banner">
            <span className="cancelled-icon">⚠️</span>
            <div>
              <h4 className="cancelled-title">Order Cancelled</h4>
              <p className="cancelled-desc">
                This order was cancelled. {orderDetail.cancel_reason && `Reason: "${orderDetail.cancel_reason}"`}
              </p>
            </div>
          </div>
        )}

        {/* Returned Banner */}
        {isReturned && (
          <div className="cancelled-banner" style={{ backgroundColor: '#fffaf0', border: '1px solid #ffe8cc', color: '#b27b12' }}>
            <span className="cancelled-icon">↩️</span>
            <div>
              <h4 className="cancelled-title" style={{ color: '#b27b12' }}>Order Returned</h4>
              <p className="cancelled-desc" style={{ color: '#c48b1d' }}>
                This order has been returned.
              </p>
            </div>
          </div>
        )}

        {/* Live Stepper Tracker Section */}
        {!isCancelled && !isReturned && (
          <div className="track-card track-stepper-container mb-4">
            <h5 className="fw-bold mb-4 text-center text-md-start" style={{ color: '#3e332a' }}>Live Tracking Details</h5>
            <div className="track-stepper">
              {/* Stepper connecting progress lines */}
              <div className="track-stepper-progress" style={{ 
                width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${progressPercent}%` : '4px',
                height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${progressPercent}%` : '4px'
              }}></div>
              
              {stepsList.map((step, idx) => {
                const isCompleted = idx < activeIndex || currentStatus === 'delivered' || currentStatus === 'completed';
                const isActive = idx === activeIndex && currentStatus !== 'delivered' && currentStatus !== 'completed';
                
                return (
                  <div key={idx} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-node">
                      {getStepIcon(idx, isCompleted, isActive)}
                    </div>
                    <div className="step-label">
                      <div className="fw-bold">{step.label}</div>
                      <div className="text-muted fs-8 d-none d-md-block" style={{ fontWeight: 400, maxWidth: '160px', marginTop: '4px' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Split Grid Details */}
        <div className="track-grid">
          {/* Left Column - Ordered Items */}
          <div>
            <div className="track-card p-4">
              <h4 className="section-card-title">
                <Package size={20} /> Ordered Items
              </h4>

              {orderItems.map((item) => {
                const isItemCancelled = item.status?.toLowerCase() === 'cancelled';
                const itemImage = getOrderItemImage(item);
                const itemName = getOrderItemName(item);
                const itemMeta = getOrderItemMeta(item);
                const itemPrice = firstValue(item.price, item.unit_price, item.variant?.price, 0);
                return (
                  <div key={item.id} className="track-item-card">
                    <div className="track-item-media">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="track-item-img"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            event.currentTarget.parentElement?.classList.add('image-missing');
                          }}
                        />
                      ) : (
                        <ImageIcon size={26} />
                      )}
                    </div>
                    <div className="track-item-info">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="track-item-name">{itemName}</h5>
                        {isItemCancelled && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Cancelled</span>
                        )}
                      </div>
                      {itemMeta && <p className="track-item-meta">{itemMeta}</p>}
                      <div className="track-item-price-qty">
                        <span className="track-item-price">{formatCurrency(itemPrice)}</span>
                        <span className="track-item-qty">Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                    
                    {/* Item-level cancellation option */}
                    {isCancellable && !isItemCancelled && orderItems.length > 1 && (
                      <button 
                        onClick={() => handleCancelItem(item.id || item.order_item_id)} 
                        className="track-cancel-link"
                        disabled={actionLoading}
                      >
                        Cancel Item
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions for Entire Order */}
            {isCancellable && (
              <div className="d-flex gap-3 justify-content-end mb-4">
                <button 
                  onClick={handleCancelOrder}
                  className="btn btn-outline-danger px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
                  disabled={actionLoading}
                >
                  Cancel Entire Order
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Billing & Shipping Summaries */}
          <div>
            {/* Delivery address card */}
            <div className="track-card p-4">
              <h4 className="section-card-title">
                <MapPin size={20} /> Shipping Address
              </h4>
              <div className="info-item">
                <div className="info-item-value fw-bold mb-1">
                  {recipientName}
                </div>
                <div className="text-muted fs-7 lh-base" style={{ wordBreak: 'break-word' }}>
                  {streetAddress}<br />
                  {[city, state].filter(Boolean).join(', ')}
                  {pincode ? ` - ${pincode}` : ''}<br />
                  <strong>Phone:</strong> {phone}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="track-card p-4">
              <h4 className="section-card-title">
                <CreditCard size={20} /> Payment Method
              </h4>
              <div className="d-flex align-items-center gap-3">
                <div className="track-payment-icon">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="fw-bold text-uppercase">{orderDetail.payment_method || 'Online Payment'}</div>
                  <div className="text-muted fs-8">Paid Securely</div>
                </div>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="track-card p-4">
              <h4 className="section-card-title">
                <Calendar size={20} /> Billing Summary
              </h4>

              <div className="summary-row justify-content-between d-flex">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">{formatCurrency(subtotal, 2)}</span>
              </div>
              
              <div className="summary-row justify-content-between d-flex">
                <span className="text-muted">Shipping</span>
                <span className="fw-semibold">{formatCurrency(shipping)}</span>
              </div>

              {parseAmount(discount) > 0 && (
                <div className="summary-row justify-content-between d-flex text-success">
                  <span>Coupon Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="summary-row justify-content-between d-flex total">
                <span>Grand Total</span>
                <span className="track-total-amount">{formatCurrency(orderDetail.total_amount, 2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
