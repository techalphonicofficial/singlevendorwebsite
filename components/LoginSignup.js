'use client';

import { useState } from 'react';
import './auth.css';
import { useRouter } from 'next/navigation';
import { loginSuccess } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function LoginSignup() {

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogin = () => {

   if(
      email === 'sakshi@gmail.com' &&
      password === '123456'
   ){

      dispatch(loginSuccess({
         name: 'Sakshi',
         email: 'sakshi@gmail.com',
         image: '/user.jpg',
      }));

      router.push('/userProfile');

   } else {

      alert('Wrong credentials');

   }
}

    return (
        <section className="auth-section">

            <div className="auth-container">
                {/* LEFT SIDE */}
                <div className="auth-left">
                    <span className="auth-badge">
                        Luxury Fashion
                    </span>
                    <h1>
                        Elevate Your <br />
                        Shopping Experience
                    </h1>
                    <p>
                        Discover premium ethnic collections crafted
                        for modern elegance.
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="auth-right">
                    {/* SWITCH BUTTONS */}
                    <div className="auth-switch">
                        <button
                            className={isLogin ? 'active-switch' : ''} onClick={() => setIsLogin(true)}>
                            Login
                        </button>
                        <button
                            className={!isLogin ? 'active-switch' : ''} onClick={() => setIsLogin(false)}>
                            Signup
                        </button>
                    </div>
                    <h2>
                        {isLogin ? 'Welcome Back 👋' : 'Create Account ✨'}
                    </h2>

                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Login to continue shopping.'
                            : 'Join us and explore luxury collections.'}
                    </p>
                    <form className="auth-form">
                        {!isLogin && (
                            <input type="text" placeholder="Full Name" />
                        )}
                        <input
                            type="email" placeholder="Email Address"   value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

                        <input
                            type="password" placeholder="Password"   value={password}
                            onChange={(e) => setPassword(e.target.value)} />

                        {!isLogin && (
                            <input type="password" placeholder="Confirm Password" />
                        )}

                        <button className="auth-btn" type='button' onClick={isLogin ? handleLogin : undefined}>
                            {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                        </button>

                    </form>
                    <p className="bottom-text">
                        {isLogin
                            ? "Don't have an account?"
                            : 'Already have an account?'
                        }

                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? ' Signup' : ' Login'}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}