import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';

// Dashboard Components
import StudentDashboard from './components/Dashboards/StudentDashboard';
import FacultyDashboard from './components/Dashboards/FacultyDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import SecurityDashboard from './components/Dashboards/SecurityDashboard';
import CanteenDashboard from './components/Dashboards/CanteenDashboard';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route 
                path="/student/*" 
                element={
                  <PrivateRoute role="student">
                    <StudentDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Faculty Routes */}
              <Route 
                path="/faculty/*" 
                element={
                  <PrivateRoute role="faculty">
                    <FacultyDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Security Routes */}
              <Route 
                path="/security/*" 
                element={
                  <PrivateRoute role="security">
                    <SecurityDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Canteen Routes */}
              <Route 
                path="/canteen/*" 
                element={
                  <PrivateRoute role="canteen">
                    <CanteenDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
