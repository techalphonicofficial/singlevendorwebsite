'use client';

import Link from 'next/link';
import '../../../components/shopage.css';
import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../store/slices/wishList';
import { setSelectedSize } from '../../../store/slices/sizeSlice';
import { showToast } from '../../../store/slices/toastSlice';
import useFancybox from '../../../hook/useFancyBox';
import { FiZoomIn, FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const allProducts = [
  {
    id: 1,
    name: 'Regal Brocade Sherwani',
    category: 'Sherwanis',
    price: 32999,
    originalPrice: 39999,
    rating: 4.8,
    reviews: 24,
    description: 'A majestic brocade sherwani crafted from premium silk with intricate gold embroidery. Perfect for weddings and formal occasions, featuring traditional motifs and modern tailoring.',
    fabric: 'Premium Silk Brocade',
    care: 'Dry clean only',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Maroon with Gold',
    availability: 'In Stock',
    img: "/DAJ_4613.jpg"
  },
  {
    id: 2,
    name: 'Embroidered Kurta Set',
    category: 'Kurta Sets',
    price: 14499,
    originalPrice: 17999,
    rating: 4.6,
    reviews: 18,
    description: 'Elegant kurta set with hand-embroidered details and matching churidar. Ideal for festivals and family gatherings, combining tradition with contemporary comfort.',
    fabric: 'Cotton Silk Blend',
    care: 'Machine wash gentle',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Cream with Gold Embroidery',
    availability: 'In Stock',
    img: "/DAJ_4661.jpg"
  },
  {
    id: 3,
    name: 'Velvet Nehru Jacket',
    category: 'Indo-Western',
    price: 11999,
    originalPrice: 14999,
    rating: 4.4,
    reviews: 15,
    description: 'Luxurious velvet Nehru jacket with subtle embroidery. Perfect fusion wear for modern grooms and contemporary celebrations.',
    fabric: 'Velvet with Silk Lining',
    care: 'Dry clean only',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Navy Blue',
    availability: 'In Stock',
    img: "/DAJ_4366.jpg"
  },
  {
    id: 4,
    name: 'Silk Juttis',
    category: 'Accessories',
    price: 2299,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 32,
    description: 'Handcrafted silk juttis with intricate embroidery and comfortable sole. Traditional footwear that complements any ethnic ensemble.',
    fabric: 'Silk with Leather Sole',
    care: 'Wipe with damp cloth',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Gold with White Embroidery',
    availability: 'In Stock',
    img: "/DAJ_4291.jpg"
  },
  {
    id: 5,
    name: 'Festive Bandhgala',
    category: 'Indo-Western',
    price: 18499,
    originalPrice: 22999,
    rating: 4.5,
    reviews: 12,
    description: 'Classic bandhgala suit with modern cuts and premium fabric. Ideal for weddings and formal events with a contemporary twist.',
    fabric: 'Wool Blend',
    care: 'Dry clean only',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Charcoal Gray',
    availability: 'In Stock',
    img: "/DAJ_4366.jpg"
  },
  {
    id: 6,
    name: 'Cotton Pathani Set',
    category: 'Kurta Sets',
    price: 9299,
    originalPrice: 11999,
    rating: 4.3,
    reviews: 28,
    description: 'Comfortable cotton pathani kurta with pyjama set. Perfect for daily wear and casual festive occasions with traditional appeal.',
    fabric: '100% Cotton',
    care: 'Machine wash',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'White with Blue Accents',
    availability: 'In Stock',
    img: "/DAJ_4661.jpg"
  },
  {
    id: 7,
    name: 'Classic Sherwani',
    category: 'Sherwanis',
    price: 26999,
    originalPrice: 32999,
    rating: 4.9,
    reviews: 19,
    description: 'Timeless sherwani design with subtle embroidery and premium finish. A wardrobe essential for traditional ceremonies and formal events.',
    fabric: 'Raw Silk',
    care: 'Dry clean only',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Cream with Gold Thread',
    availability: 'In Stock',
    img: "/DAJ_4613.jpg"
  },
  {
    id: 8,
    name: 'Groom Accessory Box',
    category: 'Accessories',
    price: 4999,
    originalPrice: 6999,
    rating: 4.2,
    reviews: 41,
    description: 'Complete groom accessory set including sehra, dupatta, and traditional items. Everything needed to complete the perfect wedding look.',
    fabric: 'Mixed Fabrics',
    care: 'As per individual items',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Assorted Traditional Colors',
    availability: 'In Stock',
    img: "/DAJ_4291.jpg"
  }
];

const customerReviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    title: 'A wedding look that stole the show',
    rating: 5,
    date: '2024-01-15',
    review: 'Absolutely stunning sherwani! The craftsmanship is exceptional and it fit perfectly. Wore it for my wedding and received countless compliments.',
    verified: true
  },
  {
    id: 2,
    name: 'Priya Sharma',
    title: 'Rich embroidery and comfortable fabric',
    rating: 4,
    date: '2024-01-10',
    review: 'Beautiful kurta set with great embroidery work. The fabric is comfortable and the color is exactly as shown. Would definitely recommend!',
    verified: true
  },
  {
    id: 3,
    name: 'Amit Patel',
    title: 'Premium finish with quick delivery',
    rating: 5,
    date: '2024-01-08',
    review: 'Premium quality and excellent service. The Nehru jacket exceeded my expectations. Fast delivery and perfect packaging.',
    verified: true
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    title: 'Super comfortable and elegant',
    rating: 4,
    date: '2024-01-05',
    review: 'Love the juttis! Very comfortable and the embroidery is detailed. Perfect for festive occasions. Great value for money.',
    verified: true
  },
  {
    id: 5,
    name: 'Vikram Singh',
    title: 'Classic fit with premium material',
    rating: 5,
    date: '2024-01-03',
    review: 'Outstanding bandhgala suit. The fit is perfect and the material is top-notch. Manyavar never disappoints with their quality.',
    verified: true
  }
];

