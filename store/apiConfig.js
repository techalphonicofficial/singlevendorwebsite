export const BASE_URL = '/api/v1-proxy';

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
  forgotPassword: `${BASE_URL}/forgot-password`,
  coupons: `${BASE_URL}/coupons`,
  checkout: `${BASE_URL}/checkout`,
  placeOrder: `${BASE_URL}/checkout/place-order`,
  dashboard: `${BASE_URL}/customer/dashboard`,
  cancelOrder: `${BASE_URL}/customer/cancel-order`,
  cancelOrderItem: `${BASE_URL}/customer/cancel-order-item`,
  getPageBySlug: (slug) => `${BASE_URL}/pages/${slug}`,
  blogs: `${BASE_URL}/blogs`,
  blogDetail: (slug) => `${BASE_URL}/blogs/${slug}`,
  inquiry: `${BASE_URL}/inquiry`,
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/api/proxy-image') || url.startsWith('http://localhost:3000/api/proxy-image')) {
    return url;
  }
  let finalUrl = url;
  if (url.includes('localhost') && !url.includes('/api/proxy-image')) {
    finalUrl = url.replace(/https?:\/\/[^\/]+/g, 'https://mybiography.in');
  } else if (!url.startsWith('http')) {
    const domain = 'https://mybiography.in';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    finalUrl = `${domain}${cleanPath}`;
  }
  if (finalUrl.startsWith('http') && (finalUrl.includes('mybiography.in') || finalUrl.includes('ngrok') || finalUrl.includes('rekhacorporation.com'))) {
    return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
  }
  return finalUrl;
};

export const getMediaUrl = (url) => {
  if (!url) return '';
  let finalUrl = url;
  if (url.includes('localhost')) {
    finalUrl = url.replace(/https?:\/\/[^\/]+/g, 'https://mybiography.in');
  } else if (!url.startsWith('http')) {
    const domain = 'https://mybiography.in';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    finalUrl = `${domain}${cleanPath}`;
  }
  return finalUrl;
};
