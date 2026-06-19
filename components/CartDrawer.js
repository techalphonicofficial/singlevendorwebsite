'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCartItem, updateCartItemQty, removeItem, increaseQuantity } from '../store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { getImageUrl } from '../store/apiConfig';
import { LuX as LuXIcon, LuPlus as LuPlusIcon, LuMinus as LuMinusIcon, LuShoppingBag as LuShoppingBagIcon } from 'react-icons/lu';

export default function CartDrawer({ isOpen, onClose }) {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalAmount = useSelector((state) => state.cart.totalAmount) || 0;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemoveItem = (item) => {
    if (isAuthenticated && item.cartItemId) {
      dispatch(deleteCartItem(item.cartItemId));
    } else {
      dispatch(removeItem({
        id: item.id,
        size: item.size
      }));
    }
  };

  const handleIncrease = (item) => {
    if (isAuthenticated && item.cartItemId) {
      dispatch(updateCartItemQty({
        cartItemId: item.cartItemId,
        variantId: item.variantId,
        currentQty: item.quantity,
        targetQty: item.quantity + 1
      }));
    } else {
      dispatch(increaseQuantity({
        id: item.id,
        size: item.size
      }));
    }
  };

  const handleDecrease = (item) => {
    if (isAuthenticated && item.cartItemId) {
      dispatch(updateCartItemQty({
        cartItemId: item.cartItemId,
        variantId: item.variantId,
        currentQty: item.quantity,
        targetQty: item.quantity - 1
      }));
    } else {
      dispatch(removeItem({
        id: item.id,
        size: item.size
      }));
    }
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`drawer-backdrop ${isOpen ? 'show' : ''}`} 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`side-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="d-flex align-items-center gap-2">
            <LuShoppingBagIcon size={20} className="text-warning" />
            <h5 className="fw-bold mb-0">My Cart</h5>
            <span className="badge bg-warning text-dark rounded-pill px-2" style={{ fontSize: '12px' }}>
              {totalQty}
            </span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <LuXIcon size={24} />
          </button>
        </div>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-drawer text-center py-5">
              <LuShoppingBagIcon size={48} className="text-muted mb-3" />
              <p className="fw-semibold text-muted">Your cart is empty.</p>
              <button 
                onClick={() => { onClose(); router.push('/shop'); }}
                className="btn btn-warning rounded-pill px-4 btn-sm mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="drawer-item-list">
              {cartItems.map((item) => (
                <div className="drawer-item" key={`${item.id}-${item.size}`}>
                  <img src={getImageUrl(item.image)} alt={item.name} className="item-img" />
                  <div className="item-details">
                    <h6 className="item-name">{item.name}</h6>
                    {item.size && (
                      <span className="badge bg-light text-dark border mb-2" style={{ fontSize: '10px' }}>
                        Size: {item.size}
                      </span>
                    )}
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <p className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>₹{item.price.toLocaleString()}</p>
                      
                      {/* Quantity Controls */}
                      <div className="drawer-qty-controls d-flex align-items-center border rounded-pill">
                        <button className="qty-btn" onClick={() => handleDecrease(item)} aria-label="Decrease quantity">
                          <LuMinusIcon size={12} />
                        </button>
                        <span className="qty-val px-2" style={{ fontSize: '12px', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button className="qty-btn" onClick={() => handleIncrease(item)} aria-label="Increase quantity">
                          <LuPlusIcon size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="item-remove" onClick={() => handleRemoveItem(item)} aria-label="Remove item">
                    <RiDeleteBin6Line size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold">Subtotal</span>
              <span className="fw-bold fs-5 text-dark">₹{totalAmount.toLocaleString()}</span>
            </div>
            <p className="text-muted text-center" style={{ fontSize: '11px' }}>
              Shipping and taxes calculated at checkout.
            </p>
            <div className="d-flex gap-2 mt-2">
              <button 
                onClick={() => { onClose(); router.push('/cart'); }} 
                className="btn btn-outline-dark w-100 rounded-pill py-2 fw-semibold"
                style={{ fontSize: '13px' }}
              >
                View Cart
              </button>
              <button 
                onClick={() => { onClose(); router.push('/checkout'); }} 
                className="btn btn-warning w-100 rounded-pill py-2 fw-semibold"
                style={{ fontSize: '13px' }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
