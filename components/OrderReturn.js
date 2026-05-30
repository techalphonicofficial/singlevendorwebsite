import React, { useState } from 'react';
import { FiBox, FiCheck, FiTruck, FiRefreshCcw, FiAlertCircle } from 'react-icons/fi';
import './userprofile.css';

const dummyReturns = [
  {
    id: '#RET-84920',
    product: 'Premium Silk Kurta Set',
    reason: 'Size issue - Too small',
    amount: '₹4,999',
    requestDate: 'May 18, 2026',
    status: 'Pickup Scheduled',
    refundMode: 'Original Payment Method',
    progress: 50, // 0 to 100
    steps: [
      { label: 'Return Requested', state: 'completed', date: 'May 18' },
      { label: 'Pickup Scheduled', state: 'active', date: 'May 20' },
      { label: 'Refund Processed', state: 'pending', date: 'Expected May 24' }
    ]
  },
  {
    id: '#RET-84921',
    product: 'Embroidered Sherwani',
    reason: 'Defective product',
    amount: '₹12,499',
    requestDate: 'May 15, 2026',
    status: 'Refund Processed',
    refundMode: 'Store Wallet',
    progress: 100,
    steps: [
      { label: 'Return Requested', state: 'completed', date: 'May 15' },
      { label: 'Item Picked Up', state: 'completed', date: 'May 16' },
      { label: 'Refund Processed', state: 'completed', date: 'May 17' }
    ]
  }
];

const getStepIcon = (state, index) => {
  if (state === 'completed') return <FiCheck />;
  if (state === 'cancelled') return <FiAlertCircle />;
  if (index === 1) return <FiTruck />;
  return <FiRefreshCcw />;
};

const OrderReturn = () => {
  const [returns, setReturns] = useState(dummyReturns);

  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium">
        <h3>My Returns</h3>
      </div>
      
      <div className="order-cards-container">
        {returns.map((item, index) => (
          <div key={index} className="return-card-modern">
            <div className="return-card-header">
              <div className="return-id">Return ID: {item.id}</div>
              <div className="return-date">Requested: {item.requestDate}</div>
            </div>
            
            <div className="return-product-section">
              <div className="return-product-info-left">
                <div className="order-product-icon">
                  <FiBox />
                </div>
                <div className="return-product-details">
                  <h4>{item.product}</h4>
                  <div className="return-reason">Reason: {item.reason}</div>
                </div>
              </div>
              <div className="return-amount-box">
                <p>Refund to: {item.refundMode}</p>
                <h3>{item.amount}</h3>
              </div>
            </div>
            
            <div className="return-tracker-container">
              <div className="return-tracker">
                <div className="tracker-line">
                  <div className="tracker-progress" style={{ width: `${item.progress}%` }}></div>
                </div>
                
                {item.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className={`tracker-step ${step.state}`}>
                    <div className="tracker-icon">
                      {getStepIcon(step.state, stepIndex)}
                    </div>
                    <div className="tracker-label">{step.label}</div>
                    <div className="tracker-date">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderReturn;
