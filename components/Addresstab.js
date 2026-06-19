import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import './userprofile.css';

const initialAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'Rajesh Singh',
    phone: '+91 9876543210',
    addressLine: 'A-123, Rosewood Apartments, Sector 45',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zip: '201301',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Work',
    name: 'Rajesh Singh',
    phone: '+91 9876543210',
    addressLine: 'Tech Park Tower B, 4th Floor, Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    zip: '122002',
    isDefault: false,
  }
];

const Addresstab = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({ type: 'Home', name: '', phone: '', addressLine: '', city: '', state: '', zip: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => addr.id === editingId ? { ...formData, id: editingId, isDefault: addr.isDefault } : addr));
    } else {
      const newAddress = {
        ...formData,
        id: Date.now(),
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-card-premium">
      <div className="card-header-premium">
        <h3>My Addresses</h3>
        {!showForm && (
          <button className="btn-primary-custom" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleAddNew}>
            + Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <div className="address-form-container">
          <h4 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Address' : 'Add New Address'}</h4>
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group-full">
                <label className="address-label">Address Type</label>
                <select name="type" className="address-input" value={formData.type} onChange={handleChange} required>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="address-label">Full Name</label>
                <input type="text" name="name" className="address-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="address-label">Phone Number</label>
                <input type="tel" name="phone" className="address-input" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="form-group-full">
                <label className="address-label">Address (House No, Building, Street, Area)</label>
                <input type="text" name="addressLine" className="address-input" value={formData.addressLine} onChange={handleChange} required />
              </div>

              <div>
                <label className="address-label">City / District</label>
                <input type="text" name="city" className="address-input" value={formData.city} onChange={handleChange} required />
              </div>
              <div>
                <label className="address-label">State</label>
                <input type="text" name="state" className="address-input" value={formData.state} onChange={handleChange} required />
              </div>
              
              <div>
                <label className="address-label">Pincode</label>
                <input type="text" name="zip" className="address-input" value={formData.zip} onChange={handleChange} required />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary-custom" style={{ padding: '10px 24px', flex: 1 }}>Save Address</button>
                <button type="button" className="btn-secondary-custom" style={{ padding: '10px 24px', flex: 1, color: '#1a1a1a', borderColor: '#e5e5e5' }} onClick={handleCancelForm}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-card ${addr.isDefault ? 'default-address' : ''}`}>
              <div className="address-badge-container">
                <span className="address-type-badge">{addr.type}</span>
                {addr.isDefault && <span className="address-default-tag">✓ Default</span>}
              </div>
              
              <h4 className="address-name">{addr.name}</h4>
              
              <div className="address-details">
                {addr.addressLine}<br />
                {addr.city}, {addr.state} - {addr.zip}
                <span className="address-phone">{addr.phone}</span>
              </div>
              
              <div className="address-actions">
                <button className="btn-address-action btn-edit" onClick={() => handleEdit(addr)}>Edit</button>
                <button className="btn-address-action btn-delete" onClick={() => handleDelete(addr.id)}>Delete</button>
                
                {!addr.isDefault && (
                  <button className="btn-address-action btn-set-default" onClick={() => handleSetDefault(addr.id)}>
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="add-address-card" onClick={handleAddNew}>
            <div className="add-address-icon">
              <FiPlus />
            </div>
            <span className="add-address-text">Add New Address</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresstab;
