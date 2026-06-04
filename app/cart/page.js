'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {removeItem,clearCart,increaseQuantity, fetchCart, deleteCartItem, updateCartItemQty} from '../../store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { LuShoppingBag } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getImageUrl } from '../../store/apiConfig';


export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch cart data from API on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

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

  const handleClearCart = () => {
    if (isAuthenticated) {
      cartItems.forEach(item => {
        if (item.cartItemId) {
          dispatch(deleteCartItem(item.cartItemId));
        }
      });
    } else {
      dispatch(clearCart());
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

  return (

    <main className="cart-page py-4 py-lg-5">

      <div className="container">

        {/* Top Heading */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">
              Shopping Cart
            </h1>
            <p className="text-muted small mb-0">
              Review your selected items
            </p>
          </div>
          <div className="cart-count">
            {cartItems.length} Items
          </div>
        </div>
        {cartItems.length === 0 ? (

          <div className=" text-center ">

            <div className="empty-icon mx-auto mb-4">
              <LuShoppingBag size={55} />
            </div>

            <h3 className="fw-bold mb-3">
              Your Cart is Empty
            </h3>

            <p className="text-muted mb-4">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              href="/shop"
              className="btn btn-warning rounded-pill px-4 py-2 mt-3"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="row g-4">

            {/* Left Side */}

            <div className="col-lg-8">

              {cartItems.map((item) => (

                <div
                  key={`${item.id}-${item.size}`}
                  className="cart-card mb-3"
                >

                  <div className="row align-items-center g-0">

                    {/* Image */}

                    <div className="col-md-3 col-4">

                      <div className="cart-image-wrapper">

                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="cart-image"
                          onClick={()=>router.push(`/shop/${item.slug || item.id}`)}
                        />

                      </div>

                    </div>

                    {/* Content */}

                    <div className="col-md-9 col-8">

                      <div className="cart-content">

                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

                          {/* Left Content */}

                          <div className="flex-grow-1">

                            <h5 className="cart-title">
                              {item.name}
                            </h5>

                            <p className="cart-desc mb-2">
                              Premium festive collection
                            </p>

                            <div className="d-flex align-items-center flex-wrap gap-3 mb-3">

                              <div className="cart-badge">
                                Size : {item.size}
                              </div>

                              <div className="qty-box">

                                <button
                                  onClick={() => handleDecrease(item)}
                                >
                                  -
                                </button>

                                <span>
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() => handleIncrease(item)}
                                >
                                  +
                                </button>

                              </div>

                            </div>

                            <div className="d-flex align-items-center gap-2 flex-wrap">

                              <h5 className="cart-price mb-0">
                                ₹{item.totalPrice.toLocaleString()}
                              </h5>

                              <span className="original-price">
                                ₹{(item.price + 800).toLocaleString()}
                              </span>

                              <span className="offer-text">
                                40% OFF
                              </span>

                            </div>

                          </div>

                          {/* Right Buttons */}

                          <div className="d-flex flex-column align-items-end gap-2">

                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveItem(item)}
                            >

                              <RiDeleteBin6Line />

                              Remove

                            </button>

                            {/* <button className="wishlist-btn">
                              Wishlist
                            </button> */}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

              <button
                className="clear-cart-btn mt-2"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>

            </div>

            {/* Right Side */}

            <div className="col-lg-4">

              <div className="summary-card">

                <h5 className="fw-bold mb-4">
                  Price Details
                </h5>

                <div className="summary-row">

                  <span>
                    Price ({cartItems.length} items)
                  </span>

                  <span>
                    ₹{totalAmount.toLocaleString()}
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Discount
                  </span>

                  <span className="text-success">
                    - ₹500
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Delivery Charges
                  </span>

                  <span className="text-success">
                    FREE
                  </span>

                </div>

                <hr />

                <div className="summary-total">

                  <span>Total Amount</span>

                  <span>
                    ₹{totalAmount.toLocaleString()}
                  </span>

                </div>

                <Link
                  href="/checkout"
                  className="checkout-btn"
                >
                  Proceed To Checkout
                </Link>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>

  );
}
