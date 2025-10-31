import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyAPI, courseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Chat from '../Chat/Chat';
import './Dashboard.css';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  
  // State for different features
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'home' || activeTab === 'courses') {
        const coursesRes = await facultyAPI.getCourses();
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data || []);
          if (coursesRes.data.data.length > 0 && !selectedCourse) {
            setSelectedCourse(coursesRes.data.data[0]._id);
          }
        }
      }
      
      if (activeTab === 'assignments') {
        const assignmentsRes = await facultyAPI.getAssignments();
        if (assignmentsRes.data.success) {
          setAssignments(assignmentsRes.data.data || []);
        }
      }
      
      if (activeTab === 'attendance' && selectedCourse) {
        const studentsRes = await courseAPI.getStudents(selectedCourse);
        if (studentsRes.data.success) {
          setStudents(studentsRes.data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await facultyAPI.createAssignment({
        course: formData.get('course'),
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        totalMarks: formData.get('totalMarks')
      });
      if (res.data.success) {
        toast.success('Assignment created successfully!');
        e.target.reset();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      const res = await facultyAPI.markAttendance({
        course: selectedCourse,
        student: studentId,
        date: attendanceDate,
        status: status
      });
      if (res.data.success) {
        toast.success(`Attendance marked as ${status}!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleGradeAssignment = async (assignmentId, studentId, marks) => {
    try {
      const res = await facultyAPI.gradeAssignment(assignmentId, studentId, { marks });
      if (res.data.success) {
        toast.success('Assignment graded successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to grade assignment');
    }
  };

  const renderHome = () => (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>My Courses</h3>
          <div className="stat-value">{courses.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Assignments</h3>
          <div className="stat-value">{assignments.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Grading</h3>
          <div className="stat-value">
            {assignments.reduce((sum, a) => sum + (a.submissions?.filter(s => !s.graded).length || 0), 0)}
          </div>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">
            {courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)}
          </div>
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
                <th>Semester</th>
                <th>Credits</th>
                <th>Students Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td><strong>{course.courseCode || course.code}</strong></td>
                  <td>{course.courseName || course.name}</td>
                  <td>{course.semester || 'Current'}</td>
                  <td>{course.credits || 3}</td>
                  <td>{course.enrolledStudents?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No courses assigned yet</p>
          </div>
        )}
      </div>

      <div className="section-card">
        <h2>Recent Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="item-list">
            {assignments.slice(0, 5).map(assignment => (
              <li key={assignment._id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <strong style={{fontSize: '16px'}}>{assignment.title}</strong>
                    <p style={{margin: '8px 0', color: '#666'}}>{assignment.description}</p>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <span className="badge badge-info">{assignment.course?.name || 'N/A'}</span>
                      <span style={{color: '#999'}}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span style={{color: '#999'}}>Submissions: {assignment.submissions?.length || 0}</span>
                    </div>
                  </div>
                  <span className="badge badge-primary">{assignment.totalMarks} marks</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No assignments created yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="section-card">
      <h2>My Courses</h2>
      {courses.length > 0 ? (
        <div style={{display: 'grid', gap: '20px'}}>
          {courses.map(course => (
            <div key={course._id} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div>
                  <h3 style={{fontSize: '24px', marginBottom: '10px'}}>{course.courseName || course.name}</h3>
                  <p style={{opacity: 0.9, marginBottom: '20px'}}>Code: {course.courseCode || course.code}</p>
                  <div style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
                    <span>📚 {course.credits || 3} Credits</span>
                    <span>📅 {course.semester || 'Current Semester'}</span>
                    <span>👥 {course.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '15px 25px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '32px', fontWeight: 'bold'}}>
                    {course.enrolledStudents?.length || 0}
                  </div>
                  <div style={{fontSize: '12px', opacity: 0.9}}>Students</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No courses assigned yet</p>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div>
      <div className="section-card">
        <h2>Create New Assignment</h2>
        <form onSubmit={handleCreateAssignment} className="form-section">
          <div className="form-group">
            <label>Course</label>
            <select name="course" required>
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.courseName || course.name} ({course.courseCode || course.code})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required placeholder="Assignment title" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="Assignment description"></textarea>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" required />
          </div>
          <div className="form-group">
            <label>Total Marks</label>
            <input type="number" name="totalMarks" required placeholder="100" />
          </div>
          <button type="submit" className="btn btn-primary">Create Assignment</button>
        </form>
      </div>

      <div className="section-card">
        <h2>All Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="item-list">
            {assignments.map(assignment => (
              <li key={assignment._id}>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <strong style={{fontSize: '18px'}}>{assignment.title}</strong>
                    <span className="badge badge-primary">{assignment.totalMarks} marks</span>
                  </div>
                  <p style={{color: '#666', marginBottom: '10px'}}>{assignment.description}</p>
                  <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <span className="badge badge-info">{assignment.course?.name || 'N/A'}</span>
                    <span style={{color: '#999'}}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span style={{color: '#999'}}>📝 {assignment.submissions?.length || 0} submissions</span>
                  </div>
                  {assignment.submissions && assignment.submissions.length > 0 && (
                    <div style={{marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                      <strong>Submissions:</strong>
                      <div style={{marginTop: '10px', display: 'grid', gap: '10px'}}>
                        {assignment.submissions.map((sub, idx) => (
                          <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '6px'}}>
                            <div>
                              <strong>{sub.student?.name || 'Student'}</strong>
                              <span style={{marginLeft: '15px', color: '#999'}}>
                                Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              {sub.graded ? (
                                <span className="badge badge-success">{sub.marks}/{assignment.totalMarks}</span>
                              ) : (
                                <>
                                  <input 
                                    type="number" 
                                    placeholder="Marks" 
                                    max={assignment.totalMarks}
                                    style={{width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid #ddd'}}
                                    id={`marks-${assignment._id}-${idx}`}
                                  />
                                  <button 
                                    className="btn btn-primary"
                                    style={{padding: '6px 12px', fontSize: '12px'}}
                                    onClick={() => {
                                      const marks = document.getElementById(`marks-${assignment._id}-${idx}`).value;
                                      if (marks) handleGradeAssignment(assignment._id, sub.student._id, parseInt(marks));
                                    }}
                                  >
                                    Grade
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No assignments created yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="section-card">
      <h2>Mark Attendance</h2>
      <div className="form-section" style={{marginBottom: '30px'}}>
        <div className="form-group">
          <label>Select Course</label>
          <select 
            value={selectedCourse || ''} 
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchDashboardData();
            }}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.courseName || course.name} ({course.courseCode || course.code})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
      </div>

      {selectedCourse && students.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td><strong>{student.name}</strong></td>
                <td>{student.rollNumber || 'N/A'}</td>
                <td>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                      className="btn btn-success"
                      style={{padding: '8px 16px', fontSize: '12px'}}
                      onClick={() => handleMarkAttendance(student._id, 'present')}
                    >
                      Present
                    </button>
                    <button 
                      className="btn btn-danger"
                      style={{padding: '8px 16px', fontSize: '12px'}}
                      onClick={() => handleMarkAttendance(student._id, 'absent')}
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>{selectedCourse ? 'No students enrolled in this course' : 'Please select a course'}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍🏫 Faculty Dashboard</h1>
        <div className="dashboard-user-info">
          <span className="user-name">Welcome, {user?.name || 'Faculty'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          🏠 Home
        </button>
        <button className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
          📚 Courses
        </button>
        <button className={`nav-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          📝 Assignments
        </button>
        <button className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          ✅ Attendance
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
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'assignments' && renderAssignments()}
            {activeTab === 'attendance' && renderAttendance()}
            {activeTab === 'chat' && <Chat />}
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
