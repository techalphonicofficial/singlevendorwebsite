'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, fetchOrders, addReview, clearReviewError } from '../store/slices/reviewSlice';
import { showToast } from '../store/slices/toastSlice';

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const { reviews, orders, loading, reviewsLoading, reviewError, ordersLoading } = useSelector(state => state.reviews);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
  });
  const [formError, setFormError] = useState('');
  const [userHasPurchased, setUserHasPurchased] = useState(false);

  // Fetch reviews on component mount or when productId changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [productId, dispatch]);

  // Fetch orders to check if user has purchased this product
  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchOrders(token));
    }
  }, [isAuthenticated, token, dispatch]);

  // Check if user has purchased the product
  useEffect(() => {
    if (orders && orders.length > 0) {
      console.log('=== DEBUG: Orders Structure ===');
      console.log('Orders received:', orders);
      console.log('Looking for productId:', productId);
      
      const hasProduct = orders.some(order => {
        console.log('Checking order:', order);
        // Check if order has items array
        if (order.items && Array.isArray(order.items)) {
          const found = order.items.some(item => {
            console.log('Checking item:', item);
            // Match product_id, id, or variant.product_id
            return (
              item.product_id === productId || 
              item.id === productId ||
              item.product?.id === productId
            );
          });
          return found;
        }
        // Also check if order itself has product info
        if (order.product_id === productId) {
          return true;
        }
        return false;
      });
      
      console.log('User has purchased:', hasProduct);
      setUserHasPurchased(hasProduct);
    } else {
      console.log('No orders found');
      setUserHasPurchased(false);
    }
  }, [orders, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!isAuthenticated) {
      setFormError('Please log in to submit a review');
      dispatch(showToast({ message: 'Please log in to submit a review', type: 'error' }));
      return;
    }

    if (!userHasPurchased) {
      setFormError('You can only review products you have purchased');
      dispatch(showToast({ message: 'You can only review products you have purchased', type: 'error' }));
      return;
    }

    if (!formData.review.trim()) {
      setFormError('Please write a review');
      return;
    }

    if (formData.review.trim().length < 10) {
      setFormError('Review must be at least 10 characters long');
      return;
    }

    try {
      const payload = {
        product_id: productId,
        customer_id: user?.id,
        rating: formData.rating,
        review: formData.review,
      };

      await dispatch(addReview({ payload, token })).unwrap();
      
      setFormData({
        rating: 5,
        review: '',
      });
      setShowReviewForm(false);
      dispatch(showToast({ message: 'Review submitted successfully!', type: 'success' }));
    } catch (error) {
      setFormError(error || 'Failed to submit review');
      dispatch(showToast({ message: error || 'Failed to submit review', type: 'error' }));
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange) => {
    return (
      <div className="star-rating" style={{ display: 'flex', gap: '5px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => interactive && onRatingChange(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '24px',
              color: star <= rating ? '#d4a574' : '#ddd',
              transition: 'color 0.2s',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  return (
    <div className="product-reviews-section" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e5e5e5' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Customer Reviews</h3>

      {/* Review Summary */}
      {reviews.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}>
          {/* Average Rating */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#d4a574', marginBottom: '10px' }}>
              {averageRating}
            </div>
            {renderStars(Math.round(averageRating))}
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ width: '50px', fontSize: '14px' }}>{rating} ★</span>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#ddd',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: '#d4a574',
                    width: `${(ratingDistribution[rating] / reviews.length) * 100}%`,
                  }} />
                </div>
                <span style={{ width: '30px', textAlign: 'right', fontSize: '14px', color: '#666' }}>
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Review Button / Form */}
      {isAuthenticated ? (
        <div style={{ marginBottom: '40px' }}>
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#d4a574',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c9965a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#d4a574'}
            >
              Write a Review
            </button>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #e5e5e5',
            }}>
              {!userHasPurchased && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fff3cd',
                  borderLeft: '4px solid #ffc107',
                  marginBottom: '20px',
                  borderRadius: '4px',
                }}>
                  <p style={{ margin: '0', color: '#856404', fontSize: '14px' }}>
                    ⚠️ You can only review products you have purchased. Please buy this product first.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
                    Rating *
                  </label>
                  {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
                    Your Review *
                  </label>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    placeholder="Share your experience with this product..."
                    rows="5"
                    disabled={!userHasPurchased || loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '14px',
                      resize: 'vertical',
                      opacity: !userHasPurchased ? 0.5 : 1,
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {formData.review.length}/500 characters
                  </p>
                </div>

                {formError && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8d7da',
                    borderLeft: '4px solid #dc3545',
                    marginBottom: '20px',
                    borderRadius: '4px',
                  }}>
                    <p style={{ margin: '0', color: '#721c24', fontSize: '14px' }}>{formError}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={!userHasPurchased || loading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: userHasPurchased && !loading ? '#d4a574' : '#ddd',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: userHasPurchased && !loading ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setFormError('');
                      dispatch(clearReviewError());
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#e5e5e5',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0', color: '#004085', fontSize: '14px' }}>
            <strong>Please log in</strong> to write a review for this product.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
          {approvedReviews.length} {approvedReviews.length === 1 ? 'Review' : 'Reviews'}
        </h4>

        {reviewsLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner-border" style={{ color: '#d4a574' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!reviewsLoading && approvedReviews.length === 0 && (
          <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {!reviewsLoading && approvedReviews.length > 0 && (
          <div>
            {approvedReviews.map(review => (
              <div
                key={review.id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #e5e5e5',
                  marginBottom: '15px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600' }}>
                      {review.customer?.name || 'Anonymous'}
                    </h5>
                    <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
