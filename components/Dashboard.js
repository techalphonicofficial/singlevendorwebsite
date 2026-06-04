import React from 'react';
import { Package, Heart, Award, MapPin, ShoppingBag } from 'lucide-react';
import './userprofile.css';
import { useSelector } from 'react-redux';

const recentOrders = [
  { id: '#MNY-4567', date: 'Oct 12, 2023', status: 'Delivered', total: '₹ 12,500', statusCode: 'delivered' },
  { id: '#MNY-4568', date: 'Oct 15, 2023', status: 'Processing', total: '₹ 8,950', statusCode: 'processing' },
  { id: '#MNY-4569', date: 'Nov 02, 2023', status: 'Pending', total: '₹ 21,000', statusCode: 'pending' },
  { id: '#MNY-4570', date: 'Nov 05, 2023', status: 'Shipped', total: '₹ 15,200', statusCode: 'shipped' },
];

const renderActions = (status) => {
  if (status === 'Pending' || status === 'Processing') {
    return (
      <button className="action-btn-premium action-cancel">
        Cancel
      </button>
    );
  }
  if (status === 'Delivered') {
    return (
      <div className="action-flex">
        <button className="action-btn-premium action-replace">
          Replace
        </button>
        <button className="action-btn-premium action-refund">
          Refund
        </button>
      </div>
    );
  }
  return <span className="action-disabled">-</span>;
};

const Dashboard = () => {
    const { isAuthenticated,user } = useSelector((state) => state.auth);
  return (
    <div className="dashboard-container">
      <div className="dashboard-header-premium">
     { isAuthenticated && <h2>Namaste, {user.name}!</h2> }
        <p>Welcome to your personal dashboard. Manage your elegant ensembles, track your bespoke orders, and view your exclusive privilege points all in one place.</p>
      </div>

      {/* STATS CARDS */}
      <div className="dashboard-stats">
        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>12</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Package size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>2</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Heart size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>5</h3>
            <p>Saved Styles</p>
          </div>
        </div>

        <div className="stat-card-premium">
          <div className="stat-icon-premium">
            <Award size={24} />
          </div>
          <div className="stat-details-premium">
            <h3>350</h3>
            <p>Privilege Points</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS OVERVIEW */}
      <div className="dashboard-bottom-full">
        <div className="dashboard-card-premium table-card">
          <div className="card-header-premium">
            <h3>Recent Purchases</h3>
            <a href="/orders" className="view-all-link-premium">View All</a>
          </div>
          <div className="table-responsive">
            <table className="recent-orders-table-premium">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th className="text-center">Status</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} className="table-row-premium">
                    <td className="order-id-cell">{order.id}</td>
                    <td className="order-date-cell">{order.date}</td>
                    <td className="order-total-cell">{order.total}</td>
                    <td className="text-center">
                      <span className={`status-badge-premium status-${order.statusCode}-premium`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="action-column">
                      {renderActions(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
