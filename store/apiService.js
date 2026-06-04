import { ENDPOINTS } from './apiConfig';

// ==========================================
// REAL API ENDPOINTS
// ==========================================

// 1. Auth API calls
export const registerUserApi = async (payload) => {
  console.log('=== REDUX AUTH API: Register Request Initiated ===');
  console.log('URL:', ENDPOINTS.register);
  console.log('Method: POST');
  console.log('Payload:', payload);

  const response = await fetch(ENDPOINTS.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX AUTH API: Register Request Failed ===', data.message || 'Registration failed');
    throw new Error(data.message || 'Registration failed');
  }

  console.log('=== REDUX AUTH API: Register Request Succeeded ===');
  return data;
};

export const verifyOtpApi = async (payload) => {
  console.log('=== REDUX AUTH API: Verify OTP Request Initiated ===');
  console.log('URL:', ENDPOINTS.verifyOtp);
  console.log('Method: POST');
  console.log('Payload:', payload);

  const response = await fetch(ENDPOINTS.verifyOtp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX AUTH API: Verify OTP Request Failed ===', data.message || 'OTP verification failed');
    throw new Error(data.message || 'OTP verification failed');
  }

  console.log('=== REDUX AUTH API: Verify OTP Request Succeeded ===');
  return data;
};

export const sendOtpApi = async (payload) => {
  console.log('=== REDUX AUTH API: Send OTP Request Initiated ===');
  console.log('URL:', ENDPOINTS.sendOtp);
  console.log('Method: POST');
  console.log('Payload:', payload);

  const response = await fetch(ENDPOINTS.sendOtp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX AUTH API: Send OTP Request Failed ===', data.message || 'Sending OTP failed');
    throw new Error(data.message || 'Sending OTP failed');
  }

  console.log('=== REDUX AUTH API: Send OTP Request Succeeded ===');
  return data;
};

export const loginUserApi = async (payload) => {
  console.log('=== REDUX AUTH API: Login Request Initiated ===');
  console.log('URL:', ENDPOINTS.login);
  console.log('Method: POST');
  console.log('Payload:', payload);

  const response = await fetch(ENDPOINTS.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX AUTH API: Login Request Failed ===', data.message || 'Login failed');
    throw new Error(data.message || 'Login failed');
  }

  console.log('=== REDUX AUTH API: Login Request Succeeded ===');
  return data;
};

export const updateProfileApi = async (payload, token) => {
  console.log('=== REDUX AUTH API: Update Profile Request Initiated ===');
  console.log('URL:', ENDPOINTS.updateProfile);
  console.log('Method: POST');
  console.log('Payload:', payload);
  console.log('Token available:', !!token);

  // Create FormData for file upload support
  const formData = new FormData();
  
  // Add all fields from payload to FormData
  if (payload.name) formData.append('name', payload.name);
  if (payload.email) formData.append('email', payload.email);
  if (payload.phone) formData.append('phone', payload.phone);
  if (payload.mobile) formData.append('phone', payload.mobile); // mobile can be sent as phone
  if (payload.profile_image instanceof File) {
    formData.append('profile_image', payload.profile_image);
  }

  const response = await fetch(ENDPOINTS.updateProfile, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX AUTH API: Update Profile Request Failed ===', data.message || 'Profile update failed');
    throw new Error(data.message || 'Profile update failed');
  }

  console.log('=== REDUX AUTH API: Update Profile Request Succeeded ===');
  return data;
};

// 2. Products API calls
export const fetchProductsApi = async (queryParams = {}) => {
  console.log('=== REDUX PRODUCTS API: Fetch Products Initiated ===');
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = `${ENDPOINTS.products}${queryString ? `?${queryString}` : ''}`;
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    productsCount: data.data?.products?.data?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX PRODUCTS API: Fetch Products Failed ===', data.message || 'Fetching products failed');
    throw new Error(data.message || 'Fetching products failed');
  }

  console.log('=== REDUX PRODUCTS API: Fetch Products Succeeded ===');
  return data.data;
};

