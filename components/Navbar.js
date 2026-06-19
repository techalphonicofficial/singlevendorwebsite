'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Searchbar from './Searchbar';
import { FaRegHeart } from "react-icons/fa";
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishList';
import { User, Search, X } from 'lucide-react';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
// import "../app/stylefile/navbar.css"

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openWishlistDrawer, setOpenWishlistDrawer] = useState(false);
  const lastScrollY = useRef(0);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistQuantity = useSelector((state) => state.wishlist.totalQuantity);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: apiItems } = useSelector((state) => state.products) || { items: [] };
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!apiItems || apiItems.length === 0) {
      dispatch(fetchProducts({ page: 1, per_page: 100, include_filters: true }));
    }
  }, [dispatch, apiItems]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const navCategories = useMemo(() => {
    if (!apiItems || apiItems.length === 0) {
      return [
        {
          category: "Mens",
          products: []
        },
        {
          category: "Womens",
          products: []
        }
      ];
    }

    const categoriesMap = {};
    apiItems.forEach(item => {
      const catName = item.categories?.[0]?.name || 'General';
      if (!categoriesMap[catName]) {
        categoriesMap[catName] = [];
      }
      categoriesMap[catName].push({
        id: item.id,
        slug: item.slug,
        name: item.name
      });
    });

    return Object.entries(categoriesMap).map(([category, products]) => ({
      category,
      products: products.slice(0, 4),
      hasMore: products.length > 4
    }));
  }, [apiItems]);

  const truncateWords = (name) => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length <= 3) return name;
    return words.slice(0, 3).join(' ');
  };;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      setHideNavbar(scrollingDown && currentScrollY > 90);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-custom sticky-top ${hideNavbar ? "navbar-hidden" : ""}`}>
      {/* Red announcement banner */}
      <div className="navbar-top-banner">
        Free shipping and returns all over India
      </div>

      {/* Desktop Main Header */}
      <div className="container-fluid px-5 py-3 d-none d-md-flex align-items-center justify-content-between">
        {/* Left Side: Search Bar */}
        <div className="search-container-custom">
          <Search size={16} className="search-icon-custom" />
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input-custom"
          />
        </div>

        {/* Center: Brand Logo */}
        <Link href="/" className="navbar-brand-custom text-decoration-none">
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "300px" }}
          />
        </Link>

        {/* Right Side: Icons */}
        <div className="d-flex align-items-center gap-4">
          <div
            className="profile-wrapper"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <div
              className="profile-trigger p-0 bg-transparent border-0 text-dark"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User size={22} strokeWidth={1.8} style={{ cursor: 'pointer' }} />
            </div>

            <div className={`profile-dropdown ${showProfile ? "profile-active" : ""}`}>
              <div className="profile-top">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Welcome</h4>
                  <X
                    size={20}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfile(false);
                    }}
                  />
                </div>
                <p>To access account and manage orders</p>
                {(!mounted || !isAuthenticated) ? (
                  <Link href="/authServices" className="login-btn">
                    LOGIN / SIGNUP
                  </Link>
                ) : (
                  <div className="d-flex align-items-center gap-2 py-2 px-3 rounded-3 bg-light border border-warning-subtle shadow-sm mb-2" style={{ borderLeft: '3px solid #ffc107' }}>
                    <div className="bg-warning text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-start">
                      <p className="text-muted mb-0 lh-1" style={{ fontSize: '11px' }}>Logged in as</p>
                      <p className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{user?.name}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="profile-links">
                <Link href="/userProfile?tab=orders">Orders</Link>
                <Link href="/wishlist">Wishlist</Link>
                <Link href="/userProfile">Gift Cards</Link>
                <Link href="/contact">Contact Us</Link>
                <Link href="/userProfile" className="new-link">Profile</Link>
                {mounted && isAuthenticated && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(logout());
                    }}
                    className="text-danger fw-semibold"
                  >
                    Logout
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Wishlist Trigger */}
          <Link
            href="/wishlist"
            className="position-relative text-dark p-0 d-inline-flex align-items-center"
            style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
          >
            <FaRegHeart size={20} strokeWidth={1.8} />
            {mounted && wishlistQuantity > 0 && (
              <span className="custom-badge-circle">{wishlistQuantity}</span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <Link
            href="/cart"
            className="position-relative text-dark p-0 d-inline-flex align-items-center"
            style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {mounted && totalQuantity > 0 && (
              <span className="custom-badge-circle">{totalQuantity}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop Sub-navigation Links */}
      <div className="d-none d-md-block subnav-container" style={{ borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>
        <nav className="container-fluid d-flex justify-content-center align-items-center gap-5 py-2">
          <Link href="/" className="subnav-link-custom">Home</Link>

          <div
            className="mega-wrapper"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <Link href="/shop" className="subnav-link-custom">
              Shop
            </Link>

            <div className={`mega-menu ${showMegaMenu ? "mega-active" : ""}`}>
              <div className="mega-menu-inner">
                {navCategories.map((item, index) => (
                  <div className="mega-column" key={index}>
                    <h4 className="mega-heading">{item.category}</h4>
                    <div className="mega-links">
                      {item.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug || product.id}`}
                          className="mega-link-item"
                        >
                          {truncateWords(product.name)}
                        </Link>
                      ))}
                      {item.hasMore && (
                        <span className="mega-link-item text-muted" style={{ cursor: 'default' }}>...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" className="subnav-link-custom">About</Link>
          <Link href="/blogs" className="subnav-link-custom">Blog</Link>
          <Link href="/contact" className="subnav-link-custom">Contact</Link>
        </nav>
      </div>

      {/* Mobile Header Menu */}
      <div className="d-flex justify-content-between align-items-center d-md-none p-3 border-bottom bg-white">
        <div className="d-flex gap-2 justify-content-center align-items-center">
          {openMenu ? (
            <IoMdClose
              size={24}
              onClick={() => setOpenMenu(false)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <IoMdMenu
              size={24}
              onClick={() => setOpenMenu(true)}
              style={{ cursor: "pointer" }}
            />
          )}
          <Link href="/" className="navbar-brand-custom text-decoration-none">
            {/* <span className="logo-text" style={{ fontSize: '20px', letterSpacing: '1px' }}>|| राज़-रतन ||</span> */}
            <Image
              src="/logowhite.png"
              alt="Logo"
              width={120}
              height={45}
              className="logo-img"
            />
          </Link>
        </div>

        <div className="d-flex gap-3 justify-content-center align-items-center">
          <div className="mobile-search-wrapper">
            <div className={`mobile-search-box ${openSearch ? 'active' : ''}`} style={{ borderRadius: openSearch ? '4px' : '50%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="mobile-search-input"
              />
              <button
                className="mobile-search-btn"
                onClick={() => {
                  if (openSearch) {
                    handleSearch();
                  } else {
                    setOpenSearch(true);
                  }
                }}
              >
                {openSearch ? (
                  <X
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSearch(false);
                      setSearchQuery('');
                    }}
                  />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>
          </div>

          <div className="position-relative d-inline-block">
            <Link href="/wishlist" className="bg-transparent border-0 text-dark p-0 d-inline-flex align-items-center">
              <FaRegHeart size={22} />
            </Link>
            {mounted && wishlistQuantity > 0 && (
              <span className="custom-badge-circle" style={{ width: '15px', height: '15px', fontSize: '8px', top: '-6px', right: '-6px' }}>
                {wishlistQuantity}
              </span>
            )}
          </div>

          <div className="position-relative d-inline-block ms-1">
            <Link href="/cart" className="bg-transparent border-0 text-dark p-0 d-inline-flex align-items-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </Link>
            {mounted && totalQuantity > 0 && (
              <span className="custom-badge-circle" style={{ width: '15px', height: '15px', fontSize: '8px', top: '-6px', right: '-6px' }}>
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      {/* Overlay */}
      {/* <div
        className={`menu-overlay ${openMenu ? "show-overlay" : ""}`}
        onClick={() => setOpenMenu(false)} ></div> */}

      {/* Sidebar */}
      <div className={`mobile-sidebar ${openMenu ? "show-menu" : ""}`}>

        {/* Top */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">

          <div>
            <h5 className="fw-bold mb-0">Hi There ✨</h5>
            <small className="text-muted">
              Explore festive collections
            </small>
          </div>

          <IoMdClose
            size={28}
            onClick={() => setOpenMenu(false)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Main Links */}
        <nav className="d-flex flex-column menu-links">

          <Link href="/" onClick={() => setOpenMenu(false)}>
            <span>Home</span>
            <span>›</span>
          </Link>

          <Link href="/shop" onClick={() => setOpenMenu(false)}>
            <span>Shop</span>
            <span>›</span>
          </Link>

          <Link href="/wishlist" onClick={() => setOpenMenu(false)}>
            <span>Wishlist</span>
            <span>›</span>
          </Link>

          <Link href="/cart" onClick={() => setOpenMenu(false)}>
            <span>Cart</span>
            <span>›</span>
          </Link>

          <Link href="/about" onClick={() => setOpenMenu(false)}>
            <span>About</span>
            <span>›</span>
          </Link>

          <Link href="/blogs" onClick={() => setOpenMenu(false)}>
            <span>Blog</span>
            <span>›</span>
          </Link>

          <Link href="/contact" onClick={() => setOpenMenu(false)}>
            <span>Contact</span>
            <span>›</span>
          </Link>
          <Link href="/userProfile" onClick={() => setOpenMenu(false)}>
            <span>Profile</span>
            <span>›</span>
          </Link>
          <Link href="/userProfile" onClick={() => setOpenMenu(false)}>
            <span>Profile</span>
            <span>›</span>
          </Link>

        </nav>

        {/* Categories */}
        <div className="mt-5">

          <p className="small text-uppercase text-secondary fw-semibold mb-3">
            Shop Categories
          </p>

          <div className="category-box">

            <div>
              <span>Sherwanis</span>
              <span>›</span>
            </div>

            <div>
              <span>Kurta Sets</span>
              <span>›</span>
            </div>

            <div>
              <span>Indo-Western</span>
              <span>›</span>
            </div>

            <div>
              <span>Accessories</span>
              <span>›</span>
            </div>

          </div>
        </div>

      </div>

      <CartDrawer isOpen={openCartDrawer} onClose={() => setOpenCartDrawer(false)} />
      <WishlistDrawer isOpen={openWishlistDrawer} onClose={() => setOpenWishlistDrawer(false)} />

    </header>
  );
}
