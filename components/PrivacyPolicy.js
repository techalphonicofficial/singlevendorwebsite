import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { updateStoredPassword, verifyPassword } from '../store/accountHelpers';
import './userprofile.css';

const PrivacyPolicy = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [profileData, setProfileData] = useState({
    name: userInfo?.name || '',
    phone: userInfo?.phone || userInfo?.mobile || '',
  });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  React.useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name || '',
        phone: userInfo.phone || userInfo.mobile || '',
      });
    }
  }, [userInfo]);

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert("New password and confirmation do not match.");
      return;
    }

    const isCurrentPasswordValid = await verifyPassword(passwordData.current);

    if (!isCurrentPasswordValid) {
      alert("Current password is incorrect.");
      return;
    }

    await updateStoredPassword(passwordData.new);
    setPasswordData({ current: '', new: '', confirm: '' });
    alert("Password updated successfully!");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login before updating your profile.");
      return;
    }

    const payload = {
      name: profileData.name.trim(),
      phone: profileData.phone.trim(),
    };

    try {
      const result = await dispatch(updateProfile({ payload, token })).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      alert(`Profile update failed: ${error}`);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
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
            <p>Update your account's profile information, email address, and mobile number.</p>
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
              <label className="address-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#888' }}><FiPhone /></div>
                <input
                  type="tel"
                  name="phone"
                  className="address-input"
                  value={profileData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-custom"
              style={{ padding: '12px 24px', width: 'fit-content', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
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
                name="current"
                className="address-input"
                placeholder="Enter current password"
                value={passwordData.current}
                onChange={handlePasswordChange}
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
                name="new"
                className="address-input"
                placeholder="Enter new password"
                value={passwordData.new}
                onChange={handlePasswordChange}
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
                name="confirm"
                className="address-input"
                placeholder="Confirm new password"
                value={passwordData.confirm}
                onChange={handlePasswordChange}
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
