import Link from 'next/link';
import Image from "next/image";
import { FaTruck, FaShieldAlt, FaUndoAlt } from "react-icons/fa";
import OccasionShop from "../components/OccasionShop";


const createPlaceholderImage = (text, width = 520, height = 360) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#e8dcc8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="20" font-weight="500" fill="#8b7355">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const categories = [
  { title: 'Sherwanis', subtitle: 'Royal wedding & groom collection', href: '/shop', img: "/DAJ_4613.jpg" },
  { title: 'Kurta Sets', subtitle: 'Traditional styles for every celebration', href: '/shop', img: "/DAJ_4661.jpg" },
  { title: 'Indo-Western', subtitle: 'Modern fusion fashion for men', href: '/shop', img: "/DAJ_4366.jpg" },
  { title: 'Formal-Trousers', subtitle: 'Sharp fits for office & occasions', href: '/shop', img: "/DAJ_4291.jpg" },
  { title: 'Indo-Western', subtitle: 'Modern fusion fashion for men', href: '/shop', img: "/DAJ_4366.jpg" },
  { title: 'Formal-Trousers', subtitle: 'Sharp fits for office & occasions', href: '/shop', img: "/DAJ_4291.jpg" }
];

const collections = [
  { title: 'Wedding', description: 'Regal sherwanis, bandhgalas, and groom wear for the most special day.', href: '/shop', badge: 'New' },
  { title: 'Festive', description: 'Bright, handcrafted kurtas and festive sets for celebrations.', href: '/shop', badge: 'Popular' },
  { title: 'Essentials', description: 'Daily tradition with contemporary comfort for modern lives.', href: '/shop', badge: 'Trending' }
];

const highlights = [
  { title: 'Free shipping over ₹1,999', description: 'Fast delivery across India.', icon: <FaTruck /> },
  { title: 'Easy returns', description: 'Hassle-free exchange & return support.', icon: <FaUndoAlt /> },
  { title: 'Gift packaging', description: 'Special festive wrap for celebrations.', icon: <FaShieldAlt /> }
];

const lookbook = [
  {
    title: 'Suit',
    subtitle: 'Classic tailoring for modern gentlemen',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Koti',
    subtitle: 'Traditional layers with timeless elegance',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Indo Westerns',
    subtitle: 'Fusion styles for weddings & parties',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Sherwani',
    subtitle: 'Royal ethnic wear for groom collection',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Suiting Shirting Fabrics',
    subtitle: 'Premium fabrics crafted for perfection',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Ethnic Wear Fabrics',
    subtitle: 'Traditional textures with rich craftsmanship',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Kurta',
    subtitle: 'Festive essentials for every occasion',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Bomber Jacket',
    subtitle: 'Contemporary outerwear with bold style',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Hunter Suit',
    subtitle: 'Sharp statement outfits with luxury finish',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Shirt',
    subtitle: 'Everyday sophistication in every fit',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Hoodies',
    subtitle: 'Comfort meets effortless street fashion',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Sweatshirts',
    subtitle: 'Relaxed styles for casual layering',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Jeans',
    subtitle: 'Modern denim designed for versatility',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Formal Trousers',
    subtitle: 'Tailored fits for refined dressing',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Chinos',
    subtitle: 'Smart casual essentials for daily wear',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Tie',
    subtitle: 'Elegant finishing touch for formal looks',
    href: '/shop', img: "/DAJ_4291.jpg"
  },
  {
    title: 'Belts',
    subtitle: 'Premium accessories with timeless appeal',
    href: '/shop', img: "/DAJ_4291.jpg"
  }
];

export default function HomePage() {
  return (
    <main>
      {/* video */}
      <section className="w-full p-0 m-0 overflow-hidden video-section">
        <div className="video-marquee" aria-hidden="true">
          <div className="video-marquee-track">
            <span>Manyavar Mohey Wedding Collection</span>
            <span>Celebrate every moment in style</span>
            <span>New festive arrivals now live</span>
            <span>Manyavar Mohey Wedding Collection</span>
            <span>Celebrate every moment in style</span>
            <span>New festive arrivals now live</span>
          </div>
        </div>
        <video
          className='hero-video'
          autoPlay
          muted
          loop
          playsInline>
          <source src="/manyavar.mp4" type="video/mp4" />
        </video>
        <div className="video-cta">

          <Link href="/shop" className="video-btn ">Shop Now</Link>
        </div>
      </section>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container-lg py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 mb-4 mb-lg-0 hero-section">
              <span className="badge-custom">DISCOVER NEW ARRIVALS</span>
              <h1>Celebrate every moment in style.</h1>
              <p>
                Shop premium ethnic wear for weddings, festivals and special occasions with curated looks crafted for today.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <Link href="/shop" className="btn-primary-custom">Shop Now</Link>
                <Link href="/about" className="btn-secondary-custom">Learn More</Link>
              </div>
            </div>
            <div className="col-lg-6 px-3 d-flex align-items-center justify-content-center hero-image-wrapper">
              <Image
                src="/DAJ_3863.jpg"
                alt="Premium ethnic wear collection - Celebrate every moment in style"
                width={500}
                height={550}
                className="img-fluid w-100 hero-banner-img"
                style={{ maxHeight: '550px', objectFit: 'cover', borderRadius: '8px' }}
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-featured">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="section-title">Shop by category</p>
            <h2 className="section-heading">Featured Collections</h2>
          </div>
          <div className="row g-4">
            {categories.map((item) => (
              <div key={item.title} className="col-md-3 col-6">
                <Link href={item.href} className="category-card">
                  <div className="category-cover">
                    <img src={item.img} alt={item.title} className='img-fluid' />
                  </div>
                  <div className="card-content">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* occasion */}
      <OccasionShop />

      {/* Collections Section */}
      <section className="collections-section">
        <div className="container-lg">
          <div className="text-center mb-5">
            <p className="section-title">Discover the range</p>
            <h2 className="section-heading">Shop by collection</h2>
          </div>
          <div className="row g-4">
            {collections.map((item) => (
              <div key={item.title} className="col-md-4">
                <div className="collection-card">
                  <span className="collection-badge">{item.badge}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link href={item.href}>Browse {item.title} →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Lookbook Section */}
      <section className="lookbook-section">
        <div className="container-lg">
          {/* Top Text Section */}
          <div className="text-center mb-5">
            <p className="section-title">Feel the festive spirit</p>
            <h2 className="section-heading">Style inspiration for every season.</h2>
            <p className="section-description">From heritage weddings to modern celebrations, find statement outfits and accessories that shine.</p>
          </div>

          {/* Full-width Scroll Section */}
          <div className="lookbook-scroll-container">
            <div className="lookbook-scroll-wrapper">
              {lookbook.concat(lookbook).map((item, index) => (
                <div key={`${item.title}-${index}`} className="lookbook-card">
                  <img src={item.img} alt={item.title} className='object-cover' />
                  <div className="lookbook-card-content">
                    <h4>{item.title}</h4>
                    <p className="subtitle">{item.subtitle}</p>
                    <Link href={item.href}>Shop now →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <div className="text-center mt-5">
            <Link href="/shop" className="btn-primary-custom">Explore Now</Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="container-lg">
          <div className="row g-4">
            {highlights.map((item) => (
              <div key={item.title} className="col-md-4">
                <div className="highlight-card">

                  <div className="highlight-icon">
                    {item.icon}
                  </div>

                  <div className="highlight-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
