'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/toastSlice';
import { submitInquiryApi } from '../../store/apiService';

const faqs = [
  { question: 'How do I place a custom order?', answer: 'Reach out via our contact form and our style experts will guide you through customization options.' },
  { question: 'What is the delivery timeframe?', answer: 'Most orders ship within 3-5 business days, with faster delivery available for select locations.' },
  { question: 'Can I return my order?', answer: 'Yes. Returns and exchanges are available within 7 days of delivery on eligible items.' }
];

export default function ContactPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'contact'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      dispatch(showToast({ message: 'Please fill in all required fields.', type: 'error' }));
      return;
    }

    try {
      setLoading(true);
      const res = await submitInquiryApi(formData);
      dispatch(showToast({ message: res.message || 'Your inquiry has been submitted successfully.', type: 'success' }));
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        type: 'contact'
      });
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to submit inquiry. Please try again.', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

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
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="+91 12345 67890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="5"
                    placeholder="Tell us about your request"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-warning" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
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
