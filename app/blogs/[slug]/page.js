'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBlogDetailApi } from '../../../store/apiService';
import { getImageUrl } from '../../../store/apiConfig';
import '../../stylefile/blog.css';

export default function BlogDetailPage({ params }) {
  const { slug } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadBlogDetail = async () => {
      try {
        const response = await fetchBlogDetailApi(slug);
        const detail = response?.blog || response;
        if (detail) {
          setBlog(detail);
          document.title = `${detail.title} | Dope Jewells`;
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        console.error('Failed to load blog detail:', err);
        setError('Unable to load the article details at this time.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogDetail();
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="blog-container py-5 mt-5">
        <div className="container-lg">
          <div className="shimmer-block w-25 mb-3" style={{ height: '14px' }} />
          <div className="shimmer-block w-75 mb-4" style={{ height: '40px' }} />
          <div className="shimmer-block w-100 mb-5" style={{ height: '400px' }} />
          <div className="shimmer-block w-100 mb-3" style={{ height: '16px' }} />
          <div className="shimmer-block w-100 mb-3" style={{ height: '16px' }} />
          <div className="shimmer-block w-75 mb-3" style={{ height: '16px' }} />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container-lg py-5 text-center mt-5">
        <h2 className="text-danger mb-4">{error || 'Article Not Found'}</h2>
        <Link href="/blogs" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <main>
      <header className="blog-detail-header">
        <div className="container-lg">
          <div className="blog-detail-meta">
            <span>Published on {formatDate(blog.published_at)}</span>
          </div>
          <h1 className="blog-detail-title">{blog.title}</h1>
          {blog.summary && <p className="blog-detail-summary">{blog.summary}</p>}
        </div>
      </header>

      <div className="container-lg">
        {blog.featured_image && (
          <div className="blog-detail-hero-image-wrapper">
            <img
              src={getImageUrl(blog.featured_image)}
              alt={blog.title}
              className="blog-detail-hero-image"
            />
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <article className="blog-detail-body py-5">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>
            <div className="py-4 border-top text-center mb-5">
              <Link href="/blogs" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold">
                &larr; Back to Editorial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
