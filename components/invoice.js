import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import './userprofile.css';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // API READY LOGIC
  useEffect(() => {
    // Replace this with your actual API call when ready
    // fetch('/api/user/invoices')
    //   .then(res => res.json())
    //   .then(data => { setInvoices(data); setLoading(false); })
    //   .catch(err => console.error(err));
    
    // Simulating API response delay for UI testing
    const fetchDummyInvoices = setTimeout(() => {
      setInvoices([
        {
          id: 'INV-2026-001',
          orderId: '#ORD-73921',
          date: 'May 18, 2026',
          amount: '₹4,999',
          url: '#' // This should be the real PDF URL returned from your API
        },
        {
          id: 'INV-2026-002',
          orderId: '#ORD-73922',
          date: 'May 16, 2026',
          amount: '₹12,499',
          url: '#'
        },
        {
          id: 'INV-2026-003',
          orderId: '#ORD-73923',
          date: 'May 14, 2026',
          amount: '₹2,299',
          url: '#'
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(fetchDummyInvoices);
  }, []);

  const handleDownload = (invoiceId, url) => {
    // Logic to download invoice
    // E.g., window.open(url, '_blank') or triggering an API download stream
    alert(`Downloading Invoice: ${invoiceId}`);
  };

  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium">
        <h3>My Invoices</h3>
      </div>

      <div className="invoice-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            No invoices found.
          </div>
        ) : (
          invoices.map((invoice, index) => (
            <div key={index} className="invoice-item">
              <div className="invoice-left">
                <div className="invoice-icon">
                  <FiFileText />
                </div>
                <div className="invoice-details">
                  <h4>{invoice.id}</h4>
                  <p>Order Ref: <span className="order-ref">{invoice.orderId}</span> • {invoice.date}</p>
                </div>
              </div>
              
              <div className="invoice-right">
                <div className="invoice-amount">{invoice.amount}</div>
                <button 
                  className="btn-download-invoice"
                  onClick={() => handleDownload(invoice.id, invoice.url)}
                >
                  <FiDownload size={16} /> Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Invoice;