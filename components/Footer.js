import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='d-none d-md-flex '>
      <div className="container-lg py-5">
        <div className="row gy-5">
          <div className="col-md-4">
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>MANYAVAR</h5>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>A premium ethnic wear destination offering curated collections for weddings, festivals, and special occasions.</p>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Shop</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link href="/shop" className="footer-link">All Products</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/shop" className="footer-link">New Arrivals</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/shop" className="footer-link">Sale</Link></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Company</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link href="/about" className="footer-link">About Us</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/contact" className="footer-link">Contact</Link></li>
              <li style={{ marginBottom: '10px' }}><Link href="/" className="footer-link">FAQs</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Contact & Support</h6>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
              <strong>Email:</strong> support@manyavar.com
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
              <strong>Phone:</strong> +91 11 4000 1234
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              <strong>Hours:</strong> Mon-Sun 10AM - 8PM IST
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2c2c2c', marginTop: '40px', paddingTop: '30px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
          © 2026 Manyavar. All rights reserved. | <Link href="/" className="footer-link" style={{ marginLeft: '8px' }}>Privacy Policy</Link> | <Link href="/" className="footer-link" style={{ marginLeft: '8px' }}>Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
