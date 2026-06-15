'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {IoHomeOutline,IoBagHandleOutline,IoPersonOutline} from 'react-icons/io5';
import { FiShoppingBag } from 'react-icons/fi';
import './mobileBottom.css';
import { useSelector, useDispatch } from 'react-redux';

export default function MobileBottomNav() {
  //  const wishlistQuantity = useSelector((state) => state.wishlist.totalQuantity);
   const totalQuantity = useSelector((state) => state.cart.totalQuantity);
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);

  return (

    <div className="mobile-bottom-nav">

      {/* HOME */}

      <Link href="/" className="bottom-nav-item">
        <IoHomeOutline />
        <span>Home</span>
      </Link>

      {/* SHOP */}

      <Link href="/shop" className="bottom-nav-item">
        <FiShoppingBag />
        <span>Shop</span>
      </Link>

      {/* CART */}

      {/* <Link href="/cart" className="bottom-nav-item">
        <IoBagHandleOutline />
        <span>Cart</span>
      </Link> */}

       <Link href="/cart" className=" position-relative bottom-nav-item ">
            <IoBagHandleOutline/>
              <span>Cart</span>

            {/* {totalQuantity > 0 && ( */}
            <span className="badge-cart">{mounted ? totalQuantity : 0}</span>
            {/* )} */}

          </Link >

      {/* PROFILE */}

      <Link href="/userProfile" className="bottom-nav-item">
        <IoPersonOutline />
        <span>Profile</span>
      </Link>

    </div>
  );
}