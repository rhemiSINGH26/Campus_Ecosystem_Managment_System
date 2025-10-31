import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, eventAPI, complaintAPI, canteenAPI, timetableAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Chat from '../Chat/Chat';
import ProfileCard from '../ProfileCard/ProfileCard';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  
  // State for different features
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);

  useEffect(() => {
    fetchStudentProfile();
    fetchDashboardData();
  }, [activeTab]);

  const fetchStudentProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      if (res.data.success) {
        setStudentData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'home' || activeTab === 'courses') {
        const coursesRes = await studentAPI.getCourses();
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data || []);
        }
      }
      
      if (activeTab === 'home' || activeTab === 'assignments') {
        const assignmentsRes = await studentAPI.getAssignments();
        if (assignmentsRes.data.success) {
          setAssignments(assignmentsRes.data.data || []);
        }
      }
      
      if (activeTab === 'events') {
        const eventsRes = await eventAPI.getAllEvents();
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.data || []);
        }
      }
      
      if (activeTab === 'canteen') {
        const menuRes = await canteenAPI.getMenu();
        if (menuRes.data.success) {
          setMenuItems(menuRes.data.data || []);
        }
      }
      
      if (activeTab === 'complaints') {
        const complaintsRes = await complaintAPI.getMyComplaints();
        if (complaintsRes.data.success) {
          setComplaints(complaintsRes.data.data || []);
        }
      }

      if (activeTab === 'timetable') {
        const timetableRes = await timetableAPI.getStudentTimetable();
        if (timetableRes.data.success) {
          setTimetable(timetableRes.data.data || []);
        }
      }

      if (activeTab === 'gatepass') {
        const gatePassRes = await studentAPI.getGatePasses();
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

  const handleRegisterEvent = async (eventId) => {
    try {
      const res = await eventAPI.registerForEvent(eventId);
      if (res.data.success) {
        toast.success('Successfully registered for event!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await complaintAPI.createComplaint({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category')
      });
      if (res.data.success) {
        toast.success('Complaint submitted successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    toast.info('Item removed from cart');
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    
    try {
      const items = cart.map(item => ({
        menuItem: item._id,
        quantity: 1,
        price: item.price
      }));
      
      const res = await canteenAPI.placeOrder({ items });
      if (res.data.success) {
        toast.success('Order placed successfully!');
        setCart([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const renderHome = () => (
    <div>
      {/* Profile Card */}
      {studentData && (
        <div style={{ marginBottom: '30px' }}>
          <ProfileCard 
            user={user} 
            studentData={studentData}
          />
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <div className="stat-value">{courses.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Assignments</h3>
          <div className="stat-value">{assignments.filter(a => !a.submitted).length}</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <div className="stat-value">{events.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Complaints</h3>
          <div className="stat-value">{complaints.filter(c => c.status === 'pending').length}</div>
        </div>
      </div>

      <div className="section-card">
        <h2>My Courses</h2>
        {courses.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td><strong>{course.courseCode || course.code}</strong></td>
                  <td>{course.courseName || course.name}</td>
                  <td>{course.faculty?.userId?.name || course.faculty?.name || 'N/A'}</td>
                  <td>{course.credits || 3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No courses enrolled yet</p>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2>Recent Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="item-list">
            {assignments.slice(0, 5).map(assignment => (
              <li key={assignment._id}>
                <strong>{assignment.title}</strong>
                <p style={{margin: '8px 0', color: '#666'}}>{assignment.description}</p>
                <span className={`badge ${assignment.submitted ? 'badge-success' : 'badge-warning'}`}>
                  {assignment.submitted ? 'Submitted' : 'Pending'}
                </span>
                <span style={{marginLeft: '10px', color: '#999'}}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No assignments available</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="section-card">
      <h2>My Courses</h2>
      {courses.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Faculty</th>
              <th>Credits</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td><strong>{course.courseCode || course.code}</strong></td>
                <td>{course.courseName || course.name}</td>
                <td>{course.faculty?.userId?.name || course.faculty?.name || 'N/A'}</td>
                <td>{course.credits || 3}</td>
                <td>{course.semester || 'Current'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>You are not enrolled in any courses yet</p>
        </div>
      )}
    </div>
  );

  const renderTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '13:00', end: '14:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];

    const getTimetableSlot = (day, timeSlot) => {
      return timetable.find(entry => 
        entry.day === day && 
        entry.startTime === timeSlot.start
      );
    };

    return (
      <div className="section-card">
        <h2>📅 My Timetable</h2>
        {timetable.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Time</th>
                  {days.map(day => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.start}>
                    <td style={{ fontWeight: 'bold' }}>
                      {slot.start} - {slot.end}
                    </td>
                    {days.map(day => {
                      const entry = getTimetableSlot(day, slot);
                      return (
                        <td key={day} style={{ 
                          backgroundColor: entry ? '#e8f4f8' : 'transparent',
                          padding: '10px',
                          verticalAlign: 'top'
                        }}>
                          {entry ? (
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#2196F3' }}>
                                {entry.course?.courseCode || entry.course?.code || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.9em', marginTop: '2px' }}>
                                {entry.course?.courseName || entry.course?.name || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                📍 {entry.room}
                              </div>
                              <div style={{ fontSize: '0.85em', color: '#666' }}>
                                👤 {entry.faculty?.userId?.name || entry.faculty?.name || 'N/A'}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#ccc' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No timetable available</p>
          </div>
        )}
      </div>
    );
  };

  const renderAssignments = () => (
    <div className="section-card">
      <h2>Assignments</h2>
      {assignments.length > 0 ? (
        <ul className="item-list">
          {assignments.map(assignment => (
            <li key={assignment._id}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div>
                  <strong style={{fontSize: '18px'}}>{assignment.title}</strong>
                  <p style={{margin: '10px 0', color: '#666'}}>{assignment.description}</p>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <span className={`badge ${assignment.submitted ? 'badge-success' : 'badge-warning'}`}>
                      {assignment.submitted ? 'Submitted' : 'Pending'}
                    </span>
                    <span style={{color: '#999'}}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {!assignment.submitted && (
                  <button className="btn btn-primary" onClick={() => toast.info('File upload feature coming soon!')}>
                    Submit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No assignments available</p>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="section-card">
      <h2>Campus Events</h2>
      {events.length > 0 ? (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
          {events.map(event => (
            <div key={event._id} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{marginBottom: '10px'}}>{event.title}</h3>
              <p style={{opacity: 0.9, marginBottom: '15px'}}>{event.description}</p>
              <div style={{marginBottom: '15px'}}>
                <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                <div>📍 {event.venue}</div>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{width: '100%'}}
                onClick={() => handleRegisterEvent(event._id)}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No upcoming events</p>
        </div>
      )}
    </div>
  );

  const renderCanteen = () => (
    <div>
      <div className="section-card">
        <h2>Menu</h2>
        {menuItems.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
            {menuItems.map(item => (
              <div key={item._id} style={{
                background: item.available ? 'white' : '#f5f5f5',
                border: item.available ? '2px solid #38ef7d' : '2px solid #ff6b6b',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                position: 'relative',
                opacity: item.available ? 1 : 0.7
              }}>
                {!item.available && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ff6b6b',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    OUT OF STOCK
                  </div>
                )}
                <h3 style={{marginBottom: '10px'}}>{item.name}</h3>
                <span className="badge badge-info" style={{marginBottom: '10px'}}>
                  {item.category || 'General'}
                </span>
                <p style={{color: '#666', margin: '10px 0', minHeight: '40px'}}>{item.description}</p>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: '#667eea', margin: '15px 0'}}>
                  ₹{item.price}
                </div>
                <div style={{marginBottom: '15px'}}>
                  <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`} 
                    style={{fontSize: '14px', padding: '8px 16px'}}>
                    {item.available ? '✓ Available Now' : '✗ Out of Stock'}
                  </span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    opacity: item.available ? 1 : 0.5,
                    cursor: item.available ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                >
                  {item.available ? 'Add to Cart' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No menu items available at the moment</p>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="section-card">
          <h2>Your Cart ({cart.length} items)</h2>
          <ul className="item-list">
            {cart.map((item, index) => (
              <li key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <strong>{item.name}</strong>
                  <span style={{marginLeft: '15px', color: '#667eea', fontWeight: 'bold'}}>₹{item.price}</span>
                </div>
                <button className="btn btn-danger" onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{textAlign: 'right', marginTop: '20px'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '15px'}}>
              Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
            </div>
            <button className="btn btn-primary" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const handleSubmitGatePass = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await studentAPI.applyGatePass({
        reason: formData.get('reason'),
        fromDate: formData.get('fromDate'),
        toDate: formData.get('toDate'),
        destination: formData.get('destination')
      });
      if (res.data.success) {
        toast.success('Gate pass request submitted successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit gate pass request');
    }
  };

  const renderProfile = () => (
    <div>
      {studentData ? (
        <ProfileCard 
          user={user} 
          studentData={studentData}
        />
      ) : (
        <div className="loading">Loading profile...</div>
      )}
    </div>
  );

  const renderComplaints = () => (
    <div>
      <div className="section-card">
        <h2>Submit New Complaint</h2>
        <form onSubmit={handleSubmitComplaint} className="form-section">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required placeholder="Brief title of your complaint" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" required>
              <option value="">Select Category</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Canteen">Canteen</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="Describe your complaint in detail"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit Complaint</button>
        </form>
      </div>

      <div className="section-card">
        <h2>My Complaints</h2>
        {complaints.length > 0 ? (
          <ul className="item-list">
            {complaints.map(complaint => (
              <li key={complaint._id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <strong style={{fontSize: '18px'}}>{complaint.title}</strong>
                    <p style={{margin: '10px 0', color: '#666'}}>{complaint.description}</p>
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
                  <span style={{color: '#999'}}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No complaints submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderGatePass = () => (
    <div>
      <div className="section-card">
        <h2>Apply for Gate Pass</h2>
        <form onSubmit={handleSubmitGatePass} className="form-section">
          <div className="form-group">
            <label>Reason</label>
            <input type="text" name="reason" required placeholder="Reason for going out" />
          </div>
          <div className="form-group">
            <label>Destination</label>
            <input type="text" name="destination" required placeholder="Where are you going?" />
          </div>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="fromDate" required />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="toDate" required />
          </div>
          <button type="submit" className="btn btn-primary">Submit Request</button>
        </form>
      </div>

      <div className="section-card">
        <h2>My Gate Pass Requests</h2>
        {gatePasses.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Destination</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {gatePasses.map(pass => (
                <tr key={pass._id}>
                  <td><strong>{pass.reason}</strong></td>
                  <td>{pass.destination}</td>
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
                  <td>{new Date(pass.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No gate pass requests yet</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🎓 Student Dashboard</h1>
        <div className="dashboard-user-info">
          <span className="user-name">Welcome, {user?.name || 'Student'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          🏠 Home
        </button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 Profile
        </button>
        <button className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
          📚 Courses
        </button>
        <button className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          📝 Assignments
        </button>
        <button className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
          🎉 Events
        </button>
        <button className={`nav-btn ${activeTab === 'canteen' ? 'active' : ''}`} onClick={() => setActiveTab('canteen')}>
          🍽️ Canteen
        </button>
        <button className={`nav-btn ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>
          📅 Timetable
        </button>
        <button className={`nav-btn ${activeTab === 'gatepass' ? 'active' : ''}`} onClick={() => setActiveTab('gatepass')}>
          🚪 Gate Pass
        </button>
        <button className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          💬 Chat
        </button>
        <button className={`nav-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
          📋 Complaints
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'assignments' && renderAssignments()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'canteen' && renderCanteen()}
            {activeTab === 'timetable' && renderTimetable()}
            {activeTab === 'gatepass' && renderGatePass()}
            {activeTab === 'chat' && <Chat />}
            {activeTab === 'complaints' && renderComplaints()}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
