'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchPageBySlug } from '../../store/slices/pageSlice';
import { getImageUrl, getMediaUrl } from '../../store/apiConfig';
import { Sparkles, CheckCircle, ShieldCheck, Box, Gem, ArrowLeft, RefreshCw } from 'lucide-react';

const slug = 'about-us';

const renderIcon = (iconName) => {
  if (!iconName) return <Sparkles size={24} />;
  const lower = iconName.toLowerCase();
  if (lower.includes('patch-check') || lower.includes('check')) return <CheckCircle size={24} />;
  if (lower.includes('gem') || lower.includes('diamond')) return <Gem size={24} />;
  if (lower.includes('shield') || lower.includes('lock')) return <ShieldCheck size={24} />;
  if (lower.includes('box') || lower.includes('shipping') || lower.includes('seam')) return <Box size={24} />;
  return <Sparkles size={24} />;
};

export default function AboutPage() {
  const dispatch = useDispatch();

  const { pageData, loading, error } = useSelector((state) => state.pages || { pageData: {}, loading: {}, error: {} });

  const data = pageData[slug];
  const isLoading = loading[slug];
  const pageError = error[slug];

  useEffect(() => {
    if (!data && !isLoading) {
      dispatch(fetchPageBySlug(slug));
    }
  }, [data, isLoading, dispatch]);

  // Handle dynamic document title updates
  useEffect(() => {
    if (data?.page?.title) {
      document.title = `${data.page.title} | Manyavar`;
    }
  }, [data]);

  const handleRetry = () => {
    dispatch(fetchPageBySlug(slug));
  };

  if (isLoading) {
    return (
      <div className="cms-container py-5">
        <div className="container">
          <div className="skeleton-banner rounded-4 mb-5"></div>
          <div className="skeleton-text w-50 mb-4"></div>
          <div className="skeleton-text w-75 mb-3"></div>
          <div className="skeleton-text w-100 mb-3"></div>
          <div className="skeleton-text w-100 mb-3"></div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="cms-container d-flex align-items-center justify-content-center py-5">
        <div className="text-center p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <div className="text-danger mb-4">
            <RefreshCw size={48} className="animate-spin" />
          </div>
          <h3 className="fw-bold mb-2">Error Loading Page</h3>
          <p className="text-muted mb-4">{pageError}</p>
          <div className="d-flex gap-3 justify-content-center">
            <button onClick={handleRetry} className="btn btn-warning px-4 py-2 rounded-pill fw-semibold">
              Try Again
            </button>
            <Link href="/" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.page) {
    return (
      <div className="cms-container d-flex align-items-center justify-content-center py-5">
        <div className="text-center p-5 bg-white border rounded-4 shadow-sm" style={{ maxWidth: '500px' }}>
          <h3 className="fw-bold mb-2">Page Not Found</h3>
          <p className="text-muted mb-4">The about page is currently not configured or published on the CMS.</p>
          <Link href="/" className="btn btn-warning px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { page, banner } = data;

  return (
    <div className="cms-container">
      {/* Dynamic SEO Meta Schema Injection */}
      {page.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.schema_markup }}
        />
      )}

      {/* Page Header (Banner or Simple Title) */}
      {banner && banner.status ? (
        <div className="cms-banner">
          {banner.video_path ? (
            <video
              src={getMediaUrl(banner.video_path)}
              autoPlay
              loop
              muted
              playsInline
              className="cms-banner-media"
            />
          ) : banner.image_path ? (
            <img
              src={getImageUrl(banner.image_path)}
              alt={banner.title || page.title}
              className="cms-banner-media"
            />
          ) : null}
          <div className="cms-banner-overlay"></div>
          <div className="cms-banner-content">
            {banner.subtitle && <p className="cms-banner-subtitle">{banner.subtitle}</p>}
            <h1 className="cms-banner-title">{banner.title || page.title}</h1>
            {banner.cta_text && banner.cta_link && (
              <Link href={banner.cta_link} className="cms-banner-cta">
                {banner.cta_text}
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="cms-simple-header">
          <h1 className="cms-simple-title">{page.title}</h1>
          {page.meta_description && <p className="cms-simple-subtitle">{page.meta_description}</p>}
        </div>
      )}

      {/* Main CMS Contents */}
      <div className="cms-body">
        {/* If page content column has generic html */}
        {page.content && (
          <div className="cms-section">
            <div className="rich-text-wrapper" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        )}

        {/* Render sections attached to this page */}
        {page.sections && page.sections.filter(s => s.status).map((section) => {
          switch (section.type) {
            case 'rich_text':
              return (
                <div key={section.id} className="cms-section">
                  <div className="rich-text-wrapper" dangerouslySetInnerHTML={{ __html: section.content?.body }} />
                </div>
              );

            case 'feature_grid':
              return (
                <div key={section.id} className="cms-section">
                  {section.content?.headline && <h3 className="feature-grid-title">{section.content.headline}</h3>}
                  <div className="feature-grid">
                    {section.content?.features?.map((feat, idx) => (
                      <div key={idx} className="feature-card">
                        <div className="feature-icon-box">
                          {renderIcon(feat.icon)}
                        </div>
                        <h4 className="feature-title">{feat.title}</h4>
                        <p className="feature-desc">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'image_text':
              return (
                <div key={section.id} className="cms-section">
                  <div className={`image-text-block ${section.content?.side || 'left'}`}>
                    <div className="image-text-media">
                      <img src={getImageUrl(section.content?.image_url)} alt={section.content?.title} className="image-text-img" />
                    </div>
                    <div className="image-text-content">
                      <h3 className="image-text-title">{section.content?.title}</h3>
                      <div className="image-text-body" dangerouslySetInnerHTML={{ __html: section.content?.body }} />
                    </div>
                  </div>
                </div>
              );

            case 'testimonial_grid':
              return (
                <div key={section.id} className="cms-section">
                  <div className="testimonial-grid">
                    {section.content?.testimonials?.map((test, idx) => (
                      <div key={idx} className="testimonial-card">
                        <div className="testimonial-quote-icon">“</div>
                        <p className="testimonial-text">{test.text}</p>
                        <div className="testimonial-author">
                          <div className="testimonial-avatar">
                            {test.name ? test.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="testimonial-name">{test.name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'video_block':
              return (
                <div key={section.id} className="cms-section">
                  <div className="video-block-card">
                    <div className="video-container">
                      <video
                        className="video-player"
                        controls
                        poster={getImageUrl(section.content?.cover_url)}
                        src={getMediaUrl(section.content?.upload_url || section.content?.video_url)}
                      />
                    </div>
                    {section.content?.title && (
                      <div className="video-block-info">
                        <h4 className="video-block-title">{section.content.title}</h4>
                      </div>
                    )}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
