import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, eventAPI, complaintAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Chat from '../Chat/Chat';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  
  // State for different features
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalEvents: 0,
    totalComplaints: 0
  });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'home' || activeTab === 'users') {
        const usersRes = await adminAPI.getAllUsers();
        if (usersRes.data.success) {
          setUsers(usersRes.data.data || []);
          setStats(prev => ({
            ...prev,
            totalStudents: usersRes.data.data.filter(u => u.role === 'student').length,
            totalFaculty: usersRes.data.data.filter(u => u.role === 'faculty').length
          }));
        }
      }
      
      if (activeTab === 'home' || activeTab === 'events') {
        const eventsRes = await eventAPI.getAllEvents();
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.data || []);
          setStats(prev => ({ ...prev, totalEvents: eventsRes.data.data.length }));
        }
      }
      
      if (activeTab === 'home' || activeTab === 'complaints') {
        const complaintsRes = await complaintAPI.getAllComplaints();
        if (complaintsRes.data.success) {
          setComplaints(complaintsRes.data.data || []);
          setStats(prev => ({ ...prev, totalComplaints: complaintsRes.data.data.length }));
        }
      }
      
      if (activeTab === 'gatepasses') {
        const gatePassRes = await adminAPI.getGatePasses();
        if (gatePassRes.data.success) {
          setGatePasses(gatePassRes.data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      const res = await adminAPI.approveEvent(eventId);
      if (res.data.success) {
        toast.success('Event approved successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve event');
    }
  };

  const handleUpdateComplaint = async (complaintId, status) => {
    try {
      const res = await complaintAPI.updateComplaint(complaintId, { status });
      if (res.data.success) {
        toast.success(`Complaint marked as ${status}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    }
  };

  const handleApproveGatePass = async (gatePassId, status) => {
    try {
      const res = await adminAPI.approveGatePass(gatePassId, status);
      if (res.data.success) {
        toast.success(`Gate pass ${status}!`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update gate pass');
    }
  };

  const renderHome = () => (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        <div className="stat-card">
          <h3>Total Faculty</h3>
          <div className="stat-value">{stats.totalFaculty}</div>
        </div>
        <div className="stat-card">
          <h3>Total Events</h3>
          <div className="stat-value">{stats.totalEvents}</div>
        </div>
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <div className="stat-value">{stats.totalComplaints}</div>
        </div>
      </div>

      <div className="section-card">
        <h2>Recent Events</h2>
        {events.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 5).map(event => (
                <tr key={event._id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
                  <td>
                    <span className={`badge ${event.approved ? 'badge-success' : 'badge-warning'}`}>
                      {event.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {!event.approved && (
                      <button 
                        className="btn btn-primary" 
                        style={{padding: '8px 16px', fontSize: '12px'}}
                        onClick={() => handleApproveEvent(event._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No events found</p>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2>Recent Complaints</h2>
        {complaints.length > 0 ? (
          <ul className="item-list">
            {complaints.slice(0, 5).map(complaint => (
              <li key={complaint._id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <strong style={{fontSize: '16px'}}>{complaint.title}</strong>
                    <p style={{margin: '8px 0', color: '#666'}}>{complaint.description}</p>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <span className="badge badge-info">{complaint.category}</span>
                      <span className={`badge ${
                        complaint.status === 'resolved' ? 'badge-success' :
                        complaint.status === 'in-progress' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
                    {complaint.status === 'pending' && (
                      <button 
                        className="btn btn-primary" 
                        style={{padding: '8px 16px', fontSize: '12px'}}
                        onClick={() => handleUpdateComplaint(complaint._id, 'in-progress')}
                      >
                        In Progress
                      </button>
                    )}
                    {complaint.status !== 'resolved' && (
                      <button 
                        className="btn btn-success" 
                        style={{padding: '8px 16px', fontSize: '12px'}}
                        onClick={() => handleUpdateComplaint(complaint._id, 'resolved')}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="section-card">
      <h2>All Users</h2>
      {users.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${
                    user.role === 'admin' ? 'badge-danger' :
                    user.role === 'faculty' ? 'badge-primary' :
                    user.role === 'student' ? 'badge-info' : 'badge-secondary'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.phone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="section-card">
      <h2>Manage Events</h2>
      {events.length > 0 ? (
        <div style={{display: 'grid', gap: '20px'}}>
          {events.map(event => (
            <div key={event._id} style={{
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{marginBottom: '10px'}}>{event.title}</h3>
                <p style={{color: '#666', marginBottom: '15px'}}>{event.description}</p>
                <div style={{display: 'flex', gap: '15px', marginBottom: '10px'}}>
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>📍 {event.venue}</span>
                  <span>👥 {event.maxParticipants || 'Unlimited'} participants</span>
                </div>
                <span className={`badge ${event.approved ? 'badge-success' : 'badge-warning'}`}>
                  {event.approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              <div>
                {!event.approved && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleApproveEvent(event._id)}
                  >
                    Approve Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No events found</p>
        </div>
      )}
    </div>
  );

  const renderComplaints = () => (
    <div className="section-card">
      <h2>Manage Complaints</h2>
      {complaints.length > 0 ? (
        <ul className="item-list">
          {complaints.map(complaint => (
            <li key={complaint._id}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                  <strong style={{fontSize: '18px'}}>{complaint.title}</strong>
                  <p style={{margin: '10px 0', color: '#666'}}>{complaint.description}</p>
                  <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <span className="badge badge-info">{complaint.category}</span>
                    <span className={`badge ${
                      complaint.status === 'resolved' ? 'badge-success' :
                      complaint.status === 'in-progress' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div style={{color: '#999', fontSize: '14px'}}>
                    Submitted by: {complaint.submittedBy?.name || 'Unknown'} on {new Date(complaint.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px', flexDirection: 'column', minWidth: '120px'}}>
                  {complaint.status === 'pending' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleUpdateComplaint(complaint._id, 'in-progress')}
                    >
                      In Progress
                    </button>
                  )}
                  {complaint.status !== 'resolved' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleUpdateComplaint(complaint._id, 'resolved')}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No complaints found</p>
        </div>
      )}
    </div>
  );

  const renderGatePasses = () => (
    <div className="section-card">
      <h2>Gate Pass Requests</h2>
      {gatePasses.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Reason</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gatePasses.map(pass => (
              <tr key={pass._id}>
                <td><strong>{pass.student?.name || 'N/A'}</strong></td>
                <td>{pass.reason}</td>
                <td>{new Date(pass.fromDate).toLocaleDateString()}</td>
                <td>{new Date(pass.toDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${
                    pass.status === 'approved' ? 'badge-success' :
                    pass.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {pass.status}
                  </span>
                </td>
                <td>
                  {pass.status === 'pending' && (
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="btn btn-success"
                        style={{padding: '6px 12px', fontSize: '12px'}}
                        onClick={() => handleApproveGatePass(pass._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{padding: '6px 12px', fontSize: '12px'}}
                        onClick={() => handleApproveGatePass(pass._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No gate pass requests found</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍💼 Admin Dashboard</h1>
        <div className="dashboard-user-info">
          <span className="user-name">Welcome, {user?.name || 'Admin'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          🏠 Dashboard
        </button>
        <button className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👥 Users
        </button>
        <button className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
          🎉 Events
        </button>
        <button className={`nav-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
          📋 Complaints
        </button>
        <button className={`nav-btn ${activeTab === 'gatepasses' ? 'active' : ''}`} onClick={() => setActiveTab('gatepasses')}>
          🚪 Gate Passes
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
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'complaints' && renderComplaints()}
            {activeTab === 'gatepasses' && renderGatePasses()}
            {activeTab === 'chat' && <Chat />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
