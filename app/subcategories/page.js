'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { fetchSubcategoriesApi } from '../../store/apiService';
import { getImageUrl } from '../../store/apiConfig';

const defaultVibes = [
  { title: "Royal", href: "/shop", image: "/DAJ_3863.jpg" },
  { title: "Classic", href: "/shop", image: "/DAJ_4110.jpg" },
  { title: "Festive", href: "/shop", image: "/DAJ_4613.jpg" },
  { title: "Elegant", href: "/shop", image: "/DAJ_4661.jpg" },
];

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Explore Vibes & Subcategories | Manyavar";

    const loadSubcategories = async () => {
      try {
        const data = await fetchSubcategoriesApi();
        const defaultVibeImages = [
          "/DAJ_3863.jpg",
          "/DAJ_4110.jpg",
          "/DAJ_4613.jpg",
          "/DAJ_4661.jpg",
        ];

        const mapped = data.map((sub, index) => {
          const name = sub.name || "";
          const fallbackImage = defaultVibeImages[index % defaultVibeImages.length];

          return {
            title: name,
            href: `/shop?category=${encodeURIComponent(name)}`,
            image: sub.image_url ? getImageUrl(sub.image_url) : fallbackImage
          };
        });

        // Prioritize subcategories with custom images
        const customImageVibes = mapped.filter(v => !v.image.startsWith('/DAJ_'));
        const defaultImageVibes = mapped.filter(v => v.image.startsWith('/DAJ_'));
        const sorted = [...customImageVibes, ...defaultImageVibes];

        if (sorted.length > 0) {
          setSubcategories(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSubcategories();
  }, []);

  const displayList = subcategories.length > 0 ? subcategories : defaultVibes;

  return (
    <main className="py-5" style={{ background: '#fbf6ed', minHeight: '100vh' }}>
      <div className="container py-4">
        {/* Back Link */}
        <div className="mb-4">
          <Link href="/" className="d-inline-flex align-items-center gap-2 text-decoration-none fw-semibold" style={{ color: '#9f7a51' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Section Intro */}
        <div className="text-center mb-5" style={{ maxWidth: '720px', margin: '0 auto 48px' }}>
          <p style={{ color: '#9f7a51', fontSize: '13px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Explore All Categories
          </p>
          <h1 style={{ color: '#17110c', fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            What&apos;s Your Vibe?
          </h1>
          <p className="text-muted mt-2">Browse our curated subcategories to find your perfect ethnic ensemble.</p>
        </div>

        {loading ? (
          /* Shimmer Cards Grid */
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="col">
                <div style={{ background: '#fff', borderRadius: '12px', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  <div className="shimmer-block" style={{ height: '280px', width: '100%', borderRadius: '999px 999px 10px 10px', background: '#eee', animation: 'pulse 1.5s infinite' }} />
                  <div className="shimmer-block mt-3" style={{ height: '14px', width: '60%', margin: '12px auto 6px', background: '#eee', animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Dynamic Subcategories Grid */
          <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
            {displayList.map((item) => (
              <div key={item.title} className="col">
                <Link href={item.href} className="text-decoration-none text-dark d-block text-center" style={{ transition: 'transform 0.3s ease' }}>
                  <div 
                    style={{
                      aspectRatio: '0.78 / 1',
                      background: '#f8e4da',
                      border: '7px solid #fde5dc',
                      borderRadius: '999px 999px 10px 10px',
                      boxShadow: '0 18px 40px rgba(91, 38, 18, 0.12)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.45s ease' }}
                      className="vibe-grid-img"
                      unoptimized
                    />
                  </div>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', letterSpacing: '0.12em', marginTop: '16px', textTransform: 'uppercase', color: '#18110c' }}>
                    {item.title}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* CSS Styles for animations/hovers */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .vibe-grid-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </main>
  );
}
