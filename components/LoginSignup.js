'use client';

import { useState, useEffect } from 'react';
import './auth.css';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  registerUser,
  verifyOtp,
  sendOtp,
  loginUser,
  clearAuthErrors,
  clearRegistrationStatus
} from '../store/slices/authSlice';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Login flow customization (email vs phone)
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  
  // OTP Verification view (Post-signup)
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  // Select states from Redux
  const { loading, error, otpData, registrationStatus, otpStatus, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(clearAuthErrors());
    dispatch(clearRegistrationStatus());
  }, [isLogin, loginMethod, showOtpVerification, dispatch]);

  // Redirect to userProfile if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/userProfile');
    }
  }, [isAuthenticated, router]);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setShowPhoneOtpInput(false);
    setShowOtpVerification(false);
  };

  // 1. Email Login
  const handleEmailLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email: trimmedEmail, password })).unwrap();
      if (result.status) {
        router.push('/userProfile');
      }
    } catch (err) {
      // Handled by Redux, err is action.payload
    }
  };

  // 2. Send OTP (Phone login flow)
  const handleSendPhoneOtp = async () => {
    const trimmedMobile = mobile.trim();
    if (!trimmedMobile) {
      alert('Please enter your mobile number.');
      return;
    }

    try {
      const result = await dispatch(sendOtp({ phone: trimmedMobile })).unwrap();
      if (result.status) {
        setShowPhoneOtpInput(true);
      }
    } catch (err) {
      // Handled by Redux
    }
  };

  // 3. Verify OTP & Login (Phone login flow)
  const handleVerifyPhoneLogin = async () => {
    const trimmedMobile = mobile.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedMobile || !trimmedOtp) {
      alert('Please enter your mobile number and the OTP.');
      return;
    }

    try {
      const result = await dispatch(loginUser({ phone: trimmedMobile, otp: trimmedOtp })).unwrap();
      if (result.status) {
        router.push('/userProfile');
      }
    } catch (err) {
      // Handled by Redux
    }
  };

  // 4. Signup Registration
  const handleSignup = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMobile || !password || !confirmPassword) {
      alert('Please fill in all signup fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password and confirm password do not match.');
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedMobile,
          password,
          password_confirmation: confirmPassword,
        })
      ).unwrap();

      if (result.status) {
        setShowOtpVerification(true);
      }
    } catch (err) {
      // Handled by Redux
    }
  };

  // 5. Post-Signup OTP Verification
  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    const trimmedMobile = mobile.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      alert('Please enter the OTP.');
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ phone: trimmedMobile, otp: trimmedOtp })).unwrap();
      if (result.status) {
        resetForm();
        router.push('/userProfile');
      }
    } catch (err) {
      // Handled by Redux
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (loginMethod === 'email') {
        handleEmailLogin();
      } else {
        if (!showPhoneOtpInput) {
          handleSendPhoneOtp();
        } else {
          handleVerifyPhoneLogin();
        }
      }
    } else {
      handleSignup();
    }
  };

  // Quick helper to resend OTP on registration verification
  const handleResendSignupOtp = async () => {
    try {
      await dispatch(sendOtp({ phone: mobile.trim() })).unwrap();
    } catch (err) {
      alert(err || 'Failed to resend OTP');
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <span className="auth-badge">Luxury Fashion</span>
          <h1>
            Elevate Your <br />
            Shopping Experience
          </h1>
          <p>Discover premium ethnic collections crafted for modern elegance.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          {/* Main switch between Login & Signup - Hide if we are verifying OTP */}
          {!showOtpVerification && (
            <div className="auth-switch">
              <button
                className={isLogin ? 'active-switch' : ''}
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
              >
                Login
              </button>
              <button
                className={!isLogin ? 'active-switch' : ''}
                onClick={() => {
                  setIsLogin(false);
                  resetForm();
                }}
              >
                Signup
              </button>
            </div>
          )}

          {/* Heading */}
          <h2>
            {showOtpVerification
              ? 'Verify Number 🔑'
              : isLogin
              ? 'Welcome Back 👋'
              : 'Create Account ✨'}
          </h2>

          <p className="auth-subtitle">
            {showOtpVerification
              ? 'Enter the verification code sent to your phone.'
              : isLogin
              ? 'Login to continue shopping.'
              : 'Join us and explore luxury collections.'}
          </p>

          {/* Error Banner */}
          {error && <div className="auth-error-alert">{error}</div>}

          {/* Registration Success Status */}
          {registrationStatus && (
            <div className="auth-success-alert">{registrationStatus}</div>
          )}

          {/* OTP status banner */}
          {otpStatus && <div className="auth-success-alert">{otpStatus}</div>}

          {/* Simulation/Demo OTP Box */}
          {otpData && otpData.otp && (
            <div className="demo-otp-box">
              <strong>✨ Demo OTP Code (For Testing): </strong>
              <span className="otp-code-highlight">{otpData.otp}</span>
            </div>
          )}

          {/* POST-SIGNUP OTP VERIFICATION VIEW */}
          {showOtpVerification ? (
            <form className="auth-form" onSubmit={handleVerifySignupOtp}>
              <div className="form-group-info">
                <label>Verifying Phone Number:</label>
                <input type="text" value={mobile} disabled className="disabled-input" />
              </div>

              <input
                type="text"
                placeholder="Enter 4-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'VERIFY & REGISTER'}
              </button>

              <div className="resend-container">
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendSignupOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>

              <p className="bottom-text">
                Want to go back?{' '}
                <span
                  onClick={() => {
                    resetForm();
                    setIsLogin(false);
                  }}
                >
                  Back to Signup
                </span>
              </p>
            </form>
          ) : (
            /* STANDARD LOGIN / SIGNUP VIEW */
            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Login Method Switch (Email vs Phone) */}
              {isLogin && (
                <div className="login-method-selector">
                  <span
                    className={`method-tab ${loginMethod === 'email' ? 'active-method' : ''}`}
                    onClick={() => {
                      setLoginMethod('email');
                      resetForm();
                    }}
                  >
                    Email & Password
                  </span>
                  <span
                    className={`method-tab ${loginMethod === 'phone' ? 'active-method' : ''}`}
                    onClick={() => {
                      setLoginMethod('phone');
                      resetForm();
                      setLoginMethod('phone'); // prevent override
                    }}
                  >
                    Phone & OTP
                  </span>
                </div>
              )}

              {/* Full Name (Signup only) */}
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              {/* Email Address (Signup, or Email Login method) */}
              {(!isLogin || (isLogin && loginMethod === 'email')) && (
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}

              {/* Phone/Mobile Number (Signup, or Phone Login method) */}
              {(!isLogin || (isLogin && loginMethod === 'phone')) && (
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isLogin && showPhoneOtpInput}
                  className={isLogin && showPhoneOtpInput ? 'disabled-input' : ''}
                  required
                />
              )}

              {/* Password (Signup, or Email Login method) */}
              {(!isLogin || (isLogin && loginMethod === 'email')) && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              )}

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {/* OTP Code Input (Phone login method, only after sending OTP) */}
              {isLogin && loginMethod === 'phone' && showPhoneOtpInput && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              )}

              {/* Submit Button */}
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? (
                  'Please wait...'
                ) : isLogin ? (
                  loginMethod === 'email' ? (
                    'LOGIN'
                  ) : !showPhoneOtpInput ? (
                    'SEND OTP'
                  ) : (
                    'VERIFY & LOGIN'
                  )
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </form>
          )}

          {/* Toggle link */}
          {!showOtpVerification && (
            <p className="bottom-text">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
              >
                {isLogin ? ' Signup' : ' Login'}
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
