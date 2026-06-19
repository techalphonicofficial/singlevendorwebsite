'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./OccasionShop.module.css";
import { fetchCategoriesApi, fetchSubcategoriesApi } from "../store/apiService";
import { getImageUrl } from "../store/apiConfig";

const defaultOccasions = [
  { title: "Wedding", href: "/shop?category=WEDDING", image: "/DAJ_4613.jpg" },
  { title: "Reception", href: "/shop?category=RECEPTION", image: "/DAJ_4366.jpg" },
  { title: "Engagement", href: "/shop?category=ENGAGEMENT", image: "/DAJ_4661.jpg" },
  { title: "Sangeet", href: "/shop?category=SANGEET", image: "/DAJ_4291.jpg" },
];

const vibes = [
  { title: "Royal", href: "/shop", image: "/DAJ_3863.jpg" },
  { title: "Classic", href: "/shop", image: "/DAJ_4110.jpg" },
  { title: "Festive", href: "/shop", image: "/DAJ_4613.jpg" },
  { title: "Elegant", href: "/shop", image: "/DAJ_4661.jpg" },
];

export default function OccasionShop() {
  const [occasions, setOccasions] = useState([]);
  const [vibeCategories, setVibeCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOccasionsAndVibes = async () => {
      try {
        const [categories, subcategories] = await Promise.all([
          fetchCategoriesApi(),
          fetchSubcategoriesApi()
        ]);
        console.log("OccasionShop - Fetched Categories:", categories);
        console.log("OccasionShop - Fetched Subcategories:", subcategories);

        // 1. Process Occasions (Parent Categories)
        const parents = categories.filter((cat) => !cat.parent_category_id);
        const defaultImageMap = {
          'wedding': '/DAJ_4613.jpg',
          'reception': '/DAJ_4366.jpg',
          'engagement': '/DAJ_4661.jpg',
          'sangeet': '/DAJ_4291.jpg'
        };

        const mappedOccasions = parents.map((cat) => {
          const name = cat.name || "";
          const title = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          const cleanName = name.toLowerCase();
          const fallbackImage = defaultImageMap[cleanName] || '/DAJ_4613.jpg';

          return {
            title,
            href: `/shop?category=${encodeURIComponent(name)}`,
            image: cat.image_url ? getImageUrl(cat.image_url) : fallbackImage
          };
        });

        if (mappedOccasions.length > 0) {
          setOccasions(mappedOccasions);
        }

        // 2. Process Vibes (Subcategories)
        const defaultVibeImages = [
          "/DAJ_3863.jpg",
          "/DAJ_4110.jpg",
          "/DAJ_4613.jpg",
          "/DAJ_4661.jpg",
        ];

        const mappedVibes = subcategories.map((sub, index) => {
          const name = sub.name || "";
          const fallbackImage = defaultVibeImages[index % defaultVibeImages.length];

          return {
            title: name,
            href: `/shop?category=${encodeURIComponent(name)}`,
            image: sub.image_url ? getImageUrl(sub.image_url) : fallbackImage
          };
        });

        // Filter: prioritize ones that have non-default custom images first
        const customImageVibes = mappedVibes.filter(v => !v.image.startsWith('/DAJ_'));
        const defaultImageVibes = mappedVibes.filter(v => v.image.startsWith('/DAJ_'));
        const sortedVibes = [...customImageVibes, ...defaultImageVibes];

        if (sortedVibes.length > 0) {
          setVibeCategories(sortedVibes);
        }

      } catch (err) {
        console.error("Failed to load occasion/vibe categories from APIs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOccasionsAndVibes();
  }, []);

  const displayOccasions = occasions.length > 0 ? occasions : defaultOccasions;
  const displayVibes = vibeCategories.length > 0 ? vibeCategories : vibes;

  return (
    <section className={styles.occasionSection}>
      <div className="container-lg">
        <div className={styles.sectionIntro}>
          <p>Curated for celebrations</p>
          <h2>Shop according to occasion</h2>
        </div>

        <div className={styles.occasionGrid}>
          {displayOccasions.map((item) => (
            <Link href={item.href} className={styles.occasionCard} key={item.title}>
              <Image
                src={item.image}
                alt={`${item.title} occasion wear`}
                width={420}
                height={170}
                className={styles.occasionImage}
                unoptimized
              />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        <div className={styles.vibePanel}>
          <h3>WHAT&apos;S YOUR VIBE?</h3>
          <div className={styles.vibeGrid}>
            {displayVibes.map((item) => (
              <Link href={item.href} className={styles.vibeCard} key={item.title}>
                <div className={styles.vibeImageWrap}>
                  <Image
                    src={item.image}
                    alt={`${item.title} style`}
                    width={330}
                    height={390}
                    className={styles.vibeImage}
                    unoptimized
                  />
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link href="/subcategories" className="btn-primary-custom" style={{ background: '#bf8a52', borderColor: '#bf8a52', color: '#fff', textDecoration: 'none' }}>
              See All Subcategories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
