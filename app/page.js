'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaTruck, FaShieldAlt, FaUndoAlt, FaHeart, FaRegHeart, FaShoppingBag, FaSearchPlus } from 'react-icons/fa';
import { IoBagOutline } from 'react-icons/io5';
import { Sparkles, CheckCircle, ShieldCheck, Box, Gem, ArrowLeft, RefreshCw } from 'lucide-react';
import OccasionShop from '../components/OccasionShop';
import Banner from '../components/Banner';
import { fetchPageBySlugApi, fetchProductsApi, fetchSubcategoriesApi, fetchBlogsApi } from '../store/apiService';
import { getImageUrl, getMediaUrl } from '../store/apiConfig';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishList';
import { showToast } from '../store/slices/toastSlice';
import { addCartItem, fetchCart, removeItem } from '../store/slices/cartSlice';
import { setSelectedSize, removeSelectedSize } from '../store/slices/sizeSlice';

import './stylefile/app.css';
import '../components/shopage.css';
import './pages/[slug]/cmspage.css';
import './stylefile/blog.css';

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



const collections = [
  { title: 'Wedding', description: 'Regal sherwanis, bandhgalas, and groom wear for the most special day.', href: '/shop', badge: 'New' },
  { title: 'Festive', description: 'Bright, handcrafted kurtas and festive sets for celebrations.', href: '/shop', badge: 'Popular' },
  { title: 'Essentials', description: 'Daily tradition with contemporary comfort for modern lives.', href: '/shop', badge: 'Trending' },
];

const lookbook = [
  { title: 'Suit', subtitle: 'Classic tailoring for modern gentlemen', href: '/shop', img: '/DAJ_3969.jpg' },
  { title: 'Koti', subtitle: 'Traditional layers with timeless elegance', href: '/shop', img: '/DAJ_4110.jpg' },
  { title: 'Indo Westerns', subtitle: 'Fusion styles for weddings and parties', href: '/shop', img: '/DAJ_4366.jpg' },
  { title: 'Sherwani', subtitle: 'Royal ethnic wear for groom collection', href: '/shop', img: '/DAJ_4613.jpg' },
  { title: 'Suiting Fabrics', subtitle: 'Premium fabrics crafted for perfection', href: '/shop', img: '/DAJ_4315.jpg' },
  { title: 'Ethnic Fabrics', subtitle: 'Traditional textures with rich craftsmanship', href: '/shop', img: '/DAJ_4470.jpg' },
  { title: 'Kurta', subtitle: 'Festive essentials for every occasion', href: '/shop', img: '/DAJ_4661.jpg' },
  { title: 'Bomber Jacket', subtitle: 'Contemporary outerwear with bold style', href: '/shop', img: '/DAJ_4220.jpg' },
  { title: 'Hunter Suit', subtitle: 'Sharp statement outfits with luxury finish', href: '/shop', img: '/DAJ_4757.jpg' },
  { title: 'Shirt', subtitle: 'Everyday sophistication in every fit', href: '/shop', img: '/DAJ_4776.jpg' },
  { title: 'Hoodies', subtitle: 'Comfort meets effortless street fashion', href: '/shop', img: '/DAJ_4587.jpg' },
  { title: 'Sweatshirts', subtitle: 'Relaxed styles for casual layering', href: '/shop', img: '/DAJ_4790.jpg' },
  { title: 'Jeans', subtitle: 'Modern denim designed for versatility', href: '/shop', img: '/DAJ_3863.jpg' },
  { title: 'Formal Trousers', subtitle: 'Tailored fits for refined dressing', href: '/shop', img: '/DAJ_4291.jpg' },
  { title: 'Chinos', subtitle: 'Smart casual essentials for daily wear', href: '/shop', img: '/DAJ_4110.jpg' },
  { title: 'Tie', subtitle: 'Elegant finishing touch for formal looks', href: '/shop', img: '/DAJ_3969.jpg' },
  { title: 'Belts', subtitle: 'Premium accessories with timeless appeal', href: '/shop', img: '/DAJ_4220.jpg' },
];

const highlights = [
  { title: 'Free shipping over Rs 1,999', description: 'Fast delivery across India.', icon: <FaTruck /> },
  { title: 'Easy returns', description: 'Hassle-free exchange & return support.', icon: <FaUndoAlt /> },
  { title: 'Gift packaging', description: 'Special festive wrap for celebrations.', icon: <FaShieldAlt /> },
];

