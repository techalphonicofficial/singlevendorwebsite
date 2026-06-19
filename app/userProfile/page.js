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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/authServices');
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f6f3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#bf8a52', fontWeight: 600, fontSize: '16px' }}>Loading profile...</div>
      </div>
    );
  }

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

