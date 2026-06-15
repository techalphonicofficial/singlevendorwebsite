'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCouponsApi } from '../../store/apiService';
import { applyCoupon as applyCouponAction, removeCoupon as removeCouponAction, clearCart, clearCartFromServer } from '../../store/slices/cartSlice';
import { fetchCheckoutDetails, placeOrder } from '../../store/slices/orderSlice';
import { showToast } from '../../store/slices/toastSlice';
import { Loader2, Check } from 'lucide-react';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  const { checkoutData, checkoutLoading, checkoutError, actionLoading } = useSelector((state) => state.orders);

  // Selected checkout options
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Coupon states
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Fetch checkout details & coupons on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchCheckoutDetails(token));
      
      const loadCoupons = async () => {
        setLoadingCoupons(true);
        try {
          const data = await fetchCouponsApi(token);
          setCoupons(data);
        } catch (err) {
          console.error('Failed to load coupons:', err);
        } finally {
          setLoadingCoupons(false);
        }
      };
      loadCoupons();
    }
  }, [token, dispatch]);

  // Pre-select default address and default payment method when checkoutData loads
  useEffect(() => {
    if (checkoutData) {
      // Find default address
      const defaultAddr = checkoutData.addresses?.find((addr) => addr.is_default || addr.isDefault) || checkoutData.addresses?.[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }

      // Find default payment gateway
      const defaultGateway = checkoutData.payment_gateways?.find((gw) => gw.is_default || gw.isDefault) || checkoutData.payment_gateways?.[0];
      if (defaultGateway) {
        setSelectedPaymentMethod(defaultGateway.slug);
      }
    }
  }, [checkoutData]);

  // Sync applied coupon with Redux state
  useEffect(() => {
    if (appliedCoupon && coupons.length > 0) {
      setCouponCode(appliedCoupon.code);
      setCouponSuccess(`Coupon "${appliedCoupon.code}" applied!`);
      setCouponError('');
    } else if (!appliedCoupon) {
      setCouponCode('');
      setCouponSuccess('');
    }
  }, [appliedCoupon, coupons]);

  // Apply coupon logic
  const applyCoupon = (code) => {
    setCouponError('');
    setCouponSuccess('');

    const trimmedCode = (code || couponCode).trim().toUpperCase();
    if (!trimmedCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matchedCoupon = coupons.find(
      (c) => c.code.toUpperCase() === trimmedCode
    );

    if (!matchedCoupon) {
      setCouponError('Invalid coupon code. Please try again.');
      return;
    }

    const now = new Date();
    const validFrom = new Date(matchedCoupon.valid_from);
    const validUntil = new Date(matchedCoupon.valid_until);

    if (now < validFrom) {
      setCouponError(`This coupon is not active yet. Valid from ${validFrom.toLocaleDateString()}.`);
      return;
    }
    if (now > validUntil) {
      setCouponError('This coupon has expired.');
      return;
    }

    dispatch(applyCouponAction(matchedCoupon));
  };

  const removeCoupon = () => {
    dispatch(removeCouponAction());
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Cost calculations
  const subtotal = checkoutData?.promotions?.subtotal || 0;
  const shipping = checkoutData?.promotions?.total_shipping || 0;
  const tax = checkoutData?.promotions?.total_tax || 0;

  const getDiscount = (coupon) => {
    if (!coupon) return 0;
    const val = parseFloat(coupon.discount_value);
    if (coupon.discount_type === 'percentage') {
      return (subtotal * val) / 100;
    }
    return Math.min(val, subtotal);
  };

  const discount = appliedCoupon ? getDiscount(appliedCoupon) : (checkoutData?.promotions?.total_discount || 0);
  const grandTotal = Math.max(0, subtotal + shipping + tax - discount);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      dispatch(showToast({ message: 'Please select a shipping address.', type: 'error' }));
      return;
    }
    if (!selectedPaymentMethod) {
      dispatch(showToast({ message: 'Please select a payment method.', type: 'error' }));
      return;
    }

    const payload = {
      shipping_address_id: selectedAddressId,
      payment_method: selectedPaymentMethod,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
    };

    try {
      const orderResponse = await dispatch(placeOrder({ payload, token })).unwrap();
      const placedOrder = orderResponse?.data || orderResponse?.order || orderResponse;

      if (!placedOrder) {
        throw new Error('No order details returned from server');
      }

      if (selectedPaymentMethod === 'razorpay') {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          dispatch(showToast({ message: 'Razorpay SDK failed to load. Please try again.', type: 'error' }));
          return;
        }

        const gateway = checkoutData.payment_gateways?.find((gw) => gw.slug === 'razorpay');

        const options = {
          key: gateway?.credentials?.api_key || 'rzp_test_SwjbMbNJY1a0WR',
          amount: Math.round(parseFloat(placedOrder.total_amount || grandTotal) * 100),
          currency: gateway?.currency || 'INR',
          name: 'Rekha Corporation',
          description: `Order ${placedOrder.order_number}`,
          order_id: placedOrder.gateway_order_id,
          handler: async function (paymentRes) {
            dispatch(showToast({ message: 'Payment successful! Order placed.', type: 'success' }));
            try {
              const itemsToClear = checkoutData?.cart?.items || [];
              await dispatch(clearCartFromServer(itemsToClear)).unwrap();
            } catch (err) {
              console.error("Failed to empty cart on backend:", err);
            }
            window.location.href = `/track-order/${placedOrder.order_number}?success=true`;
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#bf8a52',
          },
          modal: {
            ondismiss: function () {
              dispatch(showToast({ message: 'Payment cancelled. Order remains pending.', type: 'warning' }));
              window.location.href = '/userProfile?tab=orders';
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // COD or other offline methods
        dispatch(showToast({ message: 'Order placed successfully!', type: 'success' }));
        try {
          const itemsToClear = checkoutData?.cart?.items || [];
          await dispatch(clearCartFromServer(itemsToClear)).unwrap();
        } catch (err) {
          console.error("Failed to empty cart on backend:", err);
        }
        window.location.href = `/track-order/${placedOrder.order_number}?success=true`;
      }
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to place order.', type: 'error' }));
    }
  };

  if (checkoutLoading && !checkoutData) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f6f3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="spinner" size={40} style={{ color: '#d4a574', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '10px', fontSize: '16px', color: '#666' }}>Loading checkout details...</span>
      </main>
    );
  }

  if (checkoutError) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f6f3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <p style={{ color: '#dc3545', fontSize: '18px' }}>Error loading checkout: {checkoutError}</p>
        <Link href="/cart">
          <button style={applyBtnStyle}>Back to Cart</button>
        </Link>
      </main>
    );
  }

  const addresses = checkoutData?.addresses || [];
  const gateways = checkoutData?.payment_gateways || [];
  const cartItems = checkoutData?.cart?.items || [];

  return (
    <main style={{ minHeight: '100vh', background: '#f8f6f3', padding: '40px 0 60px' }}>
      <div className="container">
        <h1 className="display-6 fw-bold mb-4" style={{ color: '#1a1a1a' }}>Checkout</h1>

        <div className="row">
          {/* LEFT - Shipping & Payment */}
          <div className="col-lg-8">
            {/* Address Selection */}
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>📦</span> Select Shipping Address
                </h5>
                
                {addresses.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '8px' }}>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>No shipping addresses found.</p>
                    <Link href="/profile" style={{ color: '#bf8a52', fontWeight: 600 }}>Go to profile to add address</Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          style={{
                            border: isSelected ? '2px solid #bf8a52' : '1px solid #e5e1da',
                            borderRadius: '10px',
                            padding: '16px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#fffcf7' : '#fff',
                            transition: 'all 0.2s',
                            position: 'relative'
                          }}
                        >
                          {isSelected && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#bf8a52', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                          <p style={{ fontWeight: 700, margin: '0 0 6px 0', textTransform: 'capitalize' }}>
                            {addr.full_name} <span style={{ fontSize: '11px', fontWeight: 600, color: '#bf8a52', marginLeft: '6px', textTransform: 'uppercase' }}>({addr.address_type})</span>
                          </p>
                          <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                            {addr.street}, {addr.city} - {addr.postal_code}
                          </p>
                          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Phone: {addr.phone}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>💳</span> Select Payment Method
                </h5>

                {gateways.length === 0 ? (
                  <p style={{ color: '#888' }}>No payment methods available.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {gateways.map((gw) => {
                      const isSelected = selectedPaymentMethod === gw.slug;
                      return (
                        <div
                          key={gw.id}
                          onClick={() => setSelectedPaymentMethod(gw.slug)}
                          style={{
                            border: isSelected ? '2px solid #bf8a52' : '1px solid #e5e1da',
                            borderRadius: '10px',
                            padding: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: isSelected ? '#fffcf7' : '#fff',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? '5px solid #bf8a52' : '2px solid #e5e1da' }} />
                            <div>
                              <p style={{ fontWeight: 700, margin: 0 }}>{gw.name}</p>
                              {gw.slug === 'razorpay' && <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Pay securely using cards, UPI, or NetBanking</p>}
                              {gw.slug === 'cod' && <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Pay with cash upon delivery</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>🏷️</span> Apply Coupon
                </h5>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!appliedCoupon}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      fontFamily: 'monospace',
                      letterSpacing: '1.5px',
                      fontWeight: 700,
                      fontSize: '15px',
                      opacity: appliedCoupon ? 0.6 : 1,
                    }}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={removeBtnStyle}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyCoupon()}
                      style={applyBtnStyle}
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <div style={couponAlertError}>{couponError}</div>
                )}
                {couponSuccess && (
                  <div style={couponAlertSuccess}>✅ {couponSuccess}</div>
                )}

                {/* Available Coupons */}
                {!appliedCoupon && coupons.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Available Coupons
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {coupons.map((coupon) => {
                        const now = new Date();
                        const validFrom = new Date(coupon.valid_from);
                        const validUntil = new Date(coupon.valid_until);
                        const isActive = now >= validFrom && now <= validUntil;

                        return (
                          <div
                            key={coupon.id}
                            style={{
                              ...couponVoucherStyle,
                              opacity: isActive ? 1 : 0.5,
                              cursor: isActive ? 'pointer' : 'not-allowed',
                            }}
                            onClick={() => isActive && applyCoupon(coupon.code)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={couponLeftStyle}>
                                <span style={couponDiscountBadge}>
                                  {coupon.discount_type === 'percentage'
                                    ? `${coupon.discount_value}%`
                                    : `₹${parseFloat(coupon.discount_value).toFixed(0)}`}
                                </span>
                                <span style={{ fontSize: '10px', color: '#a88a5e', fontWeight: 600, textTransform: 'uppercase' }}>OFF</span>
                              </div>

                              <div style={couponDivider} />

                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                  <span style={couponCodeBadge}>{coupon.code}</span>
                                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{coupon.name}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 6px' }}>
                                  {coupon.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <span style={{ fontSize: '11px', color: '#aaa' }}>
                                    Valid: {formatDate(coupon.valid_from)} – {formatDate(coupon.valid_until)}
                                  </span>
                                  {isActive && (
                                    <span style={tapToApplyBadge}>TAP TO APPLY</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loadingCoupons && (
                  <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', marginTop: '14px' }}>Loading available coupons...</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="col-lg-4">
            <div className="card mb-4" style={{ ...cardStyle, position: 'sticky', top: '20px' }}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>🛒</span> Order Summary
                </h5>

                {cartItems.length === 0 && (
                  <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>Your cart is empty.</p>
                )}

                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                        {item.variant?.product?.name || 'Item'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '6px' }}>x{item.quantity}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                      ₹{parseFloat(item.variant?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Breakdown */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px dashed #e8e4dd' }}>
                  <div style={summaryRow}>
                    <span style={summaryLabel}>Subtotal</span>
                    <span style={summaryValue}>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ ...summaryRow, color: '#27ae60' }}>
                      <span style={{ ...summaryLabel, color: '#27ae60' }}>Discount</span>
                      <span style={{ ...summaryValue, color: '#27ae60' }}>- ₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  {shipping > 0 && (
                    <div style={summaryRow}>
                      <span style={summaryLabel}>Shipping</span>
                      <span style={summaryValue}>₹{shipping.toFixed(2)}</span>
                    </div>
                  )}

                  {tax > 0 && (
                    <div style={summaryRow}>
                      <span style={summaryLabel}>Tax</span>
                      <span style={summaryValue}>₹{tax.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ ...summaryRow, marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #1a1a1a' }}>
                    <span style={{ ...summaryLabel, fontSize: '17px', fontWeight: 700 }}>Total</span>
                    <span style={{ ...summaryValue, fontSize: '20px', fontWeight: 800, color: '#1a1a1a' }}>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={actionLoading || cartItems.length === 0}
              style={{
                ...placeOrderBtnStyle,
                opacity: (actionLoading || cartItems.length === 0) ? 0.6 : 1,
                cursor: (actionLoading || cartItems.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {actionLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============ Inline Style Constants ============ */

const cardStyle = {
  border: 'none',
  borderRadius: '14px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  background: '#fff',
};

const sectionTitleStyle = {
  fontSize: '17px',
  fontWeight: 700,
  color: '#1a1a1a',
  marginBottom: '22px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const iconCircleStyle = {
  fontSize: '20px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#555',
};

const inputStyle = {
  borderRadius: '8px',
  border: '1px solid #e5e1da',
  padding: '10px 14px',
  fontSize: '14px',
  background: '#fafaf8',
  transition: 'all 0.2s',
};

const applyBtnStyle = {
  background: 'linear-gradient(135deg, #d4a574, #bf8a52)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.25s',
  whiteSpace: 'nowrap',
};

const removeBtnStyle = {
  background: '#fff',
  color: '#e74c3c',
  border: '2px solid #e74c3c',
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const couponAlertError = {
  background: '#fef2f2',
  borderLeft: '4px solid #ef4444',
  color: '#b91c1c',
  padding: '10px 14px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
};

const couponAlertSuccess = {
  background: '#f0fdf4',
  borderLeft: '4px solid #22c55e',
  color: '#166534',
  padding: '10px 14px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
};

const couponVoucherStyle = {
  background: '#fffcf7',
  border: '1.5px dashed #e0d5c5',
  borderRadius: '12px',
  padding: '16px 18px',
  transition: 'all 0.25s',
};

const couponLeftStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '60px',
};

const couponDiscountBadge = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#bf8a52',
  lineHeight: 1,
};

const couponDivider = {
  width: '1px',
  alignSelf: 'stretch',
  background: 'repeating-linear-gradient(to bottom, #d4a574 0, #d4a574 4px, transparent 4px, transparent 8px)',
};

const couponCodeBadge = {
  background: '#f0e8dd',
  color: '#8b6914',
  padding: '2px 10px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontWeight: 700,
  fontSize: '13px',
  letterSpacing: '1px',
};

const tapToApplyBadge = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#bf8a52',
  background: '#fdf5eb',
  padding: '2px 8px',
  borderRadius: '4px',
  letterSpacing: '0.5px',
};

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const summaryLabel = {
  fontSize: '14px',
  color: '#777',
  fontWeight: 500,
};

const summaryValue = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#333',
};

const placeOrderBtnStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #d4a574, #bf8a52)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  boxShadow: '0 8px 24px rgba(212,165,116,0.3)',
};