export const fetchProductDetailApi = async (id) => {
  console.log('=== REDUX PRODUCTS API: Fetch Product Detail Initiated ===', id);
  const url = `${ENDPOINTS.products}/${id}`;
  console.log('URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX PRODUCTS API: Fetch Product Detail Failed ===');
    throw new Error(data.message || 'Fetching product details failed');
  }

  console.log('=== REDUX PRODUCTS API: Fetch Product Detail Succeeded ===');
  return data.data;
};

// 3. Cart API calls
export const fetchCartApi = async (token) => {
  console.log('=== REDUX CART API: Fetch Cart Initiated ===');
  const url = ENDPOINTS.getCart;
  console.log('URL:', url);
  console.log('Method: GET');
  console.log('Token available:', !!token);

  if (!token) {
    console.warn('=== REDUX CART API: No authentication token found ===');
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    itemsCount: data.data?.cart?.items?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX CART API: Fetch Cart Failed ===', data.message || 'Fetching cart failed');
    throw new Error(data.message || 'Fetching cart failed');
  }

  console.log('=== REDUX CART API: Fetch Cart Succeeded ===');
  return data.data;
};

export const addCartItemApi = async (variantId, quantity, token) => {
  console.log('=== REDUX CART API: Add Cart Item Initiated ===');
  const url = ENDPOINTS.addToCart;
  console.log('URL:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      variant_id: variantId,
      quantity: quantity,
    }),
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Adding item to cart failed');
  }

  return data;
};

export const deleteCartItemApi = async (cartItemId, token) => {
  const url = ENDPOINTS.deleteCartItem(cartItemId);
  console.log('=== REDUX CART API: Delete Cart Item Initiated ===', cartItemId);
  console.log('URL:', url);
  console.log('Method: DELETE');

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Deleting item from cart failed');
  }

  console.log('=== REDUX CART API: Delete Cart Item Succeeded ===');
  return data;
};

export const updateCartItemQtyApi = async (cartItemId, quantity, token) => {
  console.log('=== REDUX CART API: Update Cart Item Qty API ===', { cartItemId, quantity });
  const url = ENDPOINTS.updateCartItem(cartItemId);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      quantity: quantity,
    }),
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Updating quantity failed');
  }

  return data;
};

// 4. Categories & Subcategories API calls
export const fetchCategoriesApi = async () => {
  console.log('=== REDUX CATEGORIES API: Fetch Categories Initiated ===');
  const url = ENDPOINTS.categories;
  console.log('URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok || data.status === false) {
    console.error('=== REDUX CATEGORIES API: Fetch Categories Failed ===', data.message || 'Fetching categories failed');
    throw new Error(data.message || 'Fetching categories failed');
  }

  console.log('=== REDUX CATEGORIES API: Fetch Categories Succeeded ===');
  return data.data; // List of categories with nested children (subcategories)
};

export const fetchSubcategoriesApi = async () => {
  console.log('=== REDUX CATEGORIES API: Fetch Subcategories Initiated ===');
  try {
    const categories = await fetchCategoriesApi();
    // Extract and flatten all children categories which represent subcategories
    const subcategories = categories.reduce((acc, cat) => {
      if (cat.children && Array.isArray(cat.children)) {
        return [...acc, ...cat.children];
      }
      return acc;
    }, []);
    console.log('=== REDUX CATEGORIES API: Fetch Subcategories Succeeded ===', { count: subcategories.length });
    return subcategories;
  } catch (error) {
    console.error('=== REDUX CATEGORIES API: Fetch Subcategories Failed ===', error.message);
    throw error;
  }
};

// 5. Wishlist API calls
export const fetchWishlistApi = async (token) => {
  console.log('=== REDUX WISHLIST API: Fetch Wishlist Initiated ===');
  const url = ENDPOINTS.getWishlist;
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    itemsCount: data.data?.wishlist?.items?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX WISHLIST API: Fetch Wishlist Failed ===', data.message || 'Fetching wishlist failed');
    throw new Error(data.message || 'Fetching wishlist failed');
  }

  console.log('=== REDUX WISHLIST API: Fetch Wishlist Succeeded ===');
  return data.data;
};

