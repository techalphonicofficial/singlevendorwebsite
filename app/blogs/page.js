'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogsApi } from '../../store/apiService';
import { getImageUrl } from '../../store/apiConfig';
import '../stylefile/blog.css';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Our Blog & Insights | Dope Jewells';

    const loadBlogs = async () => {
      try {
        const response = await fetchBlogsApi();
        const list = response?.blogs || (Array.isArray(response) ? response : []);
        setBlogs(list);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        setError('Unable to load articles at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

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

  return (
    <main>
      <section className="blog-hero">
        <div className="container-lg">
          <h1>Our Editorial</h1>
          <p>Explore jewellery care advice, style guides, and design insights curated by our master artisans.</p>
        </div>
      </section>

      <section className="blog-container">
        <div className="container-lg">
          {loading ? (
            <div className="blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="blog-shimmer-card">
                  <div className="shimmer-block" style={{ height: '200px', width: '100%' }} />
                  <div className="shimmer-block" style={{ height: '14px', width: '30%', margin: '20px 24px 10px 24px' }} />
                  <div className="shimmer-block" style={{ height: '24px', width: '80%', margin: '0 24px 10px 24px' }} />
                  <div className="shimmer-block" style={{ height: '14px', width: '90%', margin: '0 24px 20px 24px' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No blog articles found.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article key={blog.id} className="blog-card">
                  <div className="blog-card-media">
                    <img
                      src={getImageUrl(blog.featured_image) || '/DAJ_4366.jpg'}
                      alt={blog.title}
                      className="blog-card-img"
                    />
                    <span className="blog-card-badge">Jewellery Guide</span>
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-card-date">{formatDate(blog.published_at)}</div>
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-card-summary">{blog.summary}</p>
                    <Link href={`/blogs/${blog.slug}`} className="blog-card-link">
                      Read Article <span>&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
