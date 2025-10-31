import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Redirect based on role
        switch (result.user.role) {
          case 'student':
            navigate('/student');
            break;
          case 'faculty':
            navigate('/faculty');
            break;
          case 'admin':
            navigate('/admin');
            break;
          case 'security':
            navigate('/security');
            break;
          case 'canteen':
            navigate('/canteen');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎓 Smart Campus</h1>
          <h2>Login</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Quick Login Buttons for Testing */}
        <div style={{ marginTop: '25px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px', textAlign: 'center', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Login (Password: password123)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => setFormData({ email: 'student1@campus.com', password: 'password123' })}
              style={{ padding: '10px', fontSize: '12px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              👨‍🎓 Student
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ email: 'faculty1@campus.com', password: 'password123' })}
              style={{ padding: '10px', fontSize: '12px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              👨‍🏫 Faculty
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ email: 'admin@campus.com', password: 'password123' })}
              style={{ padding: '10px', fontSize: '12px', background: '#F44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              👤 Admin
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ email: 'canteen@campus.com', password: 'password123' })}
              style={{ padding: '10px', fontSize: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              🍽️ Canteen
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