export const addWishlistItemApi = async (productId, token) => {
  console.log('=== REDUX WISHLIST API: Add Wishlist Item Initiated ===', productId);
  const url = ENDPOINTS.addToWishlist;
  console.log('URL:', url);
  console.log('Method: POST');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Adding item to wishlist failed');
  }

  console.log('=== REDUX WISHLIST API: Add Wishlist Item Succeeded ===');
  return data;
};

export const removeWishlistItemApi = async (productId, token) => {
  console.log('=== REDUX WISHLIST API: Remove Wishlist Item Initiated ===', productId);
  const url = ENDPOINTS.removeFromWishlist;
  console.log('URL:', url);
  console.log('Method: POST');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  });

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Removing item from wishlist failed');
  }

  console.log('=== REDUX WISHLIST API: Remove Wishlist Item Succeeded ===');
  return data;
};

// 6. Banners API calls
export const fetchBannersApi = async () => {
  console.log('=== REDUX BANNERS API: Fetch Banners Initiated ===');
  const url = ENDPOINTS.banners;
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    bannersCount: data.data?.banners?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX BANNERS API: Fetch Banners Failed ===', data.message || 'Fetching banners failed');
    throw new Error(data.message || 'Fetching banners failed');
  }

  console.log('=== REDUX BANNERS API: Fetch Banners Succeeded ===');
  return data.data;
};

// 7. Reviews API calls
export const addReviewApi = async (payload, token) => {
  console.log('=== REDUX REVIEWS API: Add Review Initiated ===');
  console.log('URL:', ENDPOINTS.addReview);
  console.log('Method: POST');
  console.log('Payload:', payload);
  console.log('Token available:', !!token);

  const response = await fetch(ENDPOINTS.addReview, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Raw Response Text:', responseText);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX REVIEWS API: Add Review Failed ===', data.message || 'Adding review failed');
    throw new Error(data.message || 'Adding review failed');
  }

  console.log('=== REDUX REVIEWS API: Add Review Succeeded ===');
  return data;
};

export const fetchReviewsApi = async (productId) => {
  console.log('=== REDUX REVIEWS API: Fetch Reviews Initiated ===', productId);
  const url = ENDPOINTS.getReviews(productId);
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    reviewsCount: data.data?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX REVIEWS API: Fetch Reviews Failed ===', data.message || 'Fetching reviews failed');
    throw new Error(data.message || 'Fetching reviews failed');
  }

  console.log('=== REDUX REVIEWS API: Fetch Reviews Succeeded ===');
  return data.data;
};

export const fetchOrdersApi = async (token) => {
  console.log('=== REDUX ORDERS API: Fetch Orders Initiated ===');
  const url = ENDPOINTS.getOrders;
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Summary:', {
    status: data.status,
    message: data.message,
    ordersCount: data.data?.orders?.data?.length || 0,
  });

  if (!response.ok || data.status === false) {
    console.error('=== REDUX ORDERS API: Fetch Orders Failed ===', data.message || 'Fetching orders failed');
    throw new Error(data.message || 'Fetching orders failed');
  }

  console.log('=== REDUX ORDERS API: Fetch Orders Succeeded ===');
  // Extract orders from paginated structure: data.data.orders.data
  return data.data?.orders?.data || [];
};

export const fetchOrderDetailApi = async (orderId, token) => {
  console.log('=== REDUX ORDERS API: Fetch Order Detail Initiated ===', orderId);
  const url = ENDPOINTS.getOrderDetail(orderId);
  console.log('URL:', url);
  console.log('Method: GET');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  const responseText = await response.text();
  console.log('Raw Response Text Length:', responseText.length);

  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  console.log('Response Status:', response.status);
  console.log('Response Body:', data);

  if (!response.ok || data.status === false) {
    console.error('=== REDUX ORDERS API: Fetch Order Detail Failed ===', data.message || 'Fetching order detail failed');
    throw new Error(data.message || 'Fetching order detail failed');
  }

  console.log('=== REDUX ORDERS API: Fetch Order Detail Succeeded ===');
  return data.data;
};
