'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../store/slices/bannerSlice';
import Link from 'next/link';
import './banner.css';
import { getMediaUrl } from '../store/apiConfig';

const Banner = () => {
  const dispatch = useDispatch();
  const { topBanners, loading } = useSelector((state) => state.banners);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (topBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % topBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [topBanners.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topBanners.length) % topBanners.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topBanners.length);
  };

  if (loading) {
    return <div className="banner-loading">Loading banners...</div>;
  }

  if (!topBanners || topBanners.length === 0) {
    return null;
  }

  const banner = topBanners[currentSlide];
  console.log('Current Banner:', banner);

  return (
    <section className="banner-section">
      <div className="banner-slider-container">
        {/* Media Display - Video Only */}
        <div className="banner-media-wrapper">
          <video
            className="banner-video"
            autoPlay
            muted
            loop
            playsInline
            key={banner.id}
          >
            <source src={getMediaUrl(banner.video_path)} type="video/mp4" />
          </video>

          {/* Overlay Content */}
          <div className="banner-overlay">
            <div className="banner-content">
              {banner.subtitle && (
                <p className="banner-subtitle">{banner.subtitle}</p>
              )}
              <h1 className="banner-title">{banner.title}</h1>
              {banner.cta_text && banner.cta_link && (
                <Link href={banner.cta_link} className="banner-cta-btn">
                  {banner.cta_text}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        {topBanners.length > 1 && (
          <>
            <button
              className="banner-nav-btn banner-prev"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
            >
              ❮
            </button>
            <button
              className="banner-nav-btn banner-next"
              onClick={handleNextSlide}
              aria-label="Next slide"
            >
              ❯
            </button>

            {/* Dot Indicators */}
            <div className="banner-dots">
              {topBanners.map((_, index) => (
                <button
                  key={index}
                  className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Banner;
