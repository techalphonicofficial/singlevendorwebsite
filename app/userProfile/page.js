'use client';
import React from 'react'
import { useState, useEffect } from 'react'
import UserSidebar from '../../components/UserSidebar';
import Dashboard from '../../components/Dashboard';
import OrderHistory from '../../components/OrderHistory';
import Addresstab from '../../components/Addresstab';
import OrderReturn from '../../components/OrderReturn';
import Wishlist from '../../components/Wishlist';
import Invoice from '../../components/invoice';
import Review from '../../components/Review';
import PrivacyPolicy from '../../components/PrivacyPolicy';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Logout from '../../components/Logout';

function page() {

  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {

    if (!isAuthenticated) {
      router.push('/authServices');
    }

  }, [isAuthenticated]);

  return (
    <div className="profile-layout">

      {/* LEFT */}
      <UserSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}

      />

      {/* RIGHT */}
      <div className="profile-content">

        {activeMenu === 'Dashboard' && <Dashboard />}
        {activeMenu === 'Orders' && <OrderHistory />}
        {activeMenu === 'Invoices' && <Invoice />}
        {activeMenu === 'Reviews' && <Review />}
        {activeMenu === 'Security' && <PrivacyPolicy userInfo={user} />}
        {activeMenu === 'Address' && <Addresstab />}
        {activeMenu === 'Order Return Request' && <OrderReturn />}
        {activeMenu === 'Wishlist' && <Wishlist />}
        {activeMenu === 'Logout' && <Logout setActiveMenu={setActiveMenu} />}

      </div>

    </div>
  )
}

export default page