const transformApiProduct = (apiProd) => {
  const price = parseFloat(apiProd.base_price || 0);
  const categoryName = apiProd.categories?.[0]?.name || 'Necklace';
  const brandName = apiProd.brand?.name || 'General';
  const rawImageUrl = apiProd.galleries?.[0]?.image_url || '/DAJ_4366.jpg';
  const imageUrl = getImageUrl(rawImageUrl);

  const sizes = Array.from(new Set(
    apiProd.variants?.flatMap(v =>
      v.attribute_values?.filter(av => av.attribute_id === 1).map(av => av.value) || []
    ) || []
  ));
  if (sizes.length === 0) {
    sizes.push('Free Size');
  }

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

const findVariantBySize = (product, size) => {
  const variants = product.originalProduct?.variants || [];
  if (variants.length === 0) return null;

  return variants.find((variant) => {
    const variantSize = variant.attribute_values?.find((attribute) => attribute.attribute_id === 1)?.value;
    return variantSize === size;
  }) || variants[0];
};

const renderIcon = (iconName) => {
  if (!iconName) return <Sparkles size={24} />;
  const lower = iconName.toLowerCase();
  if (lower.includes('patch-check') || lower.includes('check')) return <CheckCircle size={24} />;
  if (lower.includes('gem') || lower.includes('diamond')) return <Gem size={24} />;
  if (lower.includes('shield') || lower.includes('lock')) return <ShieldCheck size={24} />;
  if (lower.includes('box') || lower.includes('shipping') || lower.includes('seam')) return <Box size={24} />;
  return <Sparkles size={24} />;
};

export default function HomePage() {
  const [cmsData, setCmsData] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const [cmsLoading, setCmsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [activeSizePopup, setActiveSizePopup] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const selectedProductSizes = useSelector((state) => state.sizes.selectedSizes);

  useEffect(() => {
    const loadCms = async () => {
      try {
        const response = await fetchPageBySlugApi('home');
        setCmsData(response.data || response);
      } catch (err) {
        console.error('Failed to load home page CMS data:', err);
      } finally {
        setCmsLoading(false);
      }
    };

    const loadProducts = async () => {
      try {
        const [featuredRes, bestSellingRes, trendingRes] = await Promise.all([
          fetchProductsApi({ per_page: 8, include_filters: true, brand_id: 1, type: 'featured' }),
          fetchProductsApi({ per_page: 8, include_filters: true, brand_id: 1, type: 'best_selling' }),
          fetchProductsApi({ per_page: 8, include_filters: true, brand_id: 1, type: 'trending' }),
        ]);

        const featItems = (featuredRes.products?.data || featuredRes.data?.products?.data || []).map(transformApiProduct);
        const bestItems = (bestSellingRes.products?.data || bestSellingRes.data?.products?.data || []).map(transformApiProduct);
        const trendItems = (trendingRes.products?.data || trendingRes.data?.products?.data || []).map(transformApiProduct);

        setFeaturedProducts(featItems);
        setBestSellingProducts(bestItems);
        setTrendingProducts(trendItems);
      } catch (err) {
        console.error('Failed to load homepage collection products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    const loadSubcategories = async () => {
      try {
        const data = await fetchSubcategoriesApi();
        setSubcategories(data || []);
      } catch (err) {
        console.error('Failed to load subcategories:', err);
      }
    };

    const loadBlogs = async () => {
      try {
        const response = await fetchBlogsApi();
        const list = response?.blogs || (Array.isArray(response) ? response : []);
        setBlogs(list.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page blogs:', err);
      } finally {
        setBlogsLoading(false);
      }
    };

    loadCms();
    loadProducts();
    loadSubcategories();
    loadBlogs();
  }, []);

  useEffect(() => {
    if (cmsData?.page?.meta_title) {
      document.title = `${cmsData.page.meta_title} | Manyavar`;
    }
  }, [cmsData]);

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
      dispatch(showToast({ message: 'Please select size first', type: 'error' }));
      return;
    }
    const isInCart = cartItems.some(item => item.id === product.id && item.size === selectedSize);
    if (isInCart) {
      dispatch(removeItem({ id: product.id, size: selectedSize }));
      dispatch(removeSelectedSize(product.id));
      dispatch(showToast({ message: 'Item removed from cart', type: 'success' }));
      return;
    }

    try {
      const variant = findVariantBySize(product, selectedSize);
      if (!variant?.id) {
        dispatch(showToast({ message: 'Variant not available', type: 'error' }));
        return;
      }
      await dispatch(addCartItem({
        id: product.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: Number(variant.price || product.price),
        size: selectedSize,
        quantity: 1
      })).unwrap();
      dispatch(fetchCart());
      dispatch(showToast({ message: 'Item added to cart', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: err || 'Unable to add', type: 'error' }));
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

  const activeProductsList = useMemo(() => {
    if (activeTab === 'featured') return featuredProducts;
    if (activeTab === 'best_selling') return bestSellingProducts;
    return trendingProducts;
  }, [activeTab, featuredProducts, bestSellingProducts, trendingProducts]);

  const activeProduct = activeSizePopup ? activeProductsList.find((p) => p.id === activeSizePopup) : null;

  // Extract hero image/text section dynamically from page CMS data
  const heroSection = cmsData?.page?.sections?.find(
    (s) => s.type === 'image_text' && s.status
  );

  const heroTitle = heroSection?.content?.title || "Celebrate every moment in style.";
  const heroBody = heroSection?.content?.body || "<p>Shop premium ethnic wear for weddings, festivals and special occasions with curated looks crafted for today.</p>";
  const heroImage = heroSection?.content?.image_url ? getImageUrl(heroSection.content.image_url) : "/DAJ_3863.jpg";
  const heroSide = heroSection?.content?.side || "right";

  return (
    <main>
      {cmsData?.page?.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: cmsData.page.schema_markup }}
        />
      )}

      {/* Hero Banner Section */}
      {cmsData?.banner && cmsData.banner.status ? (
        <section className="banner-section">
          <div className="banner-slider-container">
            <div className="banner-media-wrapper">
              {cmsData.banner.video_path ? (
                <video
                  className="banner-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  key={cmsData.banner.id}
                >
                  <source src={getMediaUrl(cmsData.banner.video_path)} type="video/mp4" />
                </video>
              ) : cmsData.banner.image_path ? (
                <img
                  className="banner-video"
                  src={getImageUrl(cmsData.banner.image_path)}
                  alt={cmsData.banner.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : null}

              <div className="banner-overlay">
                <div className="banner-content">
                  {cmsData.banner.subtitle && (
                    <p className="banner-subtitle">{cmsData.banner.subtitle}</p>
                  )}
                  <h1 className="banner-title">{cmsData.banner.title}</h1>
                  {cmsData.banner.cta_text && cmsData.banner.cta_link && (
                    <Link href={cmsData.banner.cta_link} className="banner-cta-btn">
                      {cmsData.banner.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Banner />
      )}

      <section className="hero-banner">
        <div className="container-lg py-5">
          <div className={`row align-items-center g-4 ${heroSide === 'left' ? 'flex-row-reverse' : ''}`}>
            <div className="col-lg-6 mb-4 mb-lg-0 hero-section">
              <span className="badge-custom">DISCOVER NEW ARRIVALS</span>
              <h1>{heroTitle}</h1>
              {heroBody && heroBody.startsWith('<') ? (
                <div dangerouslySetInnerHTML={{ __html: heroBody }} />
              ) : (
                <p>{heroBody}</p>
              )}
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <Link href="/shop" className="btn-primary-custom">Shop Now</Link>
                <Link href="/about" className="btn-secondary-custom">Learn More</Link>
              </div>
            </div>
            <div className="col-lg-6 px-3 d-flex align-items-center justify-content-center hero-image-wrapper">
              <Image
                src={heroImage}
                alt={heroTitle || "Premium ethnic wear collection"}
                width={500}
                height={550}
                className="img-fluid w-100 hero-banner-img"
                style={{ maxHeight: '550px', objectFit: 'cover', borderRadius: '8px' }}
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
      </section>



      {/* Product tabs collection section */}
      <section className="section-featured" style={{ background: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container-lg">
          <div className="text-center mb-4">
            <p className="section-title">Exclusive Collections</p>
            <h2 className="section-heading">Shop Our Best Ensembles</h2>
          </div>

          <div style={tabsContainerStyle}>
            <button
              onClick={() => setActiveTab('featured')}
              style={tabBtnStyle(activeTab === 'featured')}
            >
              Featured
              {activeTab === 'featured' && <div style={tabUnderlineStyle} />}
            </button>
            <button
              onClick={() => setActiveTab('best_selling')}
              style={tabBtnStyle(activeTab === 'best_selling')}
            >
              Best Selling
              {activeTab === 'best_selling' && <div style={tabUnderlineStyle} />}
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              style={tabBtnStyle(activeTab === 'trending')}
            >
              Trending
              {activeTab === 'trending' && <div style={tabUnderlineStyle} />}
            </button>
          </div>

          {productsLoading ? (
            <div className="row g-3 product-grid">
              {[1, 2, 3, 4].map((i) => (
                <div className="col-xl-3 col-lg-4 col-md-6 col-6" key={i}>
                  <div className="shimmer-card">
                    <div className="shimmer-block shimmer-card-image" style={{ height: '240px', width: '100%' }} />
                    <div className="shimmer-block shimmer-card-line title" style={{ height: '14px', width: '75%', marginTop: '12px' }} />
                    <div className="shimmer-block shimmer-card-line price" style={{ height: '14px', width: '40%', marginTop: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : activeProductsList.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No products found in this collection.
            </div>
          ) : (
            <div className="row g-3 product-grid">
              {activeProductsList.map((product) => {
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
                          style={{ height: '240px', objectFit: 'cover', width: '100%', cursor: 'pointer' }}
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
                        <h3 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}>{product.name}</h3>
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
          )}
        </div>
      </section>

      <OccasionShop />

      <section className="collections-section">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="section-title">Discover the range</p>
            <h2 className="section-heading">Shop by collection</h2>
          </div>
          <div className="row g-4">
            {collections.map((item) => (
              <div key={item.title} className="col-md-4">
                <div className="collection-card">
                  <span className="collection-badge">{item.badge}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link href={item.href}>Browse {item.title} -</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lookbook-section">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="section-title">Our Editorial</p>
            <h2 className="section-heading">Insights & Care Guides</h2>
            <p className="section-description">Discover diamond care tips, styling inspiration, and trends from our design desk.</p>
          </div>

          {blogsLoading ? (
            <div className="lookbook-scroll-container">
              <div className="lookbook-scroll-wrapper" style={{ '--num-items': 3, '--scroll-dist': '1020px', '--scroll-dist-mobile': '900px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="lookbook-card">
                    <div className="shimmer-block" style={{ height: '280px', width: '100%' }} />
                    <div className="lookbook-card-content">
                      <div className="shimmer-block" style={{ height: '12px', width: '30%', marginBottom: '8px' }} />
                      <div className="shimmer-block" style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
                      <div className="shimmer-block" style={{ height: '12px', width: '90%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No blog articles found.
            </div>
          ) : (
            <div className="lookbook-scroll-container">
              <div
                className="lookbook-scroll-wrapper"
                style={{
                  '--num-items': blogs.length,
                  '--scroll-dist': `${blogs.length * 340}px`,
                  '--scroll-dist-mobile': `${blogs.length * 300}px`
                }}
              >
                {blogs.concat(blogs).map((blog, index) => {
                  const title = blog.title;
                  const dateStr = blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
                  const img = getImageUrl(blog.featured_image) || '/DAJ_4366.jpg';
                  const href = `/blogs/${blog.slug}`;

                  return (
                    <div key={`${blog.id}-${index}`} className="lookbook-card" onClick={() => router.push(href)}>
                      <img src={img} alt={title} className="object-cover" />
                      <div className="lookbook-card-content">
                        <span style={{ fontSize: '11px', color: '#bf8a52', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                          {dateStr}
                        </span>
                        <h4 style={{ minHeight: '48px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '15px', color: '#1a1a1a', fontWeight: '600' }}>
                          {title}
                        </h4>
                        <p className="subtitle" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', fontSize: '13px', margin: '6px 0 12px 0' }}>
                          {blog.summary}
                        </p>
                        <Link href={href} style={{ color: '#bf8a52', fontWeight: '600', textDecoration: 'none' }}>
                          Read Article -
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <Link href="/blogs" className="btn-primary-custom">Explore Now</Link>
          </div>
        </div>
      </section>

      {/* Dynamic CMS Sections or Hardcoded Highlights Fallback */}
      {/* {cmsData?.page?.sections && cmsData.page.sections.filter(s => s.status).length > 0 ? (
        cmsData.page.sections
          .filter(s => {
            if (!s.status) return false;
            const title = s.content?.title?.trim()?.toLowerCase();
            if (
              title === 'crafted with precision & passion' ||
              title === 'luxury iced-out cuban link statement necklace'
            ) {
              return false;
            }
            return true;
          })
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((section) => {
            switch (section.type) {
              case 'rich_text':
                if (!section.content?.body) return null;
                return (
                  <div key={section.id} className="cms-section">
                    <div className="rich-text-wrapper" dangerouslySetInnerHTML={{ __html: section.content.body }} />
                  </div>
                );

              case 'feature_grid':
                if (!section.content?.features || section.content.features.length === 0) return null;
                return (
                  <section key={section.id} className="highlights-section">
                    <div className="container-lg">
                      {section.content?.headline && <h3 className="feature-grid-title text-center mb-4">{section.content.headline}</h3>}
                      <div className="row g-4">
                        {section.content.features.map((feat, idx) => (
                          <div key={idx} className="col-md-3 col-6">
                            <div className="highlight-card">
                              <div className="highlight-icon">
                                {renderIcon(feat.icon)}
                              </div>
                              <div className="highlight-content">
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case 'image_text':
                if (!section.content?.title) return null;
                return (
                  <section key={section.id} className="cms-section" style={{ background: '#faf8f5', padding: '60px 0' }}>
                    <div className="container-lg">
                      <div className={`image-text-block ${section.content?.side || 'left'}`}>
                        <div className="image-text-media">
                          <img src={getImageUrl(section.content?.image_url)} alt={section.content?.title} className="image-text-img" style={{ borderRadius: '8px' }} />
                        </div>
                        <div className="image-text-content">
                          <h3 className="image-text-title" style={{ fontSize: '28px', fontWeight: 700, color: '#3e332a', marginBottom: '20px' }}>{section.content?.title}</h3>
                          <div className="image-text-body" style={{ color: '#666', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: section.content?.body }} />
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case 'testimonial_grid':
                if (!section.content?.testimonials || section.content.testimonials.length === 0) return null;
                return (
                  <section key={section.id} className="cms-section" style={{ background: '#fff', padding: '60px 0' }}>
                    <div className="container-lg">
                      <div className="text-center mb-5">
                        <p className="section-title">Reviews</p>
                        <h2 className="section-heading">What Our Clients Say</h2>
                      </div>
                      <div className="testimonial-grid">
                        {section.content.testimonials.map((test, idx) => (
                          <div key={idx} className="testimonial-card">
                            <div className="testimonial-quote-icon">“</div>
                            <p className="testimonial-text">{test.text}</p>
                            <div className="testimonial-author">
                              <div className="testimonial-avatar">
                                {test.name ? test.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="testimonial-name">{test.name}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case 'video_block':
                return null;

              default:
                return null;
            }
          })
      ) : (
        <section className="highlights-section">
          <div className="container-lg">
            <div className="row g-4">
              {highlights.map((item) => (
                <div key={item.title} className="col-md-4">
                  <div className="highlight-card">
                    <div className="highlight-icon">
                      {item.icon}
                    </div>
                    <div className="highlight-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

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
    </main>
  );
}

/* ============================
   Inline Styles for Product Tabs
   ============================ */

const tabsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  marginBottom: '35px',
  borderBottom: '2px solid #eae1d4',
  paddingBottom: '10px',
};

const tabBtnStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  fontSize: '17px',
  fontWeight: isActive ? '700' : '600',
  color: isActive ? '#bf8a52' : '#888',
  padding: '6px 12px',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.25s ease',
  outline: 'none',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const tabUnderlineStyle = {
  position: 'absolute',
  bottom: '-12px',
  left: '0',
  width: '100%',
  height: '3px',
  backgroundColor: '#bf8a52',
  borderRadius: '2px',
};
