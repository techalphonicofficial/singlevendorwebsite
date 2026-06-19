'use client';

import { useState, useEffect, useMemo } from 'react';
// import Image from "next/image";
import Link from 'next/link';
import { useRef } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaTruck, FaShieldAlt, FaUndoAlt, FaHeart, FaRegHeart, FaShoppingBag, FaSearchPlus } from 'react-icons/fa';
import { IoBagOutline } from 'react-icons/io5';
import { Sparkles, CheckCircle, Box, Gem, ArrowLeft, RefreshCw } from 'lucide-react';
import OccasionShop from '../components/OccasionShop';
import Banner from '../components/Banner';
import { fetchPageBySlugApi, fetchProductsApi, fetchSubcategoriesApi, fetchBlogsApi, fetchFaqsApi, fetchCategoriesApi } from '../store/apiService';
import { getImageUrl, getMediaUrl } from '../store/apiConfig';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishList';
import { showToast } from '../store/slices/toastSlice';
import { addCartItem, fetchCart, removeItem } from '../store/slices/cartSlice';
import { setSelectedSize, removeSelectedSize } from '../store/slices/sizeSlice';
// import { useState } from "react";
import { Heart } from "lucide-react";
import {
  Truck,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
// import '../component/mainpage.css';

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

const products = [
  {
    id: 1,
    image: "/DAJ_3969.jpg",
    title: "Turquoise Blue Silk Kurta Set with Nature-Inspired Embroidery",
    price: "19,995",
    badge: "Bestsellers",
    shipping: true
  },
  {
    id: 2,
    image: "/DAJ_3863.jpg",
    title: "Rust Red Muslin Cotton Indo-Western Suit with Zardozi Work",
    price: "23,995",
    badge: "New Arrival",
  },
  {
    id: 3,
    image: "/DAJ_4587.jpg",
    title: "Blush Pink Jacquard Embroidered Bandhgala Set",
    price: "17,995",
    badge: "Bestsellers",
  },
  {
    id: 4,
    image: "/DAJ_4220.jpg",
    title: "Mehendi Green Pure Chiffon Saree with Zari Floral Work",
    price: "9,495",
    badge: "Online Exclusive",
  },
  {
    id: 5,
    image: "/DAJ_4315.jpg",
    title: "Wine Silk Embroidered Kurta Set",
    price: "20,995",
    badge: "Bestsellers",
  },
];



const vibeCollections = [
  {
    title: 'Statement Edit',
    href: '/shop',
    image: '/DAJ_3863.jpg',
  },
  {
    title: 'Minimal & Modern',
    href: '/shop',
    image: '/DAJ_4613.jpg',
  },
  {
    title: 'Mehendi To Mandap',
    href: '/shop',
    image: '/DAJ_4661.jpg',
  },
  {
    title: 'Festive Fits',
    href: '/shop',
    image: '/DAJ_4366.jpg',
  },
  {
    title: 'Luxe Under Budget',
    href: '/shop',
    image: '/DAJ_4757.jpg',
  },
];

const collections = [
  {
    title: 'Wedding',
    description: 'Regal sherwanis, bandhgalas, and groom wear for the most special day.',
    href: '/shop',
    badge: 'New',
    image: '/DAJ_3863.jpg',
  },
  {
    title: 'Festive',
    description: 'Bright, handcrafted kurtas and festive sets for celebrations.',
    href: '/shop',
    badge: 'Popular',
    image: '/DAJ_4110.jpg',
  },
  {
    title: 'Essentials',
    description: 'Daily tradition with contemporary comfort for modern lives.',
    href: '/shop',
    badge: 'Trending',
    image: '/DAJ_4470.jpg',
  },
  {
    title: 'Wedding',
    description: 'Regal sherwanis, bandhgalas, and groom wear for the most special day.',
    href: '/shop',
    badge: 'New',
    image: '/DAJ_3863.jpg',
  },
  {
    title: 'Festive',
    description: 'Bright, handcrafted kurtas and festive sets for celebrations.',
    href: '/shop',
    badge: 'Popular',
    image: '/DAJ_4110.jpg',
  },
  {
    title: 'Essentials',
    description: 'Daily tradition with contemporary comfort for modern lives.',
    href: '/shop',
    badge: 'Trending',
    image: '/DAJ_4470.jpg',
  },
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


const categories = [
  {
    title: "Kurtis",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300"
  },
  {
    title: "Suits",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300"
  },
  {
    title: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300"
  },
  {
    title: "Lehengas",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300"
  },
  {
    title: "Co-Ord Sets",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300"
  },
  {
    title: "Bestsellers",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=300"
  },

];

const fallbackFaqs = [
  {
    question: "What makes Fitstory the best fitness platform?",
    answer:
      "Fitstory helps you achieve your fitness goals with personalized plans, expert guidance, and effective workout solutions."
  },
  {
    question: "Is Fitstory suitable for beginners?",
    answer:
      "Yes, Fitstory provides beginner-friendly fitness programs designed according to your fitness level and goals."
  },
  {
    question: "What services does Fitstory offer?",
    answer:
      "Fitstory offers workout programs, fitness guidance, health tips, and lifestyle improvement solutions."
  },
  {
    question: "Can I follow Fitstory workouts at home?",
    answer:
      "Yes, Fitstory provides flexible workout routines that can be followed at home without complicated equipment."
  },
  {
    question: "Does Fitstory provide personalized fitness plans?",
    answer:
      "Yes, personalized fitness plans are created based on your body goals and requirements."
  },
  {
    question: "How can Fitstory help me stay consistent?",
    answer:
      "Fitstory helps you stay motivated with structured plans, progress tracking, and fitness guidance."
  },
  {
    question: "Are Fitstory programs suitable for weight loss?",
    answer:
      "Yes, Fitstory offers fitness approaches that support weight management and healthy lifestyle goals."
  },
  {
    question: "How do I start my fitness journey with Fitstory?",
    answer:
      "You can start by exploring Fitstory programs and choosing the plan that matches your fitness needs."
  }
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
  const fallbackSubcategories = useMemo(() => [
    {
      id: 11,
      title: "Casual Shirts",
      slug: "casual-shirts",
      image: getImageUrl("https://mybiography.in/storage/uploads/categories/cjomBqxLBHl0bPw0Or96.jpg"),
      href: "/shop?category=Casual%20Shirts"
    },
    {
      id: 12,
      title: "Formal Shirts",
      slug: "formal-shirts",
      image: "/DAJ_4776.jpg",
      href: "/shop?category=Formal%20Shirts"
    },
    {
      id: 13,
      title: "Sweatshirts",
      slug: "sweatshirts",
      image: "/DAJ_4790.jpg",
      href: "/shop?category=Sweatshirts"
    },
    {
      id: 15,
      title: "Suits",
      slug: "suits",
      image: getImageUrl("https://mybiography.in/storage/uploads/categories/ogho5auyqSU3MTCL7ntg.jpg"),
      href: "/shop?category=Suits"
    },
    {
      id: 33,
      title: "Sherwani",
      slug: "sherwani",
      image: getImageUrl("https://mybiography.in/storage/uploads/categories/ohVWGl8xGoKpMo1kZUNN.jpg"),
      href: "/shop?category=Sherwani"
    }
  ], []);
  const [subcategories, setSubcategories] = useState(fallbackSubcategories);
  const fallbackExclusiveCategories = useMemo(() => [
    {
      name: "The Bridal Edit",
      image_url: null,
      badge: "NEW IN"
    },
    {
      name: "Online Exclusive",
      image_url: null,
      badge: "HANDPICKED STYLES"
    },
    {
      name: "Timeless Sarees",
      image_url: null,
      badge: "EDITOR'S PICKS"
    }
  ], []);
  const [exclusiveCategories, setExclusiveCategories] = useState(fallbackExclusiveCategories);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [activeFaq, setActiveFaq] = useState(null);

  const [cmsLoading, setCmsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [activeSizePopup, setActiveSizePopup] = useState(null);


  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const selectedProductSizes = useSelector((state) => state.sizes.selectedSizes);
  const scrollRef = useRef(null);


  const scrollByCard = (direction) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector('.collection-card');
    const cardWidth = card ? card.offsetWidth + 24 : 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

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
        const apiData = data || [];

        let listToMap = [];
        if (apiData.children && apiData.children.length > 0) {
          listToMap = apiData.children;
        } else if (Array.isArray(apiData)) {
          const weddingCat = apiData.find(c => c.id === 8 || c.name?.toUpperCase() === 'WEDDING');
          if (weddingCat && weddingCat.children && weddingCat.children.length > 0) {
            listToMap = weddingCat.children;
          } else {
            listToMap = apiData;
          }
        }

        if (listToMap.length > 0) {
          const mapped = listToMap.map((sub, index) => {
            const name = sub.name || "";
            let image = sub.image_url ? getImageUrl(sub.image_url) : '';
            if (!image) {
              const lower = name.toLowerCase();
              if (lower.includes('sherwani')) image = '/DAJ_4613.jpg';
              else if (lower.includes('suit')) image = '/DAJ_3969.jpg';
              else if (lower.includes('sweatshirt')) image = '/DAJ_4790.jpg';
              else if (lower.includes('shirt')) image = '/DAJ_4776.jpg';
              else image = '/DAJ_3863.jpg';
            }
            return {
              id: sub.id,
              title: name,
              slug: sub.slug || "",
              image: image,
              href: `/shop?category=${encodeURIComponent(name)}`
            };
          });
          setSubcategories(mapped);
        } else {
          setSubcategories(fallbackSubcategories);
        }
      } catch (err) {
        console.error('Failed to load subcategories:', err);
        setSubcategories(fallbackSubcategories);
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

    const loadFaqs = async () => {
      try {
        const response = await fetchFaqsApi();
        const list = response?.data || response || [];
        if (Array.isArray(list) && list.length > 0) {
          setFaqs(list);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesApi();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = [0, 1, 2].map((idx) => {
            const apiCat = data[idx];
            const fallbackCat = fallbackExclusiveCategories[idx];
            return {
              name: apiCat?.name || fallbackCat.name,
              image_url: apiCat?.image_url || fallbackCat.image_url,
              badge: fallbackCat.badge
            };
          });
          setExclusiveCategories(mapped);
        }
      } catch (err) {
        console.error('Failed to load categories for exclusive section:', err);
      }
    };

    loadCms();
    loadProducts();
    loadSubcategories();
    loadBlogs();
    loadFaqs();
    loadCategories();
  }, []);

  useEffect(() => {
    if (cmsData?.page?.meta_title) {
      document.title = `${cmsData.page.meta_title} | fitstoryandco`;
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

  // const handleWishlistClick = (product, isDynamic) => {
  //   if (isDynamic) {
  //     toggleWishlist(product);
  //   } else {
  //     toggleWishlist({
  //       id: product.id,
  //       name: product.title,
  //       slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  //       price: parseFloat(product.price.replace(/,/g, '')),
  //       image: product.image
  //     });
  //   }
  // };

  const handleProductClick = (slug) => {
    if (slug) {
      router.push(`/shop/${slug}`);
    } else {
      router.push('/shop');
    }
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
  const cat1 = exclusiveCategories[0] || { name: "The Bridal Edit", image_url: null, badge: "NEW IN" };
  const cat2 = exclusiveCategories[1] || { name: "Online Exclusive", image_url: null, badge: "HANDPICKED STYLES" };
  const cat3 = exclusiveCategories[2] || { name: "Timeless Sarees", image_url: null, badge: "EDITOR'S PICKS" };

  const cat1Image = cat1.image_url ? getImageUrl(cat1.image_url) : heroImage;
  const cat2Image = cat2.image_url ? getImageUrl(cat2.image_url) : heroImage;
  const cat3Image = cat3.image_url ? getImageUrl(cat3.image_url) : heroImage;

  const cat1Link = cat1.name ? `/shop?category=${encodeURIComponent(cat1.name)}` : "/shop";
  const cat2Link = cat2.name ? `/shop?category=${encodeURIComponent(cat2.name)}` : "/shop";
  const cat3Link = cat3.name ? `/shop?category=${encodeURIComponent(cat3.name)}` : "/shop";

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


      {/* Subcategory */}
      <section className="category-section">

        <div className="container-fluid px-0">

          <div className="category-list">

            {subcategories.map((item, index) => (

              <Link href={item.href} key={item.id || index} className="category-item text-decoration-none">

                <div className="category-img">

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={150}
                    height={150}
                    unoptimized
                  />

                </div>

                <p>
                  {item.title}
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* <section className="collection-section">

        <div className="container">

          <div className="collection-grid">

            <div className="collection-card">

              <div className="collection-image">

                <Image
                  src={heroImage}
                  alt="bridal"
                  width={500}
                  height={400}
                />

              </div>


              <span>NEW IN</span>

              <h2>
                The Bridal Edit
              </h2>


              <Link href="/shop">
                SHOP NOW
              </Link>

            </div>




            <div className="collection-card middle-card">

              <div className="collection-image">

                <Image
                  src={heroImage}
                  alt="collection"
                  width={500}
                  height={400}
                />

              </div>


              <span>FEATURED</span>

              <h2>
                Festive Collection
              </h2>


              <Link href="/shop">
                SHOP NOW
              </Link>

            </div>





            <div className="collection-card">


              <div className="collection-image">

                <Image
                  src={heroImage}
                  alt="saree"
                  width={500}
                  height={400}
                />

              </div>


              <span>EDITOR'S PICKS</span>


              <h2>
                Timeless Sarees
              </h2>


              <Link href="/shop">
                SHOP NOW
              </Link>


            </div>



          </div>

        </div>

      </section> */}

      {/* exclusive  */}

      <section className="exclusive-section">

        <div className="container">

          <div className="exclusive-layout">


            {/* LEFT */}

            <div className="side-card">

              <Image
                src={cat1Image}
                alt={cat1.name}
                width={500}
                height={650}
                className="editorial-img border p-3"
                unoptimized
              />


              <span>{cat1.badge}</span>

              <h2>
                {cat1.name}
              </h2>


              <Link href={cat1Link} className="editorial-btn">
                SHOP NOW
              </Link>

            </div>





            {/* CENTER */}

            <div className="middle-card">


              <div className="middle-title">

                <span>
                  {cat2.badge}
                </span>


                <h2>
                  {cat2.name}
                </h2>


                <Link href={cat2Link} className="editorial-btn">
                  SHOP NOW
                </Link>

              </div>



              <Image
                src={cat2Image}
                alt={cat2.name}
                width={600}
                height={450}
                className="middle-img border p-3"
                unoptimized
              />


            </div>





            {/* RIGHT */}


            <div className="side-card">


              <Image
                src={cat3Image}
                alt={cat3.name}
                width={500}
                height={650}
                className="editorial-img border p-3"
                unoptimized
              />



              <span>
                {cat3.badge}
              </span>


              <h2>
                {cat3.name}
              </h2>


              <Link href={cat3Link} className="editorial-btn">
                SHOP NOW
              </Link>


            </div>



          </div>


        </div>

      </section>


      {/* Discover featured collections */}
      <section className="vibe-section">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="vibe-overline">Discover featured collections</p>
            <h2 className="vibe-heading">What&apos;s your vibe?</h2>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .vibe-row-carousel::-webkit-scrollbar {
              display: none;
            }
            .vibe-carousel-item {
              flex: 0 0 auto;
              width: calc((100% - 4 * 10px) / 5);
              min-width: 220px;
            }
            @media (max-width: 992px) {
              .vibe-carousel-item {
                width: calc((100% - 2 * 10px) / 3);
              }
            }
            @media (max-width: 768px) {
              .vibe-carousel-item {
                width: calc((100% - 1 * 10px) / 2);
                min-width: 160px;
              }
            }
          `}} />

          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
            className="vibe-row-carousel"
          >
            {(featuredProducts && featuredProducts.length > 0 ? featuredProducts : vibeCollections).map((product, index) => {
              const isDynamic = !!product.originalProduct;
              const id = isDynamic ? product.id : (product.id || index);
              const name = isDynamic ? product.name : product.title;
              const image = product.image;
              const slug = isDynamic ? product.slug : '';

              const nameWords = name ? name.trim().split(/\s+/) : [];
              const displayName = nameWords.slice(0, 2).join(' ');

              const href = isDynamic ? `/shop/${slug}` : (product.href || '/shop');

              return (
                <div className="vibe-carousel-item" key={id}>
                  <Link href={href} className="vibe-card">
                    <div className="vibe-card-image">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="vibe-img"
                        unoptimized
                      />
                    </div>
                    <h3 className="vibe-card-title">{displayName}</h3>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Product tabs collection section */}
      {/* <section className="section-featured" style={{ background: '#fff', paddingTop: '40px', paddingBottom: '40px' }}>
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
                  <div className="col-xl-3 col-lg-3 col-md-6 col-6  " key={product.id}>
                    <div className="product-card border p-3  ">
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
      </section> */}

      {/* occasion */}
      <OccasionShop />


   


      {/* collection trending red */}
      <section className="collections-section">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="section-title">Discover the range</p>
            <h2 className="section-heading">Shop by Trending collection</h2>
          </div>

          <div className="collections-scroll-wrapper">
            <div className="collections-row" ref={scrollRef}>
              {(trendingProducts && trendingProducts.length > 0 ? trendingProducts : collections).map((item, index) => {
                const isDynamic = !!item.originalProduct;
                const title = isDynamic ? item.name : item.title;
                const image = item.image;
                const href = isDynamic ? `/shop/${item.slug}` : item.href;
                const key = isDynamic ? item.id : (item.title || index);
                const displayTitle = isDynamic
                  ? (title.trim().split(/\s+/).slice(0, 3).join(' ') + (title.trim().split(/\s+/).length > 3 ? '...' : ''))
                  : title;

                return (
                  <div key={key} className="collection-card">
                    <Link href={href} className="collection-card-link">
                      <div className="collection-card-image">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 90vw, 320px"
                          className="collection-img"
                          unoptimized
                        />
                        <div className="collection-card-overlay" />
                      </div>
                      <h3 className="collection-card-title">{displayTitle}</h3>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="collections-nav d-none d-md-flex">
              <button
                type="button"
                className="collections-nav-btn"
                onClick={() => scrollByCard('left')}
                aria-label="Scroll collections left"
              >
                ←
              </button>
              <button
                type="button"
                className="collections-nav-btn"
                onClick={() => scrollByCard('right')}
                aria-label="Scroll collections right"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>


   <section className="men-editor-section">

  <div className="text-center men-editor-heading">

    <p>HANDPICKED STYLES</p>

    <h2>
      Men's Edit
    </h2>

  </div>



  <div className="container-lg">

    <div className="row g-3">


      {/* CARD 1 */}

      <div className="col-lg-6">

        <div className="men-card">


          <img
            src="/DAJ_4790.jpg"
            alt="Men Collection"
          />


          <div className="men-overlay">


            <h3>
              For the Groom
            </h3>


            <p>
              Explore premium sherwanis and wedding
              ensembles crafted with elegance,
              detail, and timeless style.
            </p>


            <Link href="/shop">
  <button>
    SHOP NOW
  </button>
</Link>


          </div>


        </div>

      </div>





      {/* CARD 2 */}

      <div className="col-lg-6">

        <div className="men-card">


          <img
            src="/DAJ_4613.jpg"
            alt="Men Fashion"
          />


          <div className="men-overlay">


            <h3>
              Royal Menswear
            </h3>


            <p>
              Discover refined outfits designed
              for celebrations, occasions, and
              modern gentlemen.
            </p>


            <button>
              SHOP NOW
            </button>


          </div>


        </div>

      </div>



    </div>


  </div>


</section>

      {/* bestseller */}
      <section className="fashion-grid py-4">

        <div className="text-center mb-5">
          <p className="vibe-overline">BESTSELLERS</p>
          <h2 className="vibe-heading">Discover Latest Collections</h2>
        </div>
        <div className="container-fluid px-4">

          <div className="row g-4">

            {(bestSellingProducts && bestSellingProducts.length > 0 ? bestSellingProducts : products).map((product) => {
              const isDynamic = !!product.originalProduct;
              const id = product.id;
              const name = isDynamic ? product.name : product.title;
              const image = product.image;
              const price = isDynamic ? product.price.toLocaleString() : product.price;
              const slug = isDynamic ? product.slug : '';
              const badge = isDynamic ? (product.originalProduct.tags?.[0]?.name || "Bestsellers") : product.badge;
              const isReadyToShip = isDynamic ? (product.originalProduct.is_free_shipping === 1) : product.shipping;
              const isInWishlist = wishlistItems.some((item) => item.id === id);

              return (
                <div className="col-xl-5-custom col-lg-3 col-md-4 col-6" key={id}>

                  <div className="product-card">

                    <div className="product-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(slug)}>

                      {badge && (
                        <span className="product-badge">
                          {badge}
                        </span>
                      )}

                      <button
                        type="button"

                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlistClick(product, isDynamic);
                        }}
                      >
                        {/* {isInWishlist ? '♥' : '♡'} */}
                      </button>

                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="product-image"
                        unoptimized
                      />

                    </div>


                    <div className="product-content">

                      <h3 style={{ cursor: 'pointer' }} onClick={() => handleProductClick(slug)}>
                        {name}
                      </h3>

                      <div className="price">
                        Rs. {price}
                      </div>

                      <div className="product-tags">

                        <span className="tag">
                          🏆 Bestsellers
                        </span>

                        {isReadyToShip && (
                          <span className="tag shipping">
                            🚚 Ready to Ship
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>


          <div className="view-all-wrapper">
           <Link href="/shop">
  <button className="view-all-btn">
    VIEW ALL
  </button>
</Link>
          </div>


        </div>
      </section>


      {/* our editorial */}

      <section className="lookbook-section">
        <div className="container-lg ">

          <div className="text-center lookbook-header">
            <p className="section-title">Our Editorial</p>
            <h2 className="section-heading">
              Insights & Care Guides
            </h2>

            <p className="section-description">
              Discover diamond care tips, styling inspiration, and trends from our design desk.
            </p>
          </div>


          {blogsLoading ? (
            <div className="lookbook-scroll-container">
              <div className="lookbook-scroll-wrapper">
                {[1, 2, 3].map((i) => (
                  <div className="lookbook-card" key={i}>
                    <div className="shimmer-block"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (

            <div className="lookbook-scroll-container  ">

              <div
                className="lookbook-scroll-wrapper"
                style={{
                  '--num-items': blogs.length,
                  '--scroll-dist': `${blogs.length * 340}px`,
                  '--scroll-dist-mobile': `${blogs.length * 300}px`
                }}
              >

                {blogs.concat(blogs).map((blog, index) => {

                  const img =
                    getImageUrl(blog.featured_image) ||
                    '/DAJ_4366.jpg';


                  return (

                    <div
                      key={`${blog.id}-${index}`}
                      className="lookbook-card"
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                    >

                      <div className="image-wrapper">
                        <img
                          src={img}
                          alt={blog.title}
                        />
                      </div>


                      <div className="lookbook-card-content">

                        <span className="blog-date">
                          {blog.published_at &&
                            new Date(blog.published_at)
                              .toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                        </span>


                        <h4>
                          {blog.title}
                        </h4>


                        <p>
                          {blog.summary}
                        </p>


                        <Link href={`/blogs/${blog.slug}`}>
                          Read Article →
                        </Link>

                      </div>

                    </div>

                  )

                })}

              </div>

            </div>

          )}





          <div className="text-center explore-btn">
            <Link href="/blogs">
              Explore Now
            </Link>
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


      {/* insights */}

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

      {/* testimonials */}

      <section className="testimonial-section">
        <div className="container-fluid px-lg-5">

          <div className="section-heading text-center">
            <h2>Client Stories</h2>
            <p >Memory has a Story</p>
          </div>

          <div className="row g-4">

            {/* Testimonial 1 */}
            <div className="col-lg-6">
              <div className="testimonial">

                <div className="testimonial-image">
                  <img
                    src="/DAJ_4366.jpg"
                    alt="Bride Testimonial"
                  />
                </div>

                <div className="testimonial-content">

                  <div className="stars">
                    ★★★★★
                  </div>

                  <p>
                    As a bride, Riyaasat delivered my dream bright red lehenga
                    on time and in perfect condition. Their patience and styling
                    advice were priceless throughout the process.
                  </p>

                  <h4>Anjali Shah</h4>

                  <span>Ahmedabad</span>

                </div>

              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-lg-6 ">
              <div className="testimonial">

                <div className="testimonial-image">
                  <img
                    src="/DAJ_4291.jpg"
                    alt="Groom Testimonial"
                  />
                </div>

                <div className="testimonial-content">

                  <div className="stars">
                    ★★★★★
                  </div>

                  <p>
                    As a groom, Riyaasat gave me a perfectly tailored sherwani
                    that boosted my confidence and style. Attentive service and
                    impeccable craftsmanship made me feel ready for the big day.
                  </p>

                  <h4>Hemal Shah</h4>

                  <span>Surat, Gujarat</span>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>



      {/* blog post */}
      <section className="blog-post-section">

        <div className="container-lg">

          <div className="blog-title text-center">

            <span>STAY UP-TO-DATE</span>

            <h2>
              Blog posts
            </h2>

          </div>



          <div className="blog-grid-2">


            {/* LEFT BIG CARD */}

            {blogs[0] && (

              <div
                className="blog-main-card"
                onClick={() => router.push(`/blogs/${blogs[0].slug}`)}
              >

                <img
                  src={getImageUrl(blogs[0].featured_image)}
                  alt={blogs[0].title}
                />


                <div className="blog-content">

                  <h3>
                    {blogs[0].title}
                  </h3>


                  <Link href={`/blogs/${blogs[0].slug}`}>
                    READ MORE →
                  </Link>

                </div>


              </div>

            )}






            {/* RIGHT SIDE */}

            <div className="blog-side">


              {blogs.slice(1, 3).map((blog) => (

                <div
                  className="blog-small-card"
                  key={blog.id}
                >


                  <img
                    src={getImageUrl(blog.featured_image)}
                    alt={blog.title}
                  />


                  <div className="small-content">

                    <h4>
                      {blog.title}
                    </h4>


                    <Link href={`/blogs/${blog.slug}`}>
                      READ MORE →
                    </Link>


                  </div>


                </div>

              ))}





              {/* RIGHT SIDE EMPTY SPACE TEXT */}

              <div className="blog-side-text">

                <h3>
                  Stories That Inspire Your Style
                </h3>


                <p>
                  Explore our latest blogs for fashion inspiration,
                  styling ideas, and expert tips crafted to make
                  every celebration memorable.
                </p>


              </div>



            </div>



          </div>


        </div>


      </section>

      {/* service strip */}
      {/* <section className="service-features">
        <div className="container">
          <div className="row">

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <Truck size={16} strokeWidth={2} />
                </div>

                <h4>FREE SHIPPING</h4>

                <p>
                  Free shipping and returns all over India.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <ShieldCheck size={16} strokeWidth={2} />
                </div>

                <h4>ASSURED QUALITY</h4>

                <p>
                  We promise you high quality at very affordable prices.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <ShoppingBag size={16} strokeWidth={2} />
                </div>

                <h4>SECURE PAYMENT</h4>

                <p>
                  Your payment information is processed securely according to RBI guidelines.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <MessageCircle size={16} strokeWidth={2} />
                </div>

                <h4>CUSTOMER SERVICE</h4>

                <p>
                  We are available Monday to Friday from 10am–8pm to answer all your queries.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section> */}


      {/* faq */}
      <section className="faq-section">

        <div className="container-lg">

          <div className="faq-header">

            <span>NEED HELP?</span>

            <h2>
              Frequently Asked Questions
            </h2>

          </div>



          <div className="faq-list">

            {faqs.map((faq, index) => (

              <div
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                key={index}
              >

                <div
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >

                  <p>
                    {faq.question}
                  </p>


                  <span>
                    {activeFaq === index ? '−' : '+'}
                  </span>

                </div>


                <div className="faq-answer">

                  {faq.answer}

                </div>


              </div>


            ))}


          </div>


        </div>

      </section>

      <section className="service-features">
        <div className="container">
          <div className="row">

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <Truck size={16} strokeWidth={2} />
                </div>

                <h4>FREE SHIPPING</h4>

                <p>
                  Free shipping and returns all over India.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <ShieldCheck size={16} strokeWidth={2} />
                </div>

                <h4>ASSURED QUALITY</h4>

                <p>
                  We promise you high quality at very affordable prices.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <ShoppingBag size={16} strokeWidth={2} />
                </div>

                <h4>SECURE PAYMENT</h4>

                <p>
                  Your payment information is processed securely according to RBI guidelines.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="feature-box">
                <div className="feature-icon">
                  <MessageCircle size={16} strokeWidth={2} />
                </div>

                <h4>CUSTOMER SERVICE</h4>

                <p>
                  We are available Monday to Friday from 10am–8pm to answer all your queries.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


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
