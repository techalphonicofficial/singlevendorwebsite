import React from 'react'
import { FaHeartBroken } from "react-icons/fa";
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishList';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];

  const handleRemoveItem = (id) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div>
      {wishlistItems.length === 0 ? (

        <div className="text-center py-5 my-5">

         <div className='empty-icon mx-auto mb-4 '>
           <FaHeartBroken
            size={55}
          />
         </div>

          <h2 className="fw-bold mb-3">
            Your Wishlist is Empty
          </h2>

          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "450px" }}
          >
            Save your favorite ethnic styles here and
            revisit them anytime.
          </p>

          <Link
            href="/shop"
            className="btn btn-warning rounded-pill px-4 py-2 mt-3"
          >
            Explore Collection
          </Link>

        </div>

      ) : (

        <div className="row g-4">

          {wishlistItems.map((item) => (

            <div
              key={item.id}
              className="col-sm-6 col-lg-3"
            >

              <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">

                <div className="position-relative">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{
                      height: "320px",
                      objectFit: "cover",
                      objectPosition: "top"
                    }}
                  />

                  <button
                    className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    ❤️
                  </button>

                </div>

                <div className="card-body">

                  <h5 className="fw-semibold">
                    {item.name}
                  </h5>

                  <p className="text-muted mb-2">
                    Premium festive wear
                  </p>

                  <div className="d-flex justify-content-between align-items-center">

                    <p className="fw-bold fs-5 mb-0">
                      ₹{item.price.toLocaleString()}
                    </p>

                    <Link
                      href={`/shop/${item.id}`}
                      className="btn btn-outline-warning btn-sm rounded-pill"
                    >
                      View
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}
    </div>
  )
}

export default Wishlist
