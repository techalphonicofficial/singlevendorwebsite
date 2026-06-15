'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaShoppingBag, FaSearchPlus } from 'react-icons/fa';
import { IoBagOutline } from 'react-icons/io5';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import '../../components/shopage.css';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishList';
import { showToast } from '../../store/slices/toastSlice';
import { useRouter } from 'next/navigation';
import { addCartItem, fetchCart, removeItem } from '../../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSize, removeSelectedSize } from '../../store/slices/sizeSlice';
import FilterSidebar from '../../components/FilterSidebar';
import { fetchProducts } from '../../store/slices/productSlice';
import { getImageUrl } from '../../store/apiConfig';

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
  'Green - Black': '#1a3a22',
  'Black-Blue': '#0d1b2a'
};

// Helper to transform API product to match Shop UI format
const transformApiProduct = (apiProd) => {
  const price = parseFloat(apiProd.base_price || 0);
  const categoryName = apiProd.categories?.[0]?.name || 'Necklace';
  const brandName = apiProd.brand?.name || 'General';
  const rawImageUrl = apiProd.galleries?.[0]?.image_url || '/DAJ_4366.jpg';
  const imageUrl = getImageUrl(rawImageUrl);

  // Extract variant choices where attribute_id === 1 (size)
  const sizes = Array.from(new Set(
    apiProd.variants?.flatMap(v =>
      v.attribute_values?.filter(av => av.attribute_id === 1).map(av => av.value) || []
    ) || []
  ));
  if (sizes.length === 0) {
    sizes.push('Free Size');
  }

  // Extract all unique colors where attribute_id === 5 (Colour)
  const colors = Array.from(new Set(
    apiProd.variants?.flatMap(v =>
      v.attribute_values?.filter(av => av.attribute_id === 5).map(av => av.value) || []
    ) || []
  ));
  if (colors.length === 0) {
    colors.push('Yellow');
  }

  return {
    id: apiProd.id,
    name: apiProd.name,
    slug: apiProd.slug,
    price: price,
    brand: brandName,
    category: categoryName,
    colour: colors[0],
    colourHex: colorHexMap[colors[0]] || colorHexMap[colors[0]?.toLowerCase()] || '#d8d8d8',
    colours: colors,
    rating: parseFloat(apiProd.reviews_avg_rating || 5),
    image: imageUrl,
    sizes: sizes,
    originalProduct: apiProd
  };
};

const sizeOrder = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11'];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'name-a-z', label: 'Name: A to Z' },
];

const findVariantBySize = (product, size) => {
  const variants = product.originalProduct?.variants || [];
  if (variants.length === 0) return null;

  return variants.find((variant) => {
    const variantSize = variant.attribute_values?.find((attribute) => attribute.attribute_id === 1)?.value;
    return variantSize === size;
  }) || variants[0];
};

