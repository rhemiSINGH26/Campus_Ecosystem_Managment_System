import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { canteenAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Chat from '../Chat/Chat';
import './Dashboard.css';

const CanteenDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  
  // State for different features
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'home' || activeTab === 'menu') {
        const menuRes = await canteenAPI.getMenu();
        if (menuRes.data.success) {
          setMenuItems(menuRes.data.data || []);
        }
      }
      
      if (activeTab === 'home' || activeTab === 'orders') {
        const ordersRes = await canteenAPI.getOrders();
        if (ordersRes.data.success) {
          const allOrders = ordersRes.data.data || [];
          setOrders(allOrders);
          
          const today = new Date().toDateString();
          const todayOrdersList = allOrders.filter(order => 
            new Date(order.createdAt).toDateString() === today
          );
          setTodayOrders(todayOrdersList.length);
          setTotalRevenue(todayOrdersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await canteenAPI.addMenuItem({
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        available: true
      });
      if (res.data.success) {
        toast.success('Menu item added successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    }
  };

  const handleUpdateAvailability = async (itemId, available) => {
    try {
      const res = await canteenAPI.updateMenuItem(itemId, { available });
      if (res.data.success) {
        toast.success(`Item marked as ${available ? 'available' : 'unavailable'}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await canteenAPI.updateOrderStatus(orderId, status);
      if (res.data.success) {
        toast.success(`Order status updated to ${status}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await canteenAPI.deleteMenuItem(itemId);
      if (res.data.success) {
        toast.success('Menu item deleted successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const renderHome = () => (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Orders</h3>
          <div className="stat-value">{todayOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Today's Revenue</h3>
          <div className="stat-value">₹{totalRevenue}</div>
        </div>
        <div className="stat-card">
          <h3>Menu Items</h3>
          <div className="stat-value">{menuItems.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
      </div>

      <div className="section-card">
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <ul className="item-list">
            {orders.slice(0, 5).map(order => (
              <li key={order._id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <strong style={{fontSize: '16px'}}>Order #{order._id.slice(-6)}</strong>
                    <p style={{margin: '8px 0', color: '#666'}}>
                      Customer: {order.user?.name || 'Unknown'}
                    </p>
                    <div style={{marginBottom: '10px'}}>
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} style={{color: '#666', fontSize: '14px'}}>
                          • {item.menuItem?.name || 'Item'} x{item.quantity} - ₹{item.price}
                        </div>
                      ))}
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'preparing' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {order.status}
                      </span>
                      <strong style={{color: '#667eea'}}>Total: ₹{order.totalAmount}</strong>
                    </div>
                  </div>
                  <span style={{color: '#999'}}>
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No orders yet</p>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2>Quick Menu Overview</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
          {menuItems.slice(0, 6).map(item => (
            <div key={item._id} style={{
              background: item.available ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : '#ccc',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{fontSize: '16px', marginBottom: '8px'}}>{item.name}</h3>
              <div style={{fontSize: '20px', fontWeight: 'bold'}}>₹{item.price}</div>
              <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.9}}>
                {item.available ? 'Available' : 'Out of Stock'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div>
      <div className="section-card">
        <h2>Add New Menu Item</h2>
        <form onSubmit={handleAddMenuItem} className="form-section">
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" name="name" required placeholder="e.g., Veg Burger" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="Item description"></textarea>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" name="price" required step="0.01" placeholder="50" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" required>
              <option value="">Select Category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Menu Item</button>
        </form>
      </div>

      <div className="section-card">
        <h2>Menu Items</h2>
        {menuItems.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {menuItems.map(item => (
              <div key={item._id} style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                  <h3 style={{fontSize: '18px'}}>{item.name}</h3>
                  <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <p style={{color: '#666', marginBottom: '15px', minHeight: '40px'}}>{item.description}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                  <span style={{fontSize: '24px', fontWeight: 'bold', color: '#667eea'}}>₹{item.price}</span>
                  <span className="badge badge-info">{item.category}</span>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    className={`btn ${item.available ? 'btn-danger' : 'btn-success'}`}
                    style={{flex: 1, padding: '10px', fontSize: '13px'}}
                    onClick={() => handleUpdateAvailability(item._id, !item.available)}
                  >
                    {item.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    style={{padding: '10px 15px', fontSize: '13px'}}
                    onClick={() => handleDeleteMenuItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No menu items yet. Add your first item above!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="section-card">
      <h2>Manage Orders</h2>
      {orders.length > 0 ? (
        <ul className="item-list">
          {orders.map(order => (
            <li key={order._id}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px'}}>
                    <strong style={{fontSize: '18px'}}>Order #{order._id.slice(-8)}</strong>
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' :
                      order.status === 'preparing' ? 'badge-warning' : 
                      order.status === 'ready' ? 'badge-info' : 'badge-danger'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{marginBottom: '10px', color: '#666'}}>
                    <strong>Customer:</strong> {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong>Items:</strong>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{marginLeft: '15px', color: '#666', marginTop: '5px'}}>
                        • {item.menuItem?.name || 'Item'} x {item.quantity} - ₹{item.price * item.quantity}
                      </div>
                    ))}
                  </div>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <strong style={{color: '#667eea', fontSize: '18px'}}>Total: ₹{order.totalAmount}</strong>
                    <span style={{color: '#999'}}>
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px'}}>
                  {order.status === 'pending' && (
                    <button 
                      className="btn btn-primary"
                      style={{padding: '8px 12px', fontSize: '13px'}}
                      onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      className="btn btn-success"
                      style={{padding: '8px 12px', fontSize: '13px'}}
                      onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button 
                      className="btn btn-success"
                      style={{padding: '8px 12px', fontSize: '13px'}}
                      onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button 
                      className="btn btn-danger"
                      style={{padding: '8px 12px', fontSize: '13px'}}
                      onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No orders yet</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🍽️ Canteen Dashboard</h1>
        <div className="dashboard-user-info">
          <span className="user-name">Welcome, {user?.name || 'Canteen'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          🏠 Dashboard
        </button>
        <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          📋 Menu
        </button>
        <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 Orders
        </button>
        <button className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          💬 Chat
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'menu' && renderMenu()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'chat' && <Chat />}
          </>
        )}
      </div>
    </div>
  );
};

export default CanteenDashboard;
