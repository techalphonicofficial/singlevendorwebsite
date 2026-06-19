'use client';

import Wishlist from '../../components/Wishlist';
import { useSelector } from 'react-redux';



export default function WishlistPage() {

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">
          My Wishlist
        </h1>

        <span className="text-muted">
          {wishlistItems.length} Items
        </span>
      </div>

      <Wishlist />
    </div>
  );
}