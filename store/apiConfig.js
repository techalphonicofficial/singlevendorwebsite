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
  faq: `${BASE_URL}/faq`,
};

export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If the URL already contains our proxy endpoint, return it as-is
  if (url.includes('/api/proxy-image')) {
    if (url.startsWith('http')) {
      const match = url.match(/\/api\/proxy-image\?.+/);
      if (match) return match[0];
    }
    return url;
  }

  let finalUrl = url;
  if (url.startsWith('http')) {
    // Replace any external host/protocol (like vercel or localhost) with the correct backend URL
    finalUrl = url.replace(/https?:\/\/[^\/]+/g, 'https://mybiography.in');
  } else {
    const domain = 'https://mybiography.in';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    finalUrl = `${domain}${cleanPath}`;
  }
  return `/api/proxy-image?url=${encodeURIComponent(finalUrl)}`;
};

export const getMediaUrl = (url) => {
  if (!url) return '';

  // If the media URL is already absolute/relative pointing to proxy, return it
  if (url.includes('/api/proxy-image')) {
    if (url.startsWith('http')) {
      const match = url.match(/\/api\/proxy-image\?.+/);
      if (match) return match[0];
    }
    return url;
  }

  let finalUrl = url;
  if (url.startsWith('http')) {
    finalUrl = url.replace(/https?:\/\/[^\/]+/g, 'https://mybiography.in');
  } else {
    const domain = 'https://mybiography.in';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    finalUrl = `${domain}${cleanPath}`;
  }
  return finalUrl;
};
