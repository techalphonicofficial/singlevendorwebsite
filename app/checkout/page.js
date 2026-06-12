'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCouponsApi } from '../../store/apiService';
import { applyCoupon as applyCouponAction, removeCoupon as removeCouponAction } from '../../store/slices/cartSlice';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  // Coupon states
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const token = useSelector((state) => state.auth.token);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Fetch coupons on mount
  useEffect(() => {
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
  }, [token]);

  // Sync applied coupon with Redux state
  useEffect(() => {
    if (appliedCoupon && coupons.length > 0) {
      setCouponCode(appliedCoupon.code);
      setCouponSuccess(`Coupon "${appliedCoupon.code}" applied! You save ₹${getDiscount(appliedCoupon).toFixed(2)}`);
      setCouponError('');
    } else if (!appliedCoupon) {
      setCouponCode('');
      setCouponSuccess('');
    }
  }, [appliedCoupon, coupons, totalAmount]);

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

  const getDiscount = (coupon) => {
    if (!coupon) return 0;
    const val = parseFloat(coupon.discount_value);
    if (coupon.discount_type === 'percentage') {
      return (totalAmount * val) / 100;
    }
    // fixed
    return Math.min(val, totalAmount);
  };

  const discount = appliedCoupon ? getDiscount(appliedCoupon) : 0;
  const grandTotal = Math.max(0, totalAmount - discount);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f8f6f3', padding: '40px 0 60px' }}>
      <div className="container">
        <h1 className="display-6 fw-bold mb-4" style={{ color: '#1a1a1a' }}>Checkout</h1>

        <div className="row">
          {/* LEFT - Shipping */}
          <div className="col-lg-8">
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>📦</span> Shipping Information
                </h5>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label" style={labelStyle}>First Name</label>
                      <input type="text" className="form-control" id="firstName" style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label" style={labelStyle}>Last Name</label>
                      <input type="text" className="form-control" id="lastName" style={inputStyle} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={labelStyle}>Email</label>
                    <input type="email" className="form-control" id="email" style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label" style={labelStyle}>Address</label>
                    <input type="text" className="form-control" id="address" style={inputStyle} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label" style={labelStyle}>City</label>
                      <input type="text" className="form-control" id="city" style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="zip" className="form-label" style={labelStyle}>ZIP Code</label>
                      <input type="text" className="form-control" id="zip" style={inputStyle} />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="card mb-4" style={cardStyle}>
              <div className="card-body" style={{ padding: '28px' }}>
                <h5 className="card-title" style={sectionTitleStyle}>
                  <span style={iconCircleStyle}>🏷️</span> Apply Coupon
                </h5>

                {/* Manual coupon input */}
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
                              {/* Left dashed divider */}
                              <div style={couponLeftStyle}>
                                <span style={couponDiscountBadge}>
                                  {coupon.discount_type === 'percentage'
                                    ? `${coupon.discount_value}%`
                                    : `₹${parseFloat(coupon.discount_value).toFixed(0)}`}
                                </span>
                                <span style={{ fontSize: '10px', color: '#a88a5e', fontWeight: 600, textTransform: 'uppercase' }}>OFF</span>
                              </div>

                              <div style={couponDivider} />

                              {/* Right info */}
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
                                  {!isActive && now < validFrom && (
                                    <span style={{ fontSize: '11px', color: '#e67e22', fontWeight: 600 }}>Upcoming</span>
                                  )}
                                  {!isActive && now > validUntil && (
                                    <span style={{ fontSize: '11px', color: '#e74c3c', fontWeight: 600 }}>Expired</span>
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
                  <div key={item.id + (item.size || '')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '6px' }}>x{item.quantity}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>₹{item.totalPrice?.toFixed(2)}</span>
                  </div>
                ))}

                {/* Breakdown */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px dashed #e8e4dd' }}>
                  <div style={summaryRow}>
                    <span style={summaryLabel}>Subtotal</span>
                    <span style={summaryValue}>₹{totalAmount.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div style={{ ...summaryRow, color: '#27ae60' }}>
                      <span style={{ ...summaryLabel, color: '#27ae60' }}>
                        Coupon ({appliedCoupon.code})
                      </span>
                      <span style={{ ...summaryValue, color: '#27ae60' }}>
                        - ₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div style={{ ...summaryRow, marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #1a1a1a' }}>
                    <span style={{ ...summaryLabel, fontSize: '17px', fontWeight: 700 }}>Total</span>
                    <span style={{ ...summaryValue, fontSize: '20px', fontWeight: 800, color: '#1a1a1a' }}>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <button style={placeOrderBtnStyle}>Place Order</button>
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
