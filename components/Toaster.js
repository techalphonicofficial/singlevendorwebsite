'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../store/slices/toastSlice';


export default function Toast() {

  const dispatch = useDispatch();

  const { show, message, type } = useSelector(
    (state) => state.toast
  );

  useEffect(() => {

    if (show) {

      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 2500);

      return () => clearTimeout(timer);
    }

  }, [show, dispatch]);

  return (
    <div
      className={`toast-box ${
        show ? 'show-toast' : ''
      } ${type}`}
    >

      <div className="toast-icon">
        {type === 'success' ? '✓' : '♥'}
      </div>

      <p>{message}</p>

    </div>
  );
}