'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishList';
import { useRouter } from 'next/navigation';
import { LuHeart, LuX } from 'react-icons/lu';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { getImageUrl } from '../store/apiConfig';

export default function WishlistDrawer({ isOpen, onClose }) {
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemoveItem = (id) => {
    if (isAuthenticated) {
      dispatch(removeFromWishlist(id));
    }
  };

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
            <LuHeart size={20} className="text-danger" style={{ fill: '#dc3545', stroke: '#dc3545' }} />
            <h5 className="fw-bold mb-0">My Wishlist</h5>
            <span className="badge bg-warning text-dark rounded-pill px-2" style={{ fontSize: '12px' }}>
              {wishlistItems.length}
            </span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close wishlist">
            <LuX size={24} />
          </button>
        </div>

        <div className="drawer-body">
          {wishlistItems.length === 0 ? (
            <div className="empty-drawer text-center py-5">
              <LuHeart size={48} className="text-muted mb-3" />
              <p className="fw-semibold text-muted">Your wishlist is empty.</p>
              <button 
                onClick={() => { onClose(); router.push('/shop'); }}
                className="btn btn-warning rounded-pill px-4 btn-sm mt-2"
              >
                Explore Styles
              </button>
            </div>
          ) : (
            <div className="drawer-item-list">
              {wishlistItems.map((item) => (
                <div className="drawer-item" key={item.id}>
                  <img src={getImageUrl(item.image)} alt={item.name} className="item-img" />
                  <div className="item-details">
                    <h6 className="item-name">{item.name}</h6>
                    <p className="fw-bold text-dark mb-3" style={{ fontSize: '14px' }}>₹{item.price.toLocaleString()}</p>
                    <button 
                      onClick={() => { onClose(); router.push(`/shop/${item.slug || item.id}`); }}
                      className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1"
                      style={{ fontSize: '11px', fontWeight: '600' }}
                    >
                      Select Size
                    </button>
                  </div>
                  <button className="item-remove" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                    <RiDeleteBin6Line size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
