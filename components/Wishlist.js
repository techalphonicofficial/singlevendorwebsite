import React from 'react'
import { FaHeartBroken } from "react-icons/fa";
import Link from 'next/link';
import { getImageUrl } from '../store/apiConfig';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, fetchWishlist } from '../store/slices/wishList';
import { showToast } from '../store/slices/toastSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.wishlist);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveItem = async (id) => {
    try {
      await dispatch(removeFromWishlist(id)).unwrap();
      dispatch(showToast({ message: 'Item removed from wishlist', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Failed to remove item', type: 'error' }));
    }
  };

  return (
    <div>
      {loading && (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading wishlist...</span>
          </div>
          <p className="mt-2 text-muted">Fetching your wishlist...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-warning my-4" role="alert">
          Unable to load wishlist: {error}
        </div>
      )}

      {!loading && !error && wishlistItems.length === 0 ? (

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

      ) : !loading && !error ? (

        <div className="row g-4">

          {wishlistItems.map((item) => (

            <div
              key={item.id}
              className="col-sm-6 col-lg-3"
            >

              <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">

                <div className="position-relative">

                  <img
                    src={getImageUrl(item.image)}
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
                      href={`/shop/${item.slug || item.id}`}
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

      ) : null}
    </div>
  )
}

export default Wishlist