const getFilterOptions = (items) => {
  const buildOptions = (key) => {
    const counts = items.reduce((acc, product) => {
      const values = Array.isArray(product[key]) ? product[key] : [product[key]];
      values.filter(Boolean).forEach((value) => {
        acc[value] = (acc[value] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([value, count]) => ({ value, label: value, count }));
  };

  const colours = items.reduce((acc, product) => {
    if (!product.colours || product.colours.length === 0) return acc;
    product.colours.forEach((colorVal) => {
      const hex = colorHexMap[colorVal] || colorHexMap[colorVal.toLowerCase()] || '#d8d8d8';
      if (!acc[colorVal]) {
        acc[colorVal] = {
          value: colorVal,
          label: colorVal,
          hex: hex,
          count: 0
        };
      }
      acc[colorVal].count += 1;
    });
    return acc;
  }, {});

  return {
    categories: buildOptions('category'),
    brands: buildOptions('brand'),
    sizes: buildOptions('sizes').sort((first, second) => {
      const firstIndex = sizeOrder.indexOf(first.value);
      const secondIndex = sizeOrder.indexOf(second.value);
      if (firstIndex === -1 && secondIndex === -1) return first.label.localeCompare(second.label);
      if (firstIndex === -1) return 1;
      if (secondIndex === -1) return -1;
      return firstIndex - secondIndex;
    }),
    colours: Object.values(colours).sort((first, second) => first.label.localeCompare(second.label)),
  };
};

export default function ShopPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Load products from Redux
  const { items: apiItems, loading, error } = useSelector((state) => state.products);

  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const params = { page: 1, per_page: 100, include_filters: true };
    if (sortBy === 'featured') {
      params.type = 'featured';
    }
    dispatch(fetchProducts(params));
  }, [dispatch, sortBy]);

  // Sync category filter from URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const catParam = searchParams.get('category');
      if (catParam) {
        setFilters((prev) => ({
          ...prev,
          categories: [catParam],
        }));
      }
    }
  }, []);

  // Transform products to Shop format
  const products = useMemo(() => {
    return apiItems.map(transformApiProduct);
  }, [apiItems]);

  // Initial Filter State
  const initialFilters = useMemo(() => {
    const maxVal = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 200000;
    return {
      categories: [],
      brands: [],
      sizes: [],
      colours: [],
      maxPrice: maxVal,
    };
  }, [products]);

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colours: [],
    maxPrice: 200000,
  });

  // Sync filters maxPrice when products loaded
  useEffect(() => {
    if (products.length > 0) {
      const maxVal = Math.max(...products.map((p) => p.price));
      setFilters((current) => ({ ...current, maxPrice: maxVal }));
    }
  }, [products]);

  const [activeSizePopup, setActiveSizePopup] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const selectedProductSizes = useSelector((state) => state.sizes.selectedSizes);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 200000 };
    return {
      min: Math.min(...products.map((product) => product.price)),
      max: Math.max(...products.map((product) => product.price)),
    };
  }, [products]);

  const filterOptions = useMemo(() => getFilterOptions(products), [products]);
  const activeProduct = activeSizePopup ? products.find((product) => product.id === activeSizePopup) : null;

  const handleToggleFilter = (filterKey, value) => {
    setFilters((currentFilters) => {
      const selectedValues = currentFilters[filterKey] || [];
      const nextValues = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value];

      return { ...currentFilters, [filterKey]: nextValues };
    });
  };

  const handleClearAll = () => {
    setFilters({ ...initialFilters, maxPrice: priceBounds.max });
  };

  const handlePriceChange = (maxPrice) => {
    setFilters((currentFilters) => ({ ...currentFilters, maxPrice }));
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      dispatch(showToast({ message: 'Item removed from wishlist', type: 'success' }));
      return;
    }

    dispatch(addToWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    }));
    dispatch(showToast({ message: 'Item added to wishlist', type: 'success' }));
  };

  const toggleCart = async (product) => {

    const selectedSize = selectedProductSizes[product.id];

    if (!selectedSize) {
      dispatch(showToast({
        message: 'Please select size first',
        type: 'error'
      }));
      return;
    }


    const isInCart = cartItems.some(
      item =>
        item.id === product.id &&
        item.size === selectedSize
    );


    if (isInCart) {

      dispatch(removeItem({
        id: product.id,
        size: selectedSize
      }));

      dispatch(removeSelectedSize(product.id));

      dispatch(showToast({
        message: 'Item removed from cart',
        type: 'success'
      }));

      return;
    }


    try {

      const variant = findVariantBySize(
        product,
        selectedSize
      );


      if (!variant?.id) {
        dispatch(showToast({
          message: 'Variant not available',
          type: 'error'
        }));
        return;
      }


      await dispatch(
        addCartItem({

          id: product.id,

          variantId: variant.id,

          name: product.name,

          slug: product.slug,


          // ⭐ IMAGE SAVE HERE
          image: product.image,


          price:
            Number(
              variant.price ||
              product.price
            ),


          size: selectedSize,

          quantity: 1

        })
      ).unwrap();


      dispatch(fetchCart());


      dispatch(showToast({
        message: 'Item added to cart',
        type: 'success'
      }));


    } catch (err) {

      dispatch(showToast({
        message: err || 'Unable to add',
        type: 'error'
      }));

    }

  };

  const handleSizeSelection = async (product, size) => {
    dispatch(setSelectedSize({ productId: product.id, size }));

    const alreadyInCart = cartItems.some((item) => item.id === product.id && item.size === size);
    if (alreadyInCart) {
      setActiveSizePopup(null);
      dispatch(showToast({ message: 'This size is already in your cart', type: 'info' }));
      return;
    }

    try {
      const variant = findVariantBySize(product, size);
      if (!variant?.id) {
        dispatch(showToast({ message: 'Selected variant is not available', type: 'error' }));
        return;
      }

      await dispatch(addCartItem({
        id: product.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(variant.price || product.price) || product.price,
        image: product.image,
        size,
        quantity: 1,
      })).unwrap();
      dispatch(fetchCart());
      setActiveSizePopup(null);
      dispatch(showToast({ message: 'Size selected and added to cart', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Unable to add item to cart', type: 'error' }));
    }
  };

  const handleCartClick = (product) => {
    const selectedSize = selectedProductSizes[product.id];
    if (!selectedSize) {
      setActiveSizePopup(product.id);
      return;
    }
    toggleCart(product);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchSize = filters.sizes.length === 0 || product.sizes.some((size) => filters.sizes.includes(size));
      const matchColour = filters.colours.length === 0 || product.colours.some((col) => filters.colours.includes(col));
      const matchPrice = product.price <= filters.maxPrice;

      return matchCategory && matchBrand && matchSize && matchColour && matchPrice;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    const sortedItems = [...filteredProducts];

    switch (sortBy) {
      case 'price-low-high':
        return sortedItems.sort((first, second) => first.price - second.price);
      case 'price-high-low':
        return sortedItems.sort((first, second) => second.price - first.price);
      case 'name-a-z':
        return sortedItems.sort((first, second) => first.name.localeCompare(second.name));
      case 'newest':
        return sortedItems.sort((first, second) => second.id - first.id);
      default:
        return sortedItems;
    }
  }, [filteredProducts, sortBy]);

  const activeFilterChips = [
    ...filters.categories.map((value) => ({ key: 'categories', value })),
    ...filters.brands.map((value) => ({ key: 'brands', value })),
    ...filters.sizes.map((value) => ({ key: 'sizes', value })),
    ...filters.colours.map((value) => ({ key: 'colours', value })),
  ];
  const activeSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || 'Featured';

  return (
    <section className="shop-section">
      <div className="container-fluid">
        <div className="shop-layout">
          {/* Filters Column */}
          <div className={`shop-filter-column mb-4 mb-lg-0 ${showMobileFilters ? 'show-mobile-filter' : ''}`}>
            <div className="mobile-filter-header">
              <span>Filters</span>
            </div>
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              priceBounds={priceBounds}
              onToggleFilter={handleToggleFilter}
              onPriceChange={handlePriceChange}
              onClearAll={handleClearAll}
            />
            <div className="mobile-filter-footer">
              <button type="button" className="mobile-filter-close" onClick={() => setShowMobileFilters(false)}>
                Close
              </button>
              <button type="button" className="mobile-filter-apply" onClick={() => setShowMobileFilters(false)}>
                Apply
              </button>
            </div>
          </div>
          {showMobileFilters && (
            <button
              type="button"
              className="mobile-filter-backdrop"
              onClick={() => setShowMobileFilters(false)}
              aria-label="Close filters"
            />
          )}

          {/* Products List Column */}
          <div className="shop-products-column">
            <div className="shop-sort-bar">
              <div>
                <h1 className="shop-sort-title">Products</h1>
                <p>Showing {sortedProducts.length} of {products.length} products</p>
              </div>

              <label className="sort-control">
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mobile-shop-actions">
              <button type="button" onClick={() => setShowMobileFilters(true)}>
                <SlidersHorizontal size={16} />
                Filter
              </button>
              <div className="mobile-sort-dropdown">
                <button
                  type="button"
                  className="mobile-sort-trigger"
                  onClick={() => setShowMobileSort((current) => !current)}
                >
                  <span>Sort: {activeSortLabel}</span>
                  <ChevronDown size={16} />
                </button>
                {showMobileSort && (
                  <div className="mobile-sort-menu">
                    {sortOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={sortBy === option.value ? 'active' : ''}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowMobileSort(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {activeFilterChips.length > 0 && (
              <div className="selected-filter-bar">
                {activeFilterChips.map((chip) => (
                  <button
                    type="button"
                    key={`${chip.key}-${chip.value}`}
                    className="selected-filter-item"
                    onClick={() => handleToggleFilter(chip.key, chip.value)}
                  >
                    {chip.value}
                    <span>x</span>
                  </button>
                ))}
              </div>
            )}

            {/* Loading & Error States */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading Premium Ensembles...</span>
                </div>
                <p className="mt-2 text-muted">Retrieving luxury fashion collections...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger my-4" role="alert">
                Failed to load products: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="product-scroll-area">
                <div className="row g-3 product-grid">
                  {sortedProducts.map((product) => {
                    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
                    const isInCart = cartItems.some((item) => item.id === product.id && item.size === selectedProductSizes[product.id]);

                    return (
                      <div className="col-xl-3 col-lg-4 col-md-6 col-6" key={product.id}>
                        <div className="product-card">
                          <div className="product-image-box">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-image"
                              style={{ height: '240px', objectFit: 'cover', width: '100%' }}
                              onClick={() => router.push(`/shop/${product.slug}`)}
                            />
                            <div className="hover-actions">
                              <button type="button" onClick={() => toggleWishlist(product)}>
                                {isInWishlist ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                              </button>
                              <button type="button" onClick={() => handleCartClick(product)}>
                                {isInCart ? <FaShoppingBag className="text-danger" /> : <IoBagOutline />}
                              </button>
                              <Link href={`/shop/${product.slug}`}>
                                <FaSearchPlus />
                              </Link>
                            </div>
                          </div>

                          <div className="product-content">
                            <h3>{product.name}</h3>
                            <div className="product-rating" style={{ color: '#d4a574' }}>
                              {'★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))}
                            </div>
                            <p>Rs {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="empty-filter-state py-5 text-center">
                No products match these filters. Clear filters and try again.
              </div>
            )}

            {/* Size / Variant Options Modal Popup */}
            {activeProduct && (
              <div className="size-select-modal-overlay" onClick={() => setActiveSizePopup(null)}>
                <div className="size-select-modal" onClick={(event) => event.stopPropagation()}>
                  <div className="size-select-modal-header">
                    <div>
                      <span className="modal-cta">Choose options</span>
                      <p className="modal-subtitle">Tap a variant option to add this product to your cart instantly.</p>
                    </div>
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={() => setActiveSizePopup(null)}
                      aria-label="Close variant selector"
                    >
                      x
                    </button>
                  </div>
                  <div className="size-select-modal-body">
                    <img src={activeProduct.image} alt={activeProduct.name} className="size-select-image" style={{ objectFit: 'cover', height: '140px' }} />
                    <div className="size-select-copy">
                      <span className="product-brand">{activeProduct.brand}</span>
                      <h3>{activeProduct.name}</h3>
                      <p className="product-price">Rs {activeProduct.price.toLocaleString()}</p>
                    </div>
                    <div className="size-chip-grid">
                      {activeProduct.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`size-chip ${selectedProductSizes[activeProduct.id] === size ? 'selected' : ''}`}
                          onClick={() => handleSizeSelection(activeProduct, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="size-select-hint">Pick the variant/size that fits and the item will be added right away.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
