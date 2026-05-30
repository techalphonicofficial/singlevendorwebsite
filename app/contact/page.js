const faqs = [
  { question: 'How do I place a custom order?', answer: 'Reach out via our contact form and our style experts will guide you through customization options.' },
  { question: 'What is the delivery timeframe?', answer: 'Most orders ship within 3-5 business days, with faster delivery available for select locations.' },
  { question: 'Can I return my order?', answer: 'Yes. Returns and exchanges are available within 7 days of delivery on eligible items.' }
];

export default function ContactPage() {
  return (
    <main className="py-5">
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="contact-hero rounded-4 p-5 bg-dark text-white h-100">
              <h1 className="display-6 fw-bold">We’re here to help</h1>
              <p className="text-white-75">Contact our team for styling, order support, and festival shopping guidance.</p>
              <p className="mb-1"><strong>Email:</strong> support@manyavar.com</p>
              <p><strong>Phone:</strong> +91 12345 67890</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h2 className="h5 mb-3">Message our team</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Your name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input type="tel" className="form-control" id="phone" placeholder="+91 12345 67890" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="5" placeholder="Tell us about your request"></textarea>
                </div>
                <button type="submit" className="btn btn-warning">Send Message</button>
              </form>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h2 className="h5">Store locator</h2>
              <p className="text-muted">Find a Manyavar retail store near you for in-person shopping and fittings.</p>
              <ul className="list-unstyled text-muted mb-0">
                <li>Delhi: Select Citywalk</li>
                <li>Mumbai: Phoenix Marketcity</li>
                <li>Bengaluru: Forum Mall</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h2 className="h5">Customer support</h2>
              <p className="text-muted">Need order status, shipment tracking, or styling advice? Our support team is available 7 days a week.</p>
              <p className="mb-0"><strong>Support hours:</strong> 10:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="h2 fw-bold mb-4">Frequently asked questions</h2>
          <div className="row g-4">
            {faqs.map((item) => (
              <div key={item.question} className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <h3 className="h6">{item.question}</h3>
                  <p className="text-muted mb-0">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
