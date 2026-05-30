'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Searchbar from './Searchbar';
import { FaRegHeart } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { navCategories } from '../data/data';
import { User } from "lucide-react";
import { Search, X } from 'lucide-react';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  // const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  // const wishlistItems = useSelector((state) => state.wishlist.items);

  const wishlistQuantity = useSelector((state) => state.wishlist.totalQuantity);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="navbar-custom sticky-top  ">
      <div className="container-fluid px-4 py-3 justify-content-between align-items-center d-none d-md-flex ">
        <Link href="/" className="navbar-brand-custom">
          <Image src='/logo.png' alt='logo' width={120} height={50} className=' logo-glow rounded-pill ' />
        </Link>
        <Searchbar />
        <nav className="d-flex align-items-center gap-5">
          <Link href="/" className="nav-link-custom">Home</Link>
          {/* SHOP MEGA MENU */}
          <div
            className="mega-wrapper" onMouseEnter={() => setShowMegaMenu(true)} onMouseLeave={() => setShowMegaMenu(false)}>
            <Link href="/shop" className="nav-link-custom">
              Shop
            </Link>

            <div className={`mega-menu ${showMegaMenu ? "mega-active" : ""}`}>
              <div className="mega-menu-inner">

                {navCategories.map((item, index) => (
                  <div className="mega-column" key={index}>

                    <h4 className="mega-heading">
                      {item.category}
                    </h4>

                    <div className="mega-links">
                      {item.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.id}`}
                          className="mega-link-item"
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>

                  </div>
                ))}

              </div>
            </div>
          </div>
          <Link href="/about" className="nav-link-custom">About</Link>
          <Link href="/contact" className="nav-link-custom">Contact</Link>

        </nav>
        <div className='d-flex gap-2 align-items-center'>
          {/* <Link href="/user" className='FlagRed'><User /></Link> */}
          <div
            className="profile-wrapper"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}>

            {/* ICON */}
            <div className="profile-trigger">
              <User size={22} />
            </div>
            {/* DROPDOWN */}
            <div
              className={`profile-dropdown ${showProfile ? "profile-active" : ""}`}>
              {/* TOP */}
              <div className="profile-top">
                <h4>Welcome</h4>
                <p>
                  To access account and manage orders
                </p>
                {
                  !isAuthenticated ? (
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
                  )
                }
              </div>
              {/* MENU */}
              <div className="profile-links">
                <Link href="/">Orders</Link>
                <Link href="/wishlist">Wishlist</Link>
                <Link href="/">Gift Cards</Link>
                <Link href="/contact">Contact Us</Link>
                <Link href="/userProfile" className="new-link">
                  Profile
                </Link>
                {isAuthenticated && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(logout());
                    }}
                    className="text-danger fw-semibold">
                    Logout
                  </a>
                )}
              </div>
              {/* BOTTOM */}
              {/* <div className="profile-links bottom-links">

                <Link href="/">Myntra Credit</Link>

                <Link href="/">Coupons</Link>

                <Link href="/">Saved Cards</Link>

                <Link href="/">Saved VPA</Link>

                <Link href="/">Saved Addresses</Link>

              </div> */}

            </div>
          </div>
          <Link href="/cart" className="cart-btn-custom position-relative ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {/* {totalQuantity > 0 && ( */}
            <span className="badge-cart">{totalQuantity}</span>
            {/* )} */}

          </Link >
          <Link href='/wishlist' className='FlagRed cart-btn-custom position-relative '><FaRegHeart size={20} />
            {/* {wishlistQuantity > 0 && ( */}
            <span className="badge-cart">{wishlistQuantity}</span>
            {/* )} */}
          </Link>
        </div>
      </div>

      {/* mobile menu */}

      <div className='d-flex justify-content-between align-items-center d-md-none p-3 '>
        <div className='d-flex gap-1 justify-content-center align-items-center'>

          {/* {
            openMenu ? (
              <IoMdClose
                size={28}
                onClick={() => setOpenMenu(false)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <IoMdMenu
                size={28}
                onClick={() => setOpenMenu(true)}

                style={{ cursor: "pointer" }}
              />
            )
          } */}
          <Link href="/" className="navbar-brand-custom">

            <Image src='/logo.png' alt='logo' width={80} height={40} className=' logo-glow rounded-pill mr-4' />
          </Link>
        

        </div>
        <div className='d-flex gap-3 justify-content-center align-items-center'>
         
            <div className="mobile-search-wrapper d-lg-none">

            <div
              className={`mobile-search-box ${openSearch ? 'active' : ''
                }`}>
              <input
                type="text"
                placeholder="Search products..."
                className="mobile-search-input"
              />

              <button
                className="mobile-search-btn"
                onClick={() =>
                  setOpenSearch(!openSearch)
                }
              >

                {openSearch ? <X size={18} /> : <Search size={18} />}

              </button>

            </div>

          </div>
           <div className='position-relative d-inline-block'> <Link href='/wishlist' className='FlagRed'><FaRegHeart size={26} /></Link>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
              style={{ fontSize: '10px' }}
            >
              {wishlistQuantity}
            </span>
          </div>
          {/* <div className="position-relative d-inline-block">
            <Link href="/cart" className=' FlagRed'><LuShoppingCart size={28} /></Link>

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
              style={{ fontSize: '10px' }}
            >
              {totalQuantity}
            </span>
          </div> */}
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

          <Link href="/contact" onClick={() => setOpenMenu(false)}>
            <span>Contact</span>
            <span>›</span>
          </Link>
          <Link href="/profile" onClick={() => setOpenMenu(false)}>
            <span>Profile</span>
            <span>›</span>
          </Link>
          <Link href="/LogOut" onClick={() => setOpenMenu(false)}>
            <span>LogOut</span>
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

    </header>
  );
}
