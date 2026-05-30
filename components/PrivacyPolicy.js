import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiMail } from 'react-icons/fi';
import './userprofile.css';

const PrivacyPolicy = ({ userInfo, setUserInfo }) => {
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [profileData, setProfileData] = useState({ name: userInfo?.name || '', email: userInfo?.email || '' });

  React.useEffect(() => {
    if (userInfo) {
      setProfileData({ name: userInfo.name, email: userInfo.email });
    }
  }, [userInfo]);

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
    // Logic to update password via API
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (setUserInfo) {
      setUserInfo(prev => ({ ...prev, name: profileData.name, email: profileData.email }));
    }
    alert("Profile updated successfully!");
    // Logic to update profile via API
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium" style={{ marginBottom: '24px' }}>
        <h3>Account Settings</h3>
      </div>

      <div className="security-section">
        
        {/* 1. PROFILE UPDATE */}
        <div className="security-block">
          <div className="security-block-header">
            <h4>Profile Information</h4>
            <p>Update your account's profile information and email address.</p>
          </div>

          <form className="password-form" onSubmit={handleProfileSubmit}>
            <div className="password-input-group">
              <label className="address-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#888' }}><FiUser /></div>
                <input 
                  type="text" 
                  name="name"
                  className="address-input" 
                  value={profileData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required 
                />
              </div>
            </div>

            <div className="password-input-group">
              <label className="address-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#888' }}><FiMail /></div>
                <input 
                  type="email" 
                  name="email"
                  className="address-input" 
                  value={profileData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-custom" style={{ padding: '12px 24px', width: 'fit-content', marginTop: '8px' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* 2. PASSWORD CHANGE */}
        <div className="security-block">
          <div className="security-block-header">
            <h4>Change Password</h4>
            <p>Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <div className="password-input-group">
              <label className="address-label">Current Password</label>
              <input 
                type={showPassword.current ? "text" : "password"} 
                className="address-input" 
                placeholder="Enter current password" 
                required 
              />
              <button type="button" className="btn-toggle-password" onClick={() => togglePassword('current')}>
                {showPassword.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="password-input-group">
              <label className="address-label">New Password</label>
              <input 
                type={showPassword.new ? "text" : "password"} 
                className="address-input" 
                placeholder="Enter new password" 
                required 
              />
              <button type="button" className="btn-toggle-password" onClick={() => togglePassword('new')}>
                {showPassword.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="password-input-group">
              <label className="address-label">Confirm New Password</label>
              <input 
                type={showPassword.confirm ? "text" : "password"} 
                className="address-input" 
                placeholder="Confirm new password" 
                required 
              />
              <button type="button" className="btn-toggle-password" onClick={() => togglePassword('confirm')}>
                {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button type="submit" className="btn-primary-custom" style={{ padding: '12px 24px', width: 'fit-content', marginTop: '8px' }}>
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;