import Link from 'next/link';

// const createPlaceholderImage = (text, width = 900, height = 650) => {
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#f1ede7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#5a4d3a">${text}</text></svg>`;
//   return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
// };

const stats = [
  { label: 'Years of heritage', value: '18+' },
  { label: 'Stores across India', value: '250+' },
  { label: 'Monthly curated looks', value: '1200+' }
];

const story = [
  { year: '2005', detail: 'Manyavar debut with timeless wedding wear for modern grooms.' },
  { year: '2012', detail: 'Expanded into festive weddings, kurtas and family celebrations.' },
  { year: '2024', detail: 'Digital storefront crafted for curated shopping experience.' }
];

export default function AboutPage() {
  return (
    <main className="py-5">
      <div className="container">
        <section className="row align-items-center mb-5">
          <div className="col-lg-6">
            <span className="badge bg-warning text-dark mb-3">Our story</span>
            <h1 className="display-5 fw-bold">Celebrating style, tradition, and craftsmanship.</h1>
            <p className="lead text-muted">Manyavar brings premium craftsmanship, festive styling, and wedding-ready attire to families across India.</p>
            <p>Step into a world of curated ethnic wear designed to make every celebration memorable.</p>
            <Link href="/shop" className="btn btn-warning mb-4 md-mb-0">Explore Collections</Link>
          </div>
          <div className="col-lg-6">
            <div className="about-hero rounded-4 overflow-hidden shadow-lg">
              <img src='/multi.png' alt="About Manyavar" className="img-fluid" />
            </div>
          </div>
        </section>

        <section className="row g-4 mb-5">
          {stats.map((item) => (
            <div key={item.label} className="col-sm-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                <div className="display-6 fw-bold text-warning">{item.value}</div>
                <p className="text-muted mb-0">{item.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-5">
          <h2 className="h2 fw-bold mb-4">Our journey</h2>
          <div className="timeline">
            {story.map((item) => (
              <div key={item.year} className="timeline-item p-4 rounded-4 shadow-sm mb-4 bg-white">
                <div className="d-flex align-items-center mb-2">
                  <span className="badge bg-dark me-3">{item.year}</span>
                  <h3 className="h5 mb-0">Milestone</h3>
                </div>
                <p className="text-muted mb-0">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h2 className="h4 fw-bold">Design philosophy</h2>
              <p className="text-muted">We merge grand Indian heritage with modern styling to build outfits that feel festive, comfortable, and premium.</p>
              <ul className="list-unstyled text-muted">
                <li className="mb-3">Premium fabrics and contemporary cuts</li>
                <li className="mb-3">Embroideries that elevate every occasion</li>
                <li>Styling for weddings, cultural celebrations, and gifting</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-dark text-white">
              <h2 className="h4 fw-bold">Beyond the outfit</h2>
              <p className="text-white-75">We design every collection to be part of the celebration, from festive family gatherings to grand wedding ceremonies.</p>
              <Link href="/contact" className="btn btn-outline-warning">Contact our style team</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