const allProductsDetails = [
  {
    id: 1,
    name: "Regal Brocade Sherwani",

    images: [
      "/DAJ_4613.jpg",
      "/DAJ_4613.jpg",
      "/DAJ_4661.jpg",
      "/DAJ_4613.jpg",
    ],
  },

  {
    id: 2,
    name: "Embroidered Kurta Set",

    images: [
      "/DAJ_4613.jpg",
      "/DAJ_4661.jpg",
      "/DAJ_4661.jpg",
      "/DAJ_4661.jpg",
    ],
  },

  {
    id: 3,
    name: "Velvet Nehru Jacket",

    images: [
      "/DAJ_4291.jpg",
      "/DAJ_4366.jpg",
      "/DAJ_4366.jpg",
      "/DAJ_4366.jpg",
    ],
  },
  {
    id: 4,
    name: "Silk Juttis",

    images: [
      "/DAJ_4366.jpg",
      "/DAJ_4291.jpg",
      "/DAJ_4291.jpg",
      "/DAJ_4291.jpg",
    ],
  },
  {
    id: 5,
    name: "Festive Bandhgala",

    images: [
      "/DAJ_4661.jpg",
      "/DAJ_4366.jpg",
      "/DAJ_4366.jpg",
      "/DAJ_4366.jpg",
    ],
  },
  {
    id: 6,
    name: "Cotton Pathani Set",

    images: [
      "/DAJ_4366.jpg",
      "/DAJ_4661.jpg",
      "/DAJ_4661.jpg",
      "/DAJ_4661.jpg",
    ],
  },
  {
    id: 7,
    name: "Classic Sherwani",

    images: [
      "/DAJ_4291.jpg",
      "/DAJ_4613.jpg",
      "/DAJ_4613.jpg",
      "/DAJ_4613.jpg",
    ],
  },
  {
    id: 8,
    name: "Groom Accessory Box",

    images: [
      "/DAJ_4613.jpg",
      "/DAJ_4291.jpg",
      "/DAJ_4291.jpg",
      "/DAJ_4291.jpg",
    ],
  },
];

