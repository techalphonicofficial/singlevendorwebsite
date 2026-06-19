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
  forgotPassword,
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
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Select states from Redux
  const { loading, error, otpData, registrationStatus, otpStatus, isAuthenticated, passwordReset } = useSelector(
    (state) => state.auth
  );

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(clearAuthErrors());
    dispatch(clearRegistrationStatus());
  }, [isLogin, loginMethod, showOtpVerification, dispatch]);

  // Redirect to userProfile if already authenticated
  useEffect(() => {
    if (isAuthenticated && !forgotMode) {
      router.push('/userProfile');
    }
  }, [isAuthenticated, forgotMode, router]);

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
  // 6. Forgot Password - Send OTP
  const handleForgotSendOtp = async () => {
    const phone = mobile.trim();
    if (!phone) {
      alert("Enter mobile number");
      return;
    }

    try {
      const result = await dispatch(
        sendOtp({
          phone: phone
        })
      ).unwrap();

      if (result.status) {
        setForgotStep("otp");
      }
    } catch (err) {
      console.log("FORGOT OTP ERROR", err);
    }
  }
  // 7. Forgot Password - Verify OTP
  const handleForgotVerifyOtp = async () => {
    const phone = mobile.trim();
    if (!forgotOtp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    try {
      const result = await dispatch(
        verifyOtp({
          phone: phone,
          otp: forgotOtp
        })
      ).unwrap();

      if (result.status) {
        setForgotStep("password");
      }
    } catch (err) {
      alert("Wrong OTP");
    }


  }

  // 8. Forgot Password - Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert("Please enter both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const result = await dispatch(
        forgotPassword({
          phone: mobile.trim(),
          otp: forgotOtp,
          password: newPassword,
          password_confirmation: confirmNewPassword
        })
      ).unwrap();

      if (result.status) {
        alert("Password changed successfully");
        setForgotMode(false);
        setForgotStep("email");
        setNewPassword("");
        setConfirmNewPassword("");
        setForgotOtp("");
      }
    } catch (err) {
      alert(err);
    }
  }

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

          {/* Main switch */}
          {!showOtpVerification && !forgotMode && (
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
              ? "Verify Number 🔑"
              : forgotMode
                ? "Forgot Password 🔐"
                : isLogin
                  ? "Welcome Back 👋"
                  : "Create Account ✨"}

          </h2>



          <p className="auth-subtitle">

            {showOtpVerification
              ? "Enter verification code sent to your phone."
              : forgotMode
                ? "Reset your password securely."
                : isLogin
                  ? "Login to continue shopping."
                  : "Join us and explore luxury collections."}
          </p>

          {error &&
            <div className="auth-error-alert">
              {error}
            </div>
          }
          {registrationStatus &&
            <div className="auth-success-alert">
              {registrationStatus}
            </div>
          }

          {otpStatus &&
            <div className="auth-success-alert">
              {otpStatus}
            </div>
          }

          {/* Demo OTP */}

          {otpData?.otp && (

            <div className="demo-otp-box">

              <strong>
                ✨ Demo OTP Code:
              </strong>

              <span className="otp-code-highlight">
                {otpData.otp}
              </span>

            </div>

          )}

          {/* ================= SIGNUP OTP ================= */}

          {showOtpVerification ? (


            <form
              className="auth-form"
              onSubmit={handleVerifySignupOtp}
            >


              <input
                value={mobile}
                disabled
                className="disabled-input"
              />


              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />


              <button
                className="auth-btn"
                disabled={loading}
              >

                {loading
                  ? "Verifying..."
                  : "VERIFY & REGISTER"}

              </button>



              <button
                type="button"
                className="resend-btn"
                onClick={handleResendSignupOtp}
              >

                Resend OTP

              </button>



            </form>



          )





            /* ================= FORGOT PASSWORD ================= */


            : forgotMode ? (



              <form className="auth-form">



                {/* STEP 1 EMAIL */}

                {forgotStep === "email" && (

                  <>

                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />

                    <button
                      type="button"
                      className="auth-btn"
                      onClick={handleForgotSendOtp}
                    >
                      SEND OTP
                    </button>

                  </>

                )}






                {/* STEP 2 OTP */}


                {forgotStep === "otp" && (


                  <>


                    <input
                      placeholder="Enter OTP"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      maxLength={6}
                    />



                    <button
                      type="button"
                      className="auth-btn"
                      onClick={handleForgotVerifyOtp}
                    >

                      VERIFY OTP

                    </button>



                    <button
                      type="button"
                      className="resend-btn"
                      onClick={handleForgotSendOtp}
                    >

                      RESEND OTP

                    </button>



                  </>

                )}

                {/* STEP 3 PASSWORD */}


                {forgotStep === "password" && (


                  <>


                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />


                    <button
                      type="button"
                      className="auth-btn"
                      onClick={handleResetPassword}
                      disabled={loading}
                    >

                      {loading ? "Please wait..." : "CHANGE PASSWORD"}

                    </button>


                  </>


                )}







                <p
                  className="bottom-text"
                  onClick={() => {

                    setForgotMode(false);
                    setForgotStep("email");

                  }}
                >

                  Back to Login

                </p>



              </form>




            )





              /* ================= LOGIN SIGNUP ================= */



              : (



                <form
                  className="auth-form"
                  onSubmit={handleSubmit}
                >




                  {isLogin && (

                    <div className="login-method-selector">


                      <span
                        className={`method-tab ${loginMethod === "email"
                          ? "active-method"
                          : ""
                          }`}
                        onClick={() => {
                          setLoginMethod("email")
                        }}
                      >

                        Email & Password

                      </span>



                      <span

                        className={`method-tab ${loginMethod === "phone"
                          ? "active-method"
                          : ""
                          }`}

                        onClick={() => {
                          setLoginMethod("phone")
                        }}

                      >

                        Phone & OTP

                      </span>


                    </div>

                  )}







                  {!isLogin && (

                    <input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                  )}






                  {(!isLogin || loginMethod === "email") && (

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                  )}







                  {(!isLogin || loginMethod === "phone") && (

                    <input
                      placeholder="Phone Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />

                  )}






                  {(!isLogin || loginMethod === "email") && (

                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                  )}






                  {!isLogin && (

                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                  )}







                  {isLogin &&
                    loginMethod === "phone" &&
                    showPhoneOtpInput && (

                      <input
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />

                    )}







                  <button
                    className="auth-btn"
                    disabled={loading}
                  >

                    {loading
                      ? "Please wait..."
                      : isLogin
                        ? "LOGIN"
                        : "CREATE ACCOUNT"}

                  </button>





                  {isLogin && (

                    <p
                      className="bottom-text"
                      onClick={() => {

                        setForgotMode(true);
                        setForgotStep("email");

                      }}
                    >

                      Forgot Password?

                    </p>

                  )}





                </form>


              )}
        </div>
      </div>
    </section>
  );
}
