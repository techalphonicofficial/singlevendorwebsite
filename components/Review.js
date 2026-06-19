import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import './userprofile.css';

const initialReviews = [
  {
    id: 1,
    productName: 'Premium Silk Kurta Set',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    date: 'May 10, 2026',
    rating: 5,
    title: 'Excellent Quality',
    reviewText: 'The fabric is absolutely amazing and fits perfectly. It looks extremely premium and is totally worth the price. Will buy again!',
  },
  {
    id: 2,
    productName: 'Classic Cotton Nehru Jacket',
    image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac044?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    date: 'April 22, 2026',
    rating: 4,
    title: 'Good but could be better',
    reviewText: 'Nice jacket, looks great on me. The inner lining could have been softer, but overall a solid purchase for weddings.',
  }
];

const StarRating = ({ rating, interactive = false, onRatingChange }) => {
  return (
    <div className={interactive ? "star-rating-input" : "review-stars-small"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          className={star <= rating ? "filled" : ""}
          onClick={() => interactive && onRatingChange(star)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Review = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    rating: 5,
    title: '',
    reviewText: '',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // default fallback
  });

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const handleEdit = (review) => {
    setFormData(review);
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({ 
      productName: '', 
      rating: 5, 
      title: '', 
      reviewText: '',
      image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac044?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' 
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setReviews(reviews.map(review => review.id === editingId ? { ...formData, id: editingId, date: review.date } : review));
    } else {
      const newReview = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      setReviews([newReview, ...reviews]);
    }
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  return (
    <div className="dashboard-card-premium">
      <div className="review-header-container">
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>My Reviews</h3>
        {!showForm && (
          <button className="btn-primary-custom" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={handleAddNew}>
            Write a Review
          </button>
        )}
      </div>

      {showForm ? (
        <div className="review-form-container">
          <h4 style={{ marginBottom: '24px', fontSize: '18px', color: '#1a1a1a' }}>
            {editingId ? 'Edit Your Review' : 'Share Your Experience'}
          </h4>
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group-full">
                <label className="address-label">Select Product</label>
                <input 
                  type="text" 
                  name="productName" 
                  className="address-input" 
                  value={formData.productName} 
                  onChange={handleChange} 
                  placeholder="e.g. Silk Kurta"
                  required 
                />
              </div>

              <div className="form-group-full">
                <label className="address-label">Your Rating</label>
                <StarRating rating={formData.rating} interactive={true} onRatingChange={handleRatingChange} />
              </div>

              <div className="form-group-full">
                <label className="address-label">Review Headline</label>
                <input 
                  type="text" 
                  name="title" 
                  className="address-input" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Summarize your experience"
                  required 
                />
              </div>

              <div className="form-group-full">
                <label className="address-label">Detailed Review</label>
                <textarea 
                  name="reviewText" 
                  className="address-input" 
                  value={formData.reviewText} 
                  onChange={handleChange} 
                  rows="5"
                  placeholder="What did you like or dislike about the product?"
                  required 
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary-custom" style={{ padding: '12px 30px', flex: 1 }}>
                  Submit Review
                </button>
                <button type="button" className="btn-secondary-custom" style={{ padding: '12px 30px', flex: 1, color: '#1a1a1a', borderColor: '#e5e5e5' }} onClick={handleCancelForm}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <div className="review-empty-state">
              <div className="review-empty-icon"><FiMessageSquare /></div>
              <h3 style={{ color: '#1a1a1a', margin: '0 0 10px 0' }}>No Reviews Yet</h3>
              <p style={{ color: '#666', margin: '0 0 20px 0' }}>Share your thoughts on products you've purchased.</p>
            </div>
          ) : (
            <div className="review-list-layout">
              {reviews.map((review) => (
                <div key={review.id} className="review-list-item">
                  <img src={review.image} alt={review.productName} className="review-product-image" />
                  
                  <div className="review-content-main">
                    <div className="review-top-row">
                      <div className="review-product-details">
                        <h4>{review.productName}</h4>
                        <span className="review-date-badge">Reviewed on {review.date}</span>
                      </div>
                    </div>
                    
                    <div className="review-rating-row">
                      <StarRating rating={review.rating} />
                    </div>
                    
                    <div className="review-title-text">{review.title}</div>
                    <p className="review-body-text">{review.reviewText}</p>
                    
                    <div className="review-action-icons">
                      <button className="btn-icon-action" onClick={() => handleEdit(review)}>
                        <FiEdit2 size={15}/> Edit
                      </button>
                      <button className="btn-icon-action delete" onClick={() => handleDelete(review.id)}>
                        <FiTrash2 size={15}/> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Review;