function renderStars(value) {
  const filled = Math.round(value);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState({});
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [reviews, setReviews] = useState(customerReviews);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    title: '',
    rating: 5,
    description: '',
  });
  const [formError, setFormError] = useState('');

  const router = useRouter();

  const openSizeSelector = () => setShowSizeSelector(true);
  const [fancyboxRef] = useFancybox({
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ["close"],
      },
    },
  });

  const product = allProducts.find(p => p.id === productId);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const selectedSizes = useSelector((state) => state.sizes.selectedSizes);
  const thumbnails = allProductsDetails.find(p => p.id === product.id)


  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const isInCart = cartItems.some(
    (item) => item.id === product.id &&
      item.size === selectedSizes[product.id]

  );
  const isInWish = wishlistItems.some(
    (item) => item.id === product.id
  )

  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id )
    .slice(0, 4);


  const handleQuickAdd = (item) => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.img,
      quantity: 1,
      size: item.sizes?.[0] || 'M',
    }));
    dispatch(showToast({
      message: `${item.name} added to cart`,
      type: 'success',
    }));
  };



  const getRelatedImage = (item) => {
    const relatedDetail = allProductsDetails.find((detail) => detail.id === item.id);
    return relatedDetail?.images?.[1] || item.img;
  };

  const relatedIsInWish = (itemId) => wishlistItems.some((item) => item.id === itemId);

  const handleAddToCart = () => {
    const selectedSize = selectedSizes[product.id];

    if (!selectedSize) {
      setSizeError({
        ...sizeError,
        [product.id]: true
      });
      setShowSizeSelector(true);
      return;
    }
    setSizeError({
      ...sizeError,
      [product.id]: false
    });
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img,
      quantity: quantity,
      size: selectedSize
    }));

    dispatch(showToast({
      message: 'Item added to cart 🛒',
      type: 'success',
    }));
  };

  const handleLiked = (product) => {
    if (isInWish) {
      dispatch(removeFromWishlist(product.id));
      dispatch(showToast({
        message: 'Item removed from wishlist',
        type: 'info',
      }));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.img,
      }));
      dispatch(showToast({
        message: 'Item added to wishlist ❤️',
        type: 'success',
      }));
    }
  };


  const handleWishlistToggle = (product) => {
    const alreadywishlist = wishlistItems.some(
    (item) => item.id === product.id)
    if (alreadywishlist) {
      dispatch(removeFromWishlist(product.id));
      dispatch(showToast({
        message: 'Item removed from wishlist',
        type: 'info',
      }));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.img,
      }));
      dispatch(showToast({
        message: 'Item added to wishlist ❤️',
        type: 'success',
      }));
    }
  }
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const totalReviews = reviews.length;
  const averageRating = totalReviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const verifiedReviews = reviews.filter((review) => review.verified).length;
  const ratingSummary = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const trimmedName = newReview.name.trim();
    const trimmedTitle = newReview.title.trim();
    const trimmedDescription = newReview.description.trim();

    if (!trimmedName || !trimmedTitle || !trimmedDescription) {
      setFormError('Please complete all fields before submitting your review.');
      return;
    }

    const reviewEntry = {
      id: Date.now(),
      name: trimmedName,
      title: trimmedTitle,
      rating: Number(newReview.rating),
      date: new Date().toISOString(),
      review: trimmedDescription,
      verified: true,
    };

    setReviews([reviewEntry, ...reviews]);
    setNewReview({ name: '', title: '', rating: 5, description: '' });
    setFormError('');
    setReviewFormOpen(false);
  };

  return (
    <main className="py-5 m-0 p-0">
      <div className="container ">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/shop">Shop</Link></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Product Images */}
          <div className="col-lg-7">
            <div className="row g-3">
              <div className="col-12">
                <div ref={fancyboxRef}>

                  <div className="product-main-image position-relative">
                    <a
                      href={thumbnails.images[selectedImage]}
                      data-fancybox="gallery">
                      <img
                        src={thumbnails.images[selectedImage]}
                        alt={product.name}
                        className="img-fluid rounded object-contain zoom-image" />
                    </a>

                    <button className="preview-btn">
                      <FiZoomIn />
                    </button>

                  </div>



                </div>

                <div className="d-flex gap-3 flex-wrap mt-3">

                  {thumbnails.images.map((thumbnail, index) => (

                    <div
                      key={index}
                      className="border rounded overflow-hidden"
                      style={{
                        width: "100px",
                        height: "120px",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={thumbnail}
                        alt="thumbnail"
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>

                  ))}

                </div>
              </div>
              {/* <div className="col-12">
                <div className="d-flex gap-2 overflow-auto">
                  {product.img.map((image, index) => (
                    <button
                      key={index}
                      className={`btn p-0 border-0 ${selectedImage === index ? 'opacity-100' : 'opacity-50'}`}
                      onClick={() => setSelectedImage(index)}
                      style={{ flexShrink: 0 }}
                    >
                      <img
                        src={createPlaceholderImage(image, 120, 80)}
                        alt={`${product.name} ${index + 1}`}
                        className="rounded"
                        style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-5">
            <div className="product-info">
              <h1 className="display-6 fw-bold mb-2">{product.name}</h1>
              <p className="text-muted mb-3">{product.category}</p>

              <div className="d-flex align-items-center mb-3">
                <span className="me-2" style={{ color: '#d4a574', fontSize: '20px' }}>
                  {renderStars(product.rating)}
                </span>
                <span className="text-muted">({product.reviews} reviews)</span>
              </div>

              <div className="price-section mb-4">
                <span className="h3 fw-bold me-2" style={{ color: '#d4a574' }}>
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-muted text-decoration-line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="badge bg-success ms-2">{discount}% OFF</span>
                  </>
                )}
              </div>

              <p className="mb-4">{product.description}</p>
              {/* Quantity and Add to Cart */}
              {/* Quantity */}
              {/* Sizes */}
              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
                  onClick={openSizeSelector}
                >
                  <FiShoppingCart />
                  Select Size
                </button>

                <div className={`size-selector-panel ${showSizeSelector ? 'open' : ''}`}>
                  <label className="form-label fw-semibold mb-3">
                    Select Size
                  </label>

                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`btn rounded-pill px-4 ${selectedSizes[product.id] === size
                          ? 'btn-dark'
                          : 'btn-outline-secondary'
                          }`}
                        onClick={() =>
                          dispatch(setSelectedSize({
                            productId: product.id,
                            size
                          }))
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {sizeError[product.id] && (
                    <p className="text-danger mt-2">Please choose a size before adding to cart.</p>
                  )}
                </div>
              </div>

              {/* Add To Cart */}
              {isInCart ?
                (

                  <button
                    className="btn btn-dark w-100 mb-3 py-2 rounded-pill"
                    disabled
                  >
                    Already in Cart
                  </button>

                ) : (

                  <button
                    className="btn w-100 mb-3 py-2 rounded-pill fw-semibold"
                    style={{
                      backgroundColor: '#d4a574',
                      color: 'white',
                      border: 'none'
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart • ₹{(product.price * quantity).toLocaleString()}
                  </button>

                )}

              <div className="row g-2">

                <div className="col-6">
                  <Link
                    href="/cart"
                    className="btn btn-outline-dark w-100 rounded-pill"
                  >
                    View Cart
                  </Link>
                </div>

                <div className="col-6">

                  <button
                    className={`btn w-100 rounded-pill ${isInWish ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => handleLiked(product)}
                  >
                    {isInWish ? 'Remove Wishlist' : 'Add Wishlist'}
                  </button>

                </div>

              </div>

              {/* Product Details */}
              <div className="product-details my-4">
                <h5 className="mb-3">Product Details</h5>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <strong>Fabric:</strong> {product.fabric}
                  </div>
                  <div className="col-sm-6">
                    <strong>Care:</strong> {product.care}
                  </div>
                  <div className="col-sm-6">
                    <strong>Size:</strong> {product.size}
                  </div>
                  <div className="col-sm-6">
                    <strong>Color:</strong> {product.color}
                  </div>
                  <div className="col-sm-6">
                    <strong>Availability:</strong> <span style={{ color: '#28a745' }}>{product.availability}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}

            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="review-hub">
              <div className="review-summary-card p-4 mb-4 rounded-4 shadow-sm">
                <div className="review-summary-grid">
                  <div className="summary-main">
                    <div className="summary-score">
                      <span className="avg-rating">{averageRating.toFixed(1)}</span>
                      <span className="avg-star">★</span>
                    </div>
                    <div>
                      <div className="summary-text">Average Rating</div>
                      <div className="summary-meta">{totalReviews.toLocaleString()} reviews · {verifiedReviews.toLocaleString()} verified buyers</div>
                    </div>
                  </div>

                  <div className="summary-distribution">
                    {ratingSummary.map(({ star, count }) => (
                      <div key={star} className="distribution-row">
                        <div className="distribution-label">
                          <span>{star}</span>
                          <span>★</span>
                        </div>
                        <div className="distribution-bar">
                          <div
                            className="distribution-fill"
                            style={{ width: `${totalReviews ? (count / totalReviews) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="distribution-value">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-action-row mt-4">
                  <p className="mb-0 text-muted">Share your experience and help other shoppers choose the perfect style.</p>
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill review-toggle-btn"
                    onClick={() => setReviewFormOpen((state) => !state)}
                  >
                    {reviewFormOpen ? 'Close Review Form' : 'Write a Review'}
                  </button>
                </div>
              </div>

              {reviewFormOpen && (
                <form className="review-form card rounded-4 p-4 mb-4" onSubmit={handleReviewSubmit}>
                  <div className="d-flex flex-column gap-3">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Your Name</label>
                        <input
                          type="text"
                          className="form-control review-input"
                          value={newReview.name}
                          onChange={(event) => setNewReview({ ...newReview, name: event.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Review Title</label>
                        <input
                          type="text"
                          className="form-control review-input"
                          value={newReview.title}
                          onChange={(event) => setNewReview({ ...newReview, title: event.target.value })}
                          placeholder="Summarize your review"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Rating</label>
                        <select
                          className="form-select review-input"
                          value={newReview.rating}
                          onChange={(event) => setNewReview({ ...newReview, rating: event.target.value })}
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-semibold">Review</label>
                      <textarea
                        className="form-control review-input"
                        rows={5}
                        value={newReview.description}
                        onChange={(event) => setNewReview({ ...newReview, description: event.target.value })}
                        placeholder="Share what you loved about the product"
                      />
                    </div>

                    {formError && <div className="form-text text-danger">{formError}</div>}

                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                      <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setReviewFormOpen(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary rounded-pill px-4">
                        Submit Review
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="review-feed">
                {reviews.map((review) => (
                  <article key={review.id} className="review-card rounded-4 p-4 mb-4 shadow-sm">
                    <div className="review-card-header d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start">
                      <div>
                        <h5 className="review-title mb-1">{review.title}</h5>
                        <div className="review-meta d-flex flex-wrap gap-2 align-items-center">
                          <span className="review-author">{review.name}</span>
                          <span className="review-badge badge bg-soft-success text-success">Verified Purchase</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="review-stars">{renderStars(review.rating)}</div>
                        <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-secondary review-body">{review.review}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* related product section */}

        <div className="row mt-5">
          <div className="col-12">
            <div className="related-products-section">
              <div className="section-title d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                  <small className="text-uppercase text-muted letter-spacing">Complete the look</small>
                  <h3 className="mb-1">Related Products</h3>
                </div>
              </div>

              <div className="row g-3">
                {relatedProducts.map((item) => {
                  const isInWish = wishlistItems.some(
                    (wishItem) => wishItem.id === item.id)

                  return (
                    <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                      <div className="product-card related-card  overflow-hidden shadow-sm bg-white position-relative ">
                        <div className="product-image-box related-image-wrap position-relative overflow-hidden "
                        // onClick={()=>router.push(`/shop/${item.id}`)}
                        >
                          <img src={item.img} alt={item.name} className="related-image primary" />
                          <img src={getRelatedImage(item)} alt={`${item.name} hover`} className="product-image related-image secondary" />
                          <div className="hover-actions">
                            <button
                              type="button"
                              className={`btn btn-sm rounded-circle`}
                              onClick={() => handleWishlistToggle(item)}
                              aria-label="Toggle wishlist"
                            >
                              {isInWish
                                ? <FaHeart className="text-danger" />
                                : <FaRegHeart />
                              }
                            </button>
                          </div>
                        </div>
                        <div className="product-content p-3 text-center">
                          <h3>{item.name}</h3>
                          <div className="product-rating mb-2">{renderStars(item.rating)}</div>
                          <p className="text-muted mb-2">{item.category}</p>
                          <p className="mb-2 fw-bold">₹{item.price.toLocaleString()}</p>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <span className="text-muted text-decoration-line-through">₹{item.originalPrice.toLocaleString()}</span>
                            <span className="text-success">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>
                          </div>
                        </div>
                      </div>
                    </div>)
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}