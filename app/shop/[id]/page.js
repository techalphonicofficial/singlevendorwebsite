'use client';

import Link from 'next/link';
import '../../../components/shopage.css';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, fetchCart, applyCoupon, removeCoupon } from '../../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../store/slices/wishList';
import { setSelectedSize } from '../../../store/slices/sizeSlice';
import { showToast } from '../../../store/slices/toastSlice';
import { fetchProducts } from '../../../store/slices/productSlice';
import { getImageUrl } from '../../../store/apiConfig';
import { fetchProductDetailApi, fetchCouponsApi } from '../../../store/apiService';
import { FiZoomIn, FiShoppingCart } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ProductReviews from '../../../components/ProductReviews';

// ─── Static review data ───────────────────────────────────────────────────────
const customerReviews = [
  { id: 1, name: 'Rajesh Kumar', title: 'A wedding look that stole the show', rating: 5, date: '2024-01-15', review: 'Absolutely stunning sherwani! The craftsmanship is exceptional and it fit perfectly. Wore it for my wedding and received countless compliments.', verified: true },
  { id: 2, name: 'Priya Sharma', title: 'Rich embroidery and comfortable fabric', rating: 4, date: '2024-01-10', review: 'Beautiful kurta set with great embroidery work. The fabric is comfortable and the color is exactly as shown. Would definitely recommend!', verified: true },
  { id: 3, name: 'Amit Patel', title: 'Premium finish with quick delivery', rating: 5, date: '2024-01-08', review: 'Premium quality and excellent service. The Nehru jacket exceeded my expectations. Fast delivery and perfect packaging.', verified: true },
  { id: 4, name: 'Sneha Gupta', title: 'Super comfortable and elegant', rating: 4, date: '2024-01-05', review: 'Love the juttis! Very comfortable and the embroidery is detailed. Perfect for festive occasions. Great value for money.', verified: true },
  { id: 5, name: 'Vikram Singh', title: 'Classic fit with premium material', rating: 5, date: '2024-01-03', review: "Outstanding bandhgala suit. The fit is perfect and the material is top-notch. Manyavar never disappoints with their quality.", verified: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function renderStars(value) {
  const filled = Math.round(value || 0);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}
function parsePrice(str) { return parseFloat(str) || 0; }
function calcDiscount(basePrice, discountType, discountValue) {
  if (!discountValue || !basePrice) return 0;
  if (discountType === 'percent') return Math.round(parseFloat(discountValue));
  if (discountType === 'fixed') return Math.round((parseFloat(discountValue) / parseFloat(basePrice)) * 100);
  return 0;
}
function getDiscountedPrice(basePrice, discountType, discountValue) {
  const base = parsePrice(basePrice);
  const disc = parseFloat(discountValue) || 0;
  if (discountType === 'percent') return Math.round(base - (base * disc) / 100);
  if (discountType === 'fixed') return Math.round(base - disc);
  return base;
}
const colorHexMap = {
  'Yellow': '#f4ead8',
  'White': '#ffffff',
  'white': '#ffffff',
  'Pink': '#ffc0cb',
  'Silver': '#c0c0c0',
  'Gold': '#ffd700',
  'GOLD': '#ffd700',
  'Black': '#111111',
  'black': '#111111',
  'Deep Black': '#050505',
  'Green': '#2e7d32',
  'green': '#2e7d32',
  'Blue': '#1565c0',
  'blue': '#1565c0',
  'Grey': '#888888',
  'grey': '#888888',
  'Teal': '#008080',
  'teal': '#008080',
  'Turquois': '#40e0d0',
  'turquois': '#40e0d0',
  'navy': '#000080',
  'Navy': '#000080',
  'Maroon': '#800000',
  'maroon': '#800000',
  'Red': '#ff0000',
  'red': '#ff0000',
  'Dark Pink': '#e75480',
  'dark pink': '#e75480'
};

function getColors(product) {
  if (product?.variants && product.variants.length > 0) {
    const colorSets = product.variants
      .flatMap(v => v.attribute_values || [])
      .filter(av => av.attribute_id === 5)
      .map(av => av.value);
    if (colorSets.length > 0) return [...new Set(colorSets)];
  }
  return [];
}

function getGalleryImages(product, selectedVariant = null, selectedColor = null, isTargetProduct = false) {
  let list = [];

  // If it is the target product and a color is selected, retrieve images only for that color
  if (isTargetProduct && selectedColor) {
    if (product?.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        const hasColor = v.attribute_values?.some(av => av.attribute_id === 5 && av.value === selectedColor);
        if (hasColor && v.shared_galleries && v.shared_galleries.length > 0) {
          const sortedGalleries = [...v.shared_galleries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          sortedGalleries.forEach(g => {
            const url = getImageUrl(g.image_url || g.image || g.url || '');
            if (url) list.push(url);
          });
        }
      });
    }

    // Fall back to main galleries matching this color if no variant has shared_galleries
    if (list.length === 0 && product?.galleries && product.galleries.length > 0) {
      let colorAttrValueId = null;
      if (product.variants && product.variants.length > 0) {
        for (const v of product.variants) {
          const colorAttr = v.attribute_values?.find(av => av.attribute_id === 5 && av.value === selectedColor);
          if (colorAttr) {
            colorAttrValueId = colorAttr.id;
            break;
          }
        }
      }

      if (colorAttrValueId) {
        const matchingGalleries = product.galleries
          .filter(g => g.attribute_value_id === colorAttrValueId)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        
        matchingGalleries.forEach(g => {
          const url = getImageUrl(g.image_url || g.image || g.url || '');
          if (url) list.push(url);
        });
      }
    }
  } else {
    // Standard prioritization logic for other products:
    // If a variant is selected, prioritize its shared_galleries images
    if (selectedVariant?.shared_galleries && selectedVariant.shared_galleries.length > 0) {
      list = selectedVariant.shared_galleries
        .map(g => getImageUrl(g.image_url || g.image || g.url || ''))
        .filter(Boolean);
    }
  }

  // If list is empty, merge all product galleries and ALL variants' shared_galleries.
  if (list.length === 0) {
    if (product?.galleries && product.galleries.length > 0) {
      const mainImgs = product.galleries
        .map(g => getImageUrl(g.image_url || g.image || g.url || ''))
        .filter(Boolean);
      list = [...list, ...mainImgs];
    }

    if (product?.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        if (v.shared_galleries && v.shared_galleries.length > 0) {
          const varImgs = v.shared_galleries
            .map(g => getImageUrl(g.image_url || g.image || g.url || ''))
            .filter(Boolean);
          list = [...list, ...varImgs];
        }
      });
    }
  } else {
    // If a variant or color is selected, append the product's main galleries as secondary options
    if (product?.galleries && product.galleries.length > 0) {
      const mainImgs = product.galleries
        .map(g => getImageUrl(g.image_url || g.image || g.url || ''))
        .filter(Boolean);
      list = [...list, ...mainImgs];
    }
  }

  const unique = [...new Set(list)];
  if (unique.length > 0) return unique;

  if (product?.thumbnail) return [getImageUrl(product.thumbnail)];
  return ['/DAJ_4613.jpg'];
}
function getSizes(product) {
  if (product?.variants && product.variants.length > 0) {
    const sizeSets = product.variants
      .flatMap(v => v.attribute_values || [])
      .filter(av => av.attribute_id === 1)
      .map(av => av.value);
    if (sizeSets.length > 0) return [...new Set(sizeSets)];
  }
  return ['S', 'M', 'L', 'XL', 'XXL'];
}
function getCategoryName(product) {
  if (product?.categories && product.categories.length > 0) {
    return product.categories.map(c => c.name).join(', ');
  }
  return product?.category || 'Ethnic Wear';
}
function findVariantBySize(product, size) {
  const variants = product?.variants || [];
  if (variants.length === 0) return null;

  return variants.find((variant) => {
    const variantSize = variant.attribute_values?.find((attribute) => attribute.attribute_id === 1)?.value;
    return variantSize === size;
  }) || variants[0];
}
// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.id; // the dynamic segment is named [id] but holds the slug
  const dispatch = useDispatch();
  const router = useRouter();

  // Local API state (avoids Redux race conditions / strict-mode issues)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity] = useState(1);
  const [sizeError, setSizeError] = useState({});
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [reviews, setReviews] = useState(customerReviews);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', title: '', rating: 5, description: '' });
  const [formError, setFormError] = useState('');

  // Redux state
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const selectedSizes = useSelector(state => state.sizes.selectedSizes);
  const { items: allItems } = useSelector(state => state.products);
  const fancyboxRef = useRef(null);

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const appliedCoupon = useSelector(state => state.cart.appliedCoupon);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const loadCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const data = await fetchCouponsApi(token);
        setCoupons(data || []);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      } finally {
        setLoadingCoupons(false);
      }
    };
    loadCoupons();
  }, [token]);

  // ── Fetch product from API directly ──────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const data = await fetchProductDetailApi(slug);
        const productData = data?.product || data || null;
        if (!productData) throw new Error('Product data not found in response.');

        console.log('[ProductDetail] Loaded:', productData.name);
        if (!cancelled) setProduct(productData);
      } catch (err) {
        console.error('[ProductDetail] Error:', err.message);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  // ── Also ensure related products are loaded ───────────────────────────────
  useEffect(() => {
    if (allItems.length === 0) {
      dispatch(fetchProducts({ page: 1, per_page: 100, include_filters: true, type: 'featured' }));
    }
  }, [dispatch, allItems.length]);

  // ── Reset image on product or variant change ───────────────────────────────
  const selectedSize = product?.id ? selectedSizes[product.id] : null;
  const selectedVariant = selectedSize ? findVariantBySize(product, selectedSize) : null;
  
  const isTargetProduct = slug === 'elegant-mens-wedding-sherwani-dupatta-gold-velvet-floral-print-traditional-indian-ethnic-wear-with-tassels';
  const colors = useMemo(() => getColors(product), [product]);
  const [selectedColor, setSelectedColor] = useState(null);

  // Default to first color
  useEffect(() => {
    if (isTargetProduct && colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [isTargetProduct, colors, selectedColor]);

  // Sync color with size selection
  useEffect(() => {
    if (isTargetProduct && selectedSize && product?.variants) {
      const variant = product.variants.find(v => v.attribute_values?.some(av => av.attribute_id === 1 && av.value === selectedSize));
      const colorVal = variant?.attribute_values?.find(av => av.attribute_id === 5)?.value;
      if (colorVal && colorVal !== selectedColor) {
        setSelectedColor(colorVal);
      }
    }
  }, [isTargetProduct, selectedSize, product, selectedColor]);

  // Reset selectedImage when color changes
  useEffect(() => {
    if (isTargetProduct) {
      setSelectedImage(0);
    }
  }, [selectedColor, isTargetProduct]);

  // Handle color selection click
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (product?.variants) {
      const variant = product.variants.find(v => v.attribute_values?.some(av => av.attribute_id === 5 && av.value === color));
      const sizeVal = variant?.attribute_values?.find(av => av.attribute_id === 1)?.value;
      if (sizeVal) {
        dispatch(setSelectedSize({ productId: product.id, size: sizeVal }));
      }
    }
  };

  useEffect(() => { setSelectedImage(0); }, [product?.id, selectedVariant?.id]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="py-5">
        <div className="container text-center py-5">
          <div className="spinner-border" style={{ color: '#d4a574', width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Fetching product details…</p>
        </div>
      </main>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="py-5">
        <div className="container text-center py-5">
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h4 className="text-danger mb-3 mt-2">Failed to load product</h4>
          <p className="text-muted">{error}</p>
          <div className="d-flex gap-3 justify-content-center mt-4">
            <button className="btn btn-outline-dark rounded-pill px-4" onClick={() => window.location.reload()}>
              Try Again
            </button>
            <Link href="/shop" className="btn btn-outline-secondary rounded-pill px-4">Back to Shop</Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <main className="py-5">
        <div className="container text-center py-5">
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <h4 className="mt-2">Product not found</h4>
          <p className="text-muted">We couldn't find the product you were looking for.</p>
          <Link href="/shop" className="btn btn-outline-dark rounded-pill px-4 mt-3">Back to Shop</Link>
        </div>
      </main>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const images = getGalleryImages(product, selectedVariant, selectedColor, isTargetProduct);
  const sizes = getSizes(product);
  const basePrice = parsePrice(product.base_price);
  const discountType = product.discount_type;
  const discountValue = product.discount_value;
  const discountedPrice = getDiscountedPrice(basePrice, discountType, discountValue);
  const discountPercent = calcDiscount(basePrice, discountType, discountValue);
  const categoryName = getCategoryName(product);
  const avgRating = parseFloat(product.reviews_avg_rating) || 0;
  const reviewsCount = parseInt(product.reviews_count) || 0;
  const isFreeShipping = !!product.is_free_shipping;
  const description = product.description || product.short_description || 'Premium quality ethnic wear crafted with care.';
  const numericId = product.id;

  const isInCart = cartItems.some(item => item.id === numericId && item.size === selectedSizes[numericId]);
  const isInWish = wishlistItems.some(item => item.id === numericId);

  const relatedProducts = allItems
    .filter(item => item.id !== numericId)
    .slice(0, 4);

  const totalReviews = reviews.length;
  const averageRating = totalReviews ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : avgRating;
  const verifiedReviews = reviews.filter(r => r.verified).length;
  const ratingSummary = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    const selectedSize = selectedSizes[numericId];
    if (!selectedSize) {
      setSizeError(prev => ({ ...prev, [numericId]: true }));
      setShowSizeSelector(true);
      return;
    }
    setSizeError(prev => ({ ...prev, [numericId]: false }));
    try {
      const variant = findVariantBySize(product, selectedSize);
      if (!variant?.id) {
        dispatch(showToast({ message: 'Selected variant is not available', type: 'error' }));
        return;
      }

      await dispatch(addCartItem({
        id: numericId,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(variant.price || discountedPrice) || discountedPrice,
        image: getImageUrl(variant.image || '') || images[0],
        quantity,
        size: selectedSize,
      })).unwrap();
      dispatch(fetchCart());
      dispatch(showToast({ message: 'Item added to cart', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Unable to add item to cart', type: 'error' }));
    }
  };

  const handleLiked = () => {
    if (isInWish) {
      dispatch(removeFromWishlist(numericId));
      dispatch(showToast({ message: 'Removed from wishlist', type: 'info' }));
    } else {
      dispatch(addToWishlist({ id: numericId, name: product.name, slug: product.slug, price: discountedPrice, image: images[0] }));
      dispatch(showToast({ message: 'Added to wishlist ❤️', type: 'success' }));
    }
  };

  const handleWishlistToggle = (item) => {
    const itemId = item.id;
    const alreadyInWish = wishlistItems.some(w => w.id === itemId);
    const itemPrice = getDiscountedPrice(parsePrice(item.base_price), item.discount_type, item.discount_value);
    const itemImage = getImageUrl(item.galleries?.[0]?.image_url || item.thumbnail || '') || images[0];
    if (alreadyInWish) {
      dispatch(removeFromWishlist(itemId));
      dispatch(showToast({ message: 'Removed from wishlist', type: 'info' }));
    } else {
      dispatch(addToWishlist({ id: itemId, name: item.name, slug: item.slug, price: itemPrice, image: itemImage }));
      dispatch(showToast({ message: 'Added to wishlist ❤️', type: 'success' }));
    }
  };

  const handleQuickAdd = async (item) => {
    const itemPrice = getDiscountedPrice(parsePrice(item.base_price), item.discount_type, item.discount_value);
    try {
      const variant = findVariantBySize(item, 'M');
      if (!variant?.id) {
        dispatch(showToast({ message: 'Selected variant is not available', type: 'error' }));
        return;
      }

      await dispatch(addCartItem({
        id: item.id,
        variantId: variant.id,
        name: item.name,
        slug: item.slug,
        price: parseFloat(variant.price || itemPrice) || itemPrice,
        image: getImageUrl(variant.image || item.galleries?.[0]?.image_url || item.thumbnail || '') || '/DAJ_4613.jpg',
        quantity: 1,
        size: 'M',
      })).unwrap();
      dispatch(fetchCart());
      dispatch(showToast({ message: `${item.name} added to cart`, type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Unable to add item to cart', type: 'error' }));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const name = newReview.name.trim();
    const title = newReview.title.trim();
    const description = newReview.description.trim();
    if (!name || !title || !description) {
      setFormError('Please complete all fields before submitting your review.');
      return;
    }
    setReviews([{ id: Date.now(), name, title, rating: Number(newReview.rating), date: new Date().toISOString(), review: description, verified: true }, ...reviews]);
    setNewReview({ name: '', title: '', rating: 5, description: '' });
    setFormError('');
    setReviewFormOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="py-5 m-0 p-0">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/shop">Shop</Link></li>
            <li className="breadcrumb-item active" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* ── Product Images ────────────────────────────────────────────── */}
          <div className="col-lg-7">
            <div ref={fancyboxRef}>
              <div className="product-main-image position-relative">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="img-fluid rounded object-contain zoom-image"
                  style={{ width: '100%', maxHeight: '550px', objectFit: 'cover', borderRadius: '12px' }}
                  onError={e => { e.target.src = '/DAJ_4613.jpg'; }}
                />
                <button className="preview-btn" aria-label="Zoom image">
                  <FiZoomIn />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="d-flex gap-3 flex-wrap mt-3">
                {images.map((thumb, idx) => (
                  <div
                    key={idx}
                    className="border rounded overflow-hidden"
                    style={{
                      width: '90px', height: '110px', cursor: 'pointer',
                      outline: selectedImage === idx ? '2px solid #d4a574' : 'none',
                      borderRadius: '8px',
                    }}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img
                      src={thumb}
                      alt={`View ${idx + 1}`}
                      className="w-100 h-100 object-fit-cover"
                      onError={e => { e.target.src = '/DAJ_4613.jpg'; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ──────────────────────────────────────────────── */}
          <div className="col-lg-5">
            <div className="product-info">
              <h1 className="display-6 fw-bold mb-2" style={{ fontSize: '1.6rem', lineHeight: 1.3 }}>{product.name}</h1>
              <p className="text-muted mb-3">{categoryName}</p>

              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <span className="me-2" style={{ color: '#d4a574', fontSize: '20px' }}>
                  {renderStars(avgRating || averageRating)}
                </span>
                <span className="text-muted">
                  ({reviewsCount > 0 ? reviewsCount : totalReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="price-section mb-4">
                <span className="h3 fw-bold me-2" style={{ color: '#d4a574' }}>
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-muted text-decoration-line-through me-1">
                      ₹{basePrice.toLocaleString()}
                    </span>
                    <span className="badge bg-success ms-1">{discountPercent}% OFF</span>
                  </>
                )}
                {isFreeShipping && (
                  <span className="badge ms-2" style={{ backgroundColor: '#d4a574' }}>Free Shipping</span>
                )}
              </div>

              {/* Description */}
              <div
                className="mb-4 text-secondary"
                style={{ lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: description }}
              />

              {/* Color Selector */}
              {isTargetProduct && colors.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2" style={{ letterSpacing: '0.5px' }}>SELECT COLOR</label>
                  <div className="d-flex flex-wrap gap-2">
                    {colors.map(color => {
                      const colorHex = colorHexMap[color] || colorHexMap[color.toLowerCase()] || '#888888';
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          className="btn rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                          style={{
                            border: isSelected ? '1.5px solid #d4a574' : '1px solid #ccc',
                            backgroundColor: isSelected ? '#333' : '#fff',
                            color: isSelected ? '#fff' : '#333',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                          }}
                          onClick={() => handleColorSelect(color)}
                        >
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: colorHex,
                            border: '1px solid #ccc',
                            display: 'inline-block'
                          }} />
                          <span className="fw-semibold text-uppercase" style={{ fontSize: '0.85rem' }}>{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary mb-3 d-inline-flex align-items-center gap-2"
                  onClick={() => setShowSizeSelector(s => !s)}
                >
                  <FiShoppingCart />
                  {showSizeSelector ? 'Hide Sizes' : 'Select Size'}
                </button>

                <div className={`size-selector-panel ${showSizeSelector ? 'open' : ''}`}>
                  <label className="form-label fw-semibold mb-3">Select Size</label>
                  <div className="d-flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`btn rounded-pill px-4 ${selectedSizes[numericId] === size ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => dispatch(setSelectedSize({ productId: numericId, size }))}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError[numericId] && (
                    <p className="text-danger mt-2">Please choose a size before adding to cart.</p>
                  )}
                </div>
              </div>

              {/* Add to Cart */}
              {isInCart ? (
                <button className="btn btn-dark w-100 mb-3 py-2 rounded-pill" disabled>
                  ✓ Already in Cart
                </button>
              ) : (
                <button
                  className="btn w-100 mb-3 py-2 rounded-pill fw-semibold"
                  style={{ backgroundColor: '#d4a574', color: 'white', border: 'none' }}
                  onClick={handleAddToCart}
                >
                  Add to Cart • ₹{(discountedPrice * quantity).toLocaleString()}
                </button>
              )}

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <Link href="/cart" className="btn btn-outline-dark w-100 rounded-pill">
                    View Cart
                  </Link>
                </div>
                <div className="col-6">
                  <button
                    className={`btn w-100 rounded-pill ${isInWish ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={handleLiked}
                  >
                    {isInWish ? <><FaHeart className="me-1" />Wishlisted</> : <><FaRegHeart className="me-1" />Wishlist</>}
                  </button>
                </div>
              </div>

              {/* Coupons & Offers Section */}
              {!loadingCoupons && coupons && coupons.length > 0 && (
                <div className="exclusive-offers-section mb-4 p-3 rounded" style={{
                  background: 'linear-gradient(135deg, #fdfbf7 0%, #f7f1e5 100%)',
                  border: '1px solid #e8dec9',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(212, 165, 116, 0.05)'
                }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span style={{ fontSize: '18px' }}>🏷️</span>
                    <h6 className="m-0 fw-bold text-dark" style={{ letterSpacing: '0.5px' }}>EXCLUSIVE OFFERS FOR YOU</h6>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {coupons.map((coupon) => {
                      const isApplied = appliedCoupon?.code === coupon.code;
                      const now = new Date();
                      const validFrom = new Date(coupon.valid_from);
                      const validUntil = new Date(coupon.valid_until);
                      const isActive = now >= validFrom && now <= validUntil;

                      if (!isActive) return null; // Only show active coupons

                      return (
                        <div
                          key={coupon.id}
                          className="coupon-voucher-card position-relative overflow-hidden d-flex justify-content-between align-items-center p-3"
                          style={{
                            background: isApplied ? '#fffdf9' : '#ffffff',
                            border: isApplied ? '1.5px solid #d4a574' : '1px dashed #d1c7bd',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: isApplied ? '0 4px 10px rgba(212,165,116,0.15)' : 'none'
                          }}
                        >
                          {/* Ticket Notches */}
                          <div style={{
                            position: 'absolute',
                            left: '-8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '16px',
                            height: '16px',
                            background: '#ffffff', // matches page background or container
                            borderRadius: '50%',
                            borderRight: isApplied ? '1.5px solid #d4a574' : '1px dashed #d1c7bd',
                            zIndex: 2
                          }} />
                          <div style={{
                            position: 'absolute',
                            right: '-8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '16px',
                            height: '16px',
                            background: '#ffffff',
                            borderRadius: '50%',
                            borderLeft: isApplied ? '1.5px solid #d4a574' : '1px dashed #d1c7bd',
                            zIndex: 2
                          }} />

                          <div className="d-flex flex-column" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge fw-bold" style={{
                                backgroundColor: '#d4a574',
                                color: 'white',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                letterSpacing: '1px'
                              }}>
                                {coupon.code}
                              </span>
                              <span className="text-dark fw-bold" style={{ fontSize: '13px' }}>
                                {coupon.discount_type === 'percentage'
                                  ? `${coupon.discount_value}% OFF`
                                  : `₹${parseFloat(coupon.discount_value).toFixed(0)} OFF`}
                              </span>
                            </div>
                            <p className="text-muted m-0" style={{ fontSize: '11px' }}>
                              {coupon.description || `Get discount on your order`}
                            </p>
                          </div>

                          <div style={{ zIndex: 3 }}>
                            {isApplied ? (
                              <button
                                onClick={() => {
                                  dispatch(removeCoupon());
                                  dispatch(showToast({ message: 'Coupon removed', type: 'info' }));
                                }}
                                className="btn btn-sm px-3 rounded-pill text-success fw-bold d-flex align-items-center gap-1"
                                style={{
                                  backgroundColor: '#eafaf1',
                                  border: '1px solid #28a745',
                                  fontSize: '12px'
                                }}
                              >
                                ✓ Applied
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  dispatch(applyCoupon(coupon));
                                  dispatch(showToast({ message: `Coupon ${coupon.code} Applied!`, type: 'success' }));
                                }}
                                className="btn btn-sm px-3 rounded-pill fw-bold"
                                style={{
                                  backgroundColor: '#d4a574',
                                  color: 'white',
                                  border: 'none',
                                  fontSize: '12px',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Details Table */}
              <div className="product-details my-4">
                <h5 className="mb-3">Product Details</h5>
                <div className="row g-2" style={{ fontSize: '0.95rem' }}>
                  {product.brand?.name && (
                    <div className="col-sm-6"><strong>Brand:</strong> {product.brand.name}</div>
                  )}
                  {product.sku && (
                    <div className="col-sm-6"><strong>SKU:</strong> {product.sku}</div>
                  )}
                  <div className="col-sm-6">
                    <strong>Availability:</strong>{' '}
                    <span style={{ color: product.status === 'active' ? '#28a745' : '#dc3545' }}>
                      {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  {isFreeShipping && (
                    <div className="col-sm-6"><strong>Shipping:</strong> Free</div>
                  )}
                  {product.categories?.length > 0 && (
                    <div className="col-sm-6"><strong>Category:</strong> {categoryName}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews Section ──────────────────────────────────────────────── */}
        <div className="row mt-5">
          <div className="col-12">
            <ProductReviews productId={numericId} />
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
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
                  {relatedProducts.map(item => {
                    const itemInWish = wishlistItems.some(w => w.id === item.id);
                    const itemBasePrice = parsePrice(item.base_price);
                    const itemDiscountedPrice = getDiscountedPrice(itemBasePrice, item.discount_type, item.discount_value);
                    const itemDiscount = calcDiscount(itemBasePrice, item.discount_type, item.discount_value);
                    const itemImage = getImageUrl(item.thumbnail || item.galleries?.[0]?.image_url || '');

                    return (
                      <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                        <div className="product-card related-card overflow-hidden shadow-sm bg-white position-relative">
                          <div
                            className="product-image-box related-image-wrap position-relative overflow-hidden"
                            onClick={() => router.push(`/shop/${item.slug}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={itemImage || '/DAJ_4613.jpg'}
                              alt={item.name}
                              className="related-image primary"
                              onError={e => { e.target.src = '/DAJ_4613.jpg'; }}
                            />
                            <div className="hover-actions">
                              <button
                                type="button"
                                className="btn btn-sm rounded-circle"
                                onClick={e => { e.stopPropagation(); handleWishlistToggle(item); }}
                                aria-label="Toggle wishlist"
                              >
                                {itemInWish ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                              </button>
                            </div>
                          </div>
                          <div className="product-content p-3 text-center">
                            <h3 style={{ fontSize: '0.85rem', lineHeight: 1.4, minHeight: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {item.name}
                            </h3>
                            <div className="product-rating mb-2" style={{ color: '#d4a574' }}>
                              {renderStars(parseFloat(item.reviews_avg_rating) || 0)}
                            </div>
                            <p className="mb-2 fw-bold">₹{itemDiscountedPrice.toLocaleString()}</p>
                            {itemDiscount > 0 && (
                              <div className="d-flex align-items-center justify-content-center gap-2">
                                <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>₹{itemBasePrice.toLocaleString()}</span>
                                <span className="text-success" style={{ fontSize: '0.8rem' }}>{itemDiscount}% off</span>
                              </div>
                            )}
                            <button
                              className="btn btn-sm mt-2 rounded-pill w-100"
                              style={{ backgroundColor: '#d4a574', color: 'white', border: 'none' }}
                              onClick={e => { e.stopPropagation(); handleQuickAdd(item); }}
                            >
                              Quick Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
