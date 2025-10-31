import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { securityAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Chat from '../Chat/Chat';
import './Dashboard.css';

const SecurityDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  
  // State for different features
  const [entryLogs, setEntryLogs] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [todayEntries, setTodayEntries] = useState(0);
  const [todayExits, setTodayExits] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'home' || activeTab === 'entries') {
        const logsRes = await securityAPI.getEntryLogs();
        if (logsRes.data.success) {
          const logs = logsRes.data.data || [];
          setEntryLogs(logs);
          
          const today = new Date().toDateString();
          setTodayEntries(logs.filter(log => 
            log.type === 'entry' && new Date(log.timestamp).toDateString() === today
          ).length);
          setTodayExits(logs.filter(log => 
            log.type === 'exit' && new Date(log.timestamp).toDateString() === today
          ).length);
        }
      }
      
      if (activeTab === 'lostfound') {
        const lostRes = await securityAPI.getLostItems();
        if (lostRes.data.success) {
          setLostItems(lostRes.data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogEntry = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await securityAPI.logEntry({
        person: formData.get('person'),
        type: formData.get('type'),
        vehicleNumber: formData.get('vehicleNumber'),
        purpose: formData.get('purpose')
      });
      if (res.data.success) {
        toast.success('Entry logged successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log entry');
    }
  };

  const handleAddLostItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await securityAPI.addLostItem({
        itemName: formData.get('itemName'),
        description: formData.get('description'),
        foundLocation: formData.get('foundLocation'),
        status: 'unclaimed'
      });
      if (res.data.success) {
        toast.success('Lost item added successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleUpdateItemStatus = async (itemId, status) => {
    try {
      const res = await securityAPI.updateLostItem(itemId, { status });
      if (res.data.success) {
        toast.success(`Item marked as ${status}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    }
  };

  const renderHome = () => (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Entries</h3>
          <div className="stat-value">{todayEntries}</div>
        </div>
        <div className="stat-card">
          <h3>Today's Exits</h3>
          <div className="stat-value">{todayExits}</div>
        </div>
        <div className="stat-card">
          <h3>Total Logs</h3>
          <div className="stat-value">{entryLogs.length}</div>
        </div>
        <div className="stat-card">
          <h3>Lost Items</h3>
          <div className="stat-value">{lostItems.filter(i => i.status === 'unclaimed').length}</div>
        </div>
      </div>

      <div className="section-card">
        <h2>Recent Entry/Exit Logs</h2>
        {entryLogs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Type</th>
                <th>Vehicle Number</th>
                <th>Purpose</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entryLogs.slice(0, 10).map(log => (
                <tr key={log._id}>
                  <td><strong>{log.person || 'Visitor'}</strong></td>
                  <td>
                    <span className={`badge ${log.type === 'entry' ? 'badge-success' : 'badge-warning'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td>{log.vehicleNumber || 'N/A'}</td>
                  <td>{log.purpose || 'N/A'}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No entry logs yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEntries = () => (
    <div>
      <div className="section-card">
        <h2>Log Entry/Exit</h2>
        <form onSubmit={handleLogEntry} className="form-section">
          <div className="form-group">
            <label>Person Name</label>
            <input type="text" name="person" required placeholder="Enter person name" />
          </div>
          <div className="form-group">
            <label>Entry Type</label>
            <select name="type" required>
              <option value="">Select Type</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Vehicle Number (Optional)</label>
            <input type="text" name="vehicleNumber" placeholder="e.g., KA-01-AB-1234" />
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <textarea name="purpose" placeholder="Purpose of visit"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Log Entry/Exit</button>
        </form>
      </div>

      <div className="section-card">
        <h2>All Entry/Exit Logs</h2>
        {entryLogs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Type</th>
                <th>Vehicle Number</th>
                <th>Purpose</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entryLogs.map(log => (
                <tr key={log._id}>
                  <td><strong>{log.person || 'Visitor'}</strong></td>
                  <td>
                    <span className={`badge ${log.type === 'entry' ? 'badge-success' : 'badge-warning'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td>{log.vehicleNumber || 'N/A'}</td>
                  <td>{log.purpose || 'N/A'}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No entry logs yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLostFound = () => (
    <div>
      <div className="section-card">
        <h2>Add Lost/Found Item</h2>
        <form onSubmit={handleAddLostItem} className="form-section">
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" name="itemName" required placeholder="e.g., Mobile Phone, Wallet" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="Detailed description of the item"></textarea>
          </div>
          <div className="form-group">
            <label>Found Location</label>
            <input type="text" name="foundLocation" required placeholder="Where was it found?" />
          </div>
          <button type="submit" className="btn btn-primary">Add Item</button>
        </form>
      </div>

      <div className="section-card">
        <h2>Lost & Found Items</h2>
        {lostItems.length > 0 ? (
          <ul className="item-list">
            {lostItems.map(item => (
              <li key={item._id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div style={{flex: 1}}>
                    <strong style={{fontSize: '18px'}}>{item.itemName}</strong>
                    <p style={{margin: '10px 0', color: '#666'}}>{item.description}</p>
                    <div style={{display: 'flex', gap: '15px', marginBottom: '10px'}}>
                      <span>📍 Found at: {item.foundLocation}</span>
                      <span className={`badge ${
                        item.status === 'claimed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{color: '#999', fontSize: '14px'}}>
                      Added on: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {item.status === 'unclaimed' && (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleUpdateItemStatus(item._id, 'claimed')}
                      >
                        Mark as Claimed
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No lost items reported</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🔐 Security Dashboard</h1>
        <div className="dashboard-user-info">
          <span className="user-name">Welcome, {user?.name || 'Security'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          🏠 Dashboard
        </button>
        <button className={`nav-btn ${activeTab === 'entries' ? 'active' : ''}`} onClick={() => setActiveTab('entries')}>
          📋 Entry/Exit Logs
        </button>
        <button className={`nav-btn ${activeTab === 'lostfound' ? 'active' : ''}`} onClick={() => setActiveTab('lostfound')}>
          🔍 Lost & Found
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
            {activeTab === 'entries' && renderEntries()}
            {activeTab === 'lostfound' && renderLostFound()}
            {activeTab === 'chat' && <Chat />}
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
