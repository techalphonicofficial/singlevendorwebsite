'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaShoppingBag, FaSearchPlus } from 'react-icons/fa';
import { IoBagOutline } from 'react-icons/io5';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import '../../components/shopage.css';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishList';
import { showToast } from '../../store/slices/toastSlice';
import { useRouter } from 'next/navigation';
import { addItem, removeItem } from '../../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSize, removeSelectedSize } from '../../store/slices/sizeSlice';
import FilterSidebar from '../../components/FilterSidebar';

const products = [
  {
    id: 1,
    name: 'Black Printed Kurta',
    price: 5500,
    brand: 'Manyavar',
    category: 'Kurta Sets',
    colour: 'Black',
    colourHex: '#111111',
    rating: 5,
    image: '/DAJ_4613.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'Luxury Sherwani',
    price: 19000,
    brand: 'Manyavar',
    category: 'Sherwanis',
    colour: 'Ivory',
    colourHex: '#f4ead8',
    rating: 5,
    image: '/DAJ_4661.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 3,
    name: 'Royal Safa',
    price: 3499,
    brand: 'Mohey',
    category: 'Accessories',
    colour: 'Maroon',
    colourHex: '#7b1f32',
    rating: 5,
    image: '/DAJ_4366.jpg',
    sizes: ['Free Size'],
  },
  {
    id: 4,
    name: 'Silk Juttis',
    price: 2299,
    brand: 'Manyavar',
    category: 'Footwear',
    colour: 'Tan',
    colourHex: '#b98245',
    rating: 5,
    image: '/DAJ_4366.jpg',
    sizes: ['7', '8', '9', '10', '11'],
  },
  {
    id: 5,
    name: 'Festive Bandhgala',
    price: 18499,
    brand: 'Twamev',
    category: 'Indo-Western',
    colour: 'Navy',
    colourHex: '#1f3155',
    rating: 5,
    image: '/DAJ_4366.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 6,
    name: 'Groom Accessory Box',
    price: 4999,
    brand: 'Manyavar',
    category: 'Accessories',
    colour: 'Gold',
    colourHex: '#c9a227',
    rating: 5,
    image: '/DAJ_4366.jpg',
    sizes: ['Free Size'],
  },
];

const initialFilters = {
  categories: [],
  brands: [],
  sizes: [],
  colours: [],
  maxPrice: Math.max(...products.map((product) => product.price)),
};

const sizeOrder = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11'];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'name-a-z', label: 'Name: A to Z' },
];

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
    if (!product.colour) return acc;
    acc[product.colour] = {
      value: product.colour,
      label: product.colour,
      hex: product.colourHex || '#d8d8d8',
      count: (acc[product.colour]?.count || 0) + 1,
    };
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
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('featured');
  const [activeSizePopup, setActiveSizePopup] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const selectedProductSizes = useSelector((state) => state.sizes.selectedSizes);

  const priceBounds = useMemo(() => ({
    min: Math.min(...products.map((product) => product.price)),
    max: Math.max(...products.map((product) => product.price)),
  }), []);

  const filterOptions = useMemo(() => getFilterOptions(products), []);
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
      price: product.price,
      image: product.image,
    }));
    dispatch(showToast({ message: 'Item added to wishlist', type: 'success' }));
  };

  const toggleCart = (product) => {
    const selectedSize = selectedProductSizes[product.id];
    if (!selectedSize) {
      dispatch(showToast({ message: 'Please select size first', type: 'error' }));
      return;
    }

    const isInCart = cartItems.some((item) => item.id === product.id && item.size === selectedSize);

    if (isInCart) {
      dispatch(removeItem({ id: product.id, size: selectedSize }));
      dispatch(removeSelectedSize(product.id));
      dispatch(showToast({ message: 'Item removed from cart', type: 'success' }));
      return;
    }

    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    }));
    dispatch(showToast({ message: 'Item added to cart', type: 'success' }));
  };

  const handleSizeSelection = (product, size) => {
    dispatch(setSelectedSize({ productId: product.id, size }));

    const alreadyInCart = cartItems.some((item) => item.id === product.id && item.size === size);
    if (alreadyInCart) {
      setActiveSizePopup(null);
      dispatch(showToast({ message: 'This size is already in your cart', type: 'info' }));
      return;
    }

    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      quantity: 1,
    }));
    setActiveSizePopup(null);
    dispatch(showToast({ message: 'Size selected and added to cart', type: 'success' }));
  };

  const handleCartClick = (product) => {
    const selectedSize = selectedProductSizes[product.id];
    if (!selectedSize) {
      setActiveSizePopup(product.id);
      return;
    }
    toggleCart(product);
  };

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
    const matchBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const matchSize = filters.sizes.length === 0 || product.sizes.some((size) => filters.sizes.includes(size));
    const matchColour = filters.colours.length === 0 || filters.colours.includes(product.colour);
    const matchPrice = product.price <= filters.maxPrice;

    return matchCategory && matchBrand && matchSize && matchColour && matchPrice;
  }), [filters]);

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
                            onClick={() => router.push(`/shop/${product.id}`)}
                          />
                          <div className="hover-actions">
                            <button type="button" onClick={() => toggleWishlist(product)}>
                              {isInWishlist ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                            </button>
                            <button type="button" onClick={() => handleCartClick(product)}>
                              {isInCart ? <FaShoppingBag className="text-danger" /> : <IoBagOutline />}
                            </button>
                            <Link href={`/shop/${product.id}`}>
                              <FaSearchPlus />
                            </Link>
                          </div>
                        </div>

                        <div className="product-content">
                          <h3>{product.name}</h3>
                          <div className="product-rating">*****</div>
                          <p>Rs {product.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {sortedProducts.length === 0 && (
              <div className="empty-filter-state">
                No products match these filters. Clear one filter and try again.
              </div>
            )}

            {activeProduct && (
              <div className="size-select-modal-overlay" onClick={() => setActiveSizePopup(null)}>
                <div className="size-select-modal" onClick={(event) => event.stopPropagation()}>
                  <div className="size-select-modal-header">
                    <div>
                      <span className="modal-cta">Choose your size</span>
                      <p className="modal-subtitle">Tap a size to add this product to your cart instantly.</p>
                    </div>
                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={() => setActiveSizePopup(null)}
                      aria-label="Close size selector"
                    >
                      x
                    </button>
                  </div>
                  <div className="size-select-modal-body">
                    <img src={activeProduct.image} alt={activeProduct.name} className="size-select-image" />
                    <div className="size-select-copy">
                      <span className="product-brand">{activeProduct.brand}</span>
                      <h3>{activeProduct.name}</h3>
                      <p className="product-price">Rs {activeProduct.price}</p>
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
                    <p className="size-select-hint">Need help choosing? Pick the size that fits and the item will be added right away.</p>
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
