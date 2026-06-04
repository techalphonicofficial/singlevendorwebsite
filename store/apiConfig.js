export const BASE_URL = 'https://rekhacorporation.com/api/v1';

export const ENDPOINTS = {
  register: `${BASE_URL}/register`,
  sendOtp: `${BASE_URL}/send-otp`,
  login: `${BASE_URL}/login`,
  verifyOtp: `${BASE_URL}/verify-otp`,
  updateProfile: `${BASE_URL}/customer/profile`,
  banners: `${BASE_URL}/home/banners`,
  products: `${BASE_URL}/products`,
  categories: `${BASE_URL}/categories`,
  subCategories: `${BASE_URL}/sub-categories`,
  addToCart: `${BASE_URL}/cart/items`,
  getCart: `${BASE_URL}/cart`,
  getWishlist: `${BASE_URL}/get-wishlist`,
  addToWishlist: `${BASE_URL}/add-to-wishlist`,
  removeFromWishlist: `${BASE_URL}/remove-to-wishlist`,
  updateCartItem: (cartItemId) => `${BASE_URL}/cart/items/${cartItemId}`,
  deleteCartItem: (cartItemId) => `${BASE_URL}/cart/items/${cartItemId}`,
  addReview: `${BASE_URL}/add-review`,
  getReviews: (productId) => `${BASE_URL}/reviews?product_id=${productId}`,
  getOrders: `${BASE_URL}/customer/orders`,
  getOrderDetail: (orderId) => `${BASE_URL}/customer/orders/${orderId}`,
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
};
