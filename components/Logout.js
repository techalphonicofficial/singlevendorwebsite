import React, { useState } from 'react';
import { FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import './userprofile.css';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Logout = ({ setActiveMenu }) => {
  const [status, setStatus] = useState('confirm'); // 'confirm' or 'success'
  const router = useRouter();
   const dispatch = useDispatch();

  const handleLogout = () => {
      dispatch(logout());
   
    // setStatus('success');
    
    // Wait for 2 seconds then redirect to the homepage
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleCancel = () => {
    // If user cancels, send them back to Dashboard
    if (setActiveMenu) {
      setActiveMenu('Dashboard');
    }
  };

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-content">
        {status === 'confirm' ? (
          <>
            <div className="logout-icon-wrapper">
              <FiLogOut />
            </div>
            <h3>Ready to Leave?</h3>
            <p>Are you sure you want to log out of your account? You will need to log back in to access your dashboard.</p>
            
            <div className="logout-actions">
              <button className="btn-logout-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-logout-confirm" onClick={handleLogout}>Yes, Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className="logout-success-icon">
              <FiCheckCircle />
            </div>
            <h3>Logged Out!</h3>
            <p>You have logged out successfully. Redirecting you safely back to the home page...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Logout;