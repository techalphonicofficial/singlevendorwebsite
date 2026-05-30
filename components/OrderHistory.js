import React, { useState } from 'react';
import { FiBox, FiCalendar, FiClock } from 'react-icons/fi';
import './userprofile.css';

const dummyOrders = [
  {
    id: '#ORD-73921',
    product: 'Premium Silk Kurta Set',
    date: 'May 18, 2026',
    time: '10:30 AM',
    amount: '₹4,999',
    status: 'Delivered',
  },
  {
    id: '#ORD-73922',
    product: 'Embroidered Sherwani',
    date: 'May 16, 2026',
    time: '02:15 PM',
    amount: '₹12,499',
    status: 'Processing',
  },
  {
    id: '#ORD-73923',
    product: 'Classic Cotton Nehru Jacket',
    date: 'May 14, 2026',
    time: '09:45 AM',
    amount: '₹2,299',
    status: 'Shipped',
  },
  {
    id: '#ORD-73924',
    product: 'Festive Wear Pyjama',
    date: 'May 10, 2026',
    time: '04:20 PM',
    amount: '₹1,499',
    status: 'Pending',
  }
];

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <span className="status-badge-premium status-delivered-premium">Delivered</span>;
    case 'processing':
      return <span className="status-badge-premium status-processing-premium">Processing</span>;
    case 'shipped':
      return <span className="status-badge-premium status-shipped-premium">Shipped</span>;
    case 'pending':
      return <span className="status-badge-premium status-pending-premium">Pending</span>;
    default:
      return <span className="status-badge-premium">{status}</span>;
  }
};

const getActions = (status) => {
  if (status.toLowerCase() === 'delivered') {
    return (
      <div className="order-action-buttons">
        <button className="action-btn-premium action-replace">Replace</button>
        <button className="action-btn-premium action-refund">Refund</button>
      </div>
    );
  }
  if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'processing') {
    return (
      <div className="order-action-buttons">
        <button className="action-btn-premium action-cancel" style={{ float: 'none' }}>Cancel Order</button>
      </div>
    );
  }
  return <span className="action-disabled" style={{ textAlign: 'left' }}>No actions available</span>;
};

const OrderHistory = () => {
  const [orders, setOrders] = useState(dummyOrders);

  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium">
        <h3>Order History</h3>
      </div>
      
      <div className="order-cards-container">
        {orders.map((order, index) => (
          <div key={index} className="order-card-modern">
            <div className="order-card-header">
              <div className="order-id-badge">{order.id}</div>
              <div className="order-date-time">
                <FiCalendar className="icon-sm" /> <span>{order.date}</span>
                <span className="dot-separator">•</span>
                <FiClock className="icon-sm" /> <span>{order.time}</span>
              </div>
            </div>
            
            <div className="order-card-body">
              <div className="order-product-info">
                <div className="order-product-icon">
                  <FiBox />
                </div>
                <div className="order-product-details">
                  <h4>{order.product}</h4>
                  <p className="order-product-price">{order.amount}</p>
                </div>
              </div>
              
              <div className="order-card-actions">
                {getStatusBadge(order.status)}
                {getActions(order.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
