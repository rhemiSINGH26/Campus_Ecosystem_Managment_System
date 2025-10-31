import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ user, studentData, facultyData }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    const colors = {
      student: '#2196F3',
      faculty: '#9C27B0',
      admin: '#F44336',
      security: '#FF9800',
      canteen: '#4CAF50'
    };
    return colors[role] || '#757575';
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div 
          className="profile-avatar" 
          style={{ backgroundColor: getRoleColor(user.role) }}
        >
          {getInitials(user.name)}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user.name}</h2>
          <span className="profile-role" style={{ color: getRoleColor(user.role) }}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
      </div>

      <div className="profile-card-body">
        <div className="profile-detail">
          <span className="detail-icon">📧</span>
          <div className="detail-content">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
        </div>

        <div className="profile-detail">
          <span className="detail-icon">📱</span>
          <div className="detail-content">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phone}</span>
          </div>
        </div>

        {studentData && (
          <>
            <div className="profile-detail">
              <span className="detail-icon">🎓</span>
              <div className="detail-content">
                <span className="detail-label">Student ID</span>
                <span className="detail-value">{studentData.studentId}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">🏢</span>
              <div className="detail-content">
                <span className="detail-label">Department</span>
                <span className="detail-value">{studentData.department}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">📚</span>
              <div className="detail-content">
                <span className="detail-label">Year / Semester</span>
                <span className="detail-value">
                  Year {studentData.year} - Semester {studentData.semester}
                </span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">🔤</span>
              <div className="detail-content">
                <span className="detail-label">Section</span>
                <span className="detail-value">{studentData.section}</span>
              </div>
            </div>

            {studentData.hostelRoom && (
              <div className="profile-detail">
                <span className="detail-icon">🏠</span>
                <div className="detail-content">
                  <span className="detail-label">Hostel</span>
                  <span className="detail-value">
                    Block {studentData.hostelRoom.block} - Room {studentData.hostelRoom.roomNumber}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {facultyData && (
          <>
            <div className="profile-detail">
              <span className="detail-icon">🆔</span>
              <div className="detail-content">
                <span className="detail-label">Faculty ID</span>
                <span className="detail-value">{facultyData.facultyId}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">🏢</span>
              <div className="detail-content">
                <span className="detail-label">Department</span>
                <span className="detail-value">{facultyData.department}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">👔</span>
              <div className="detail-content">
                <span className="detail-label">Designation</span>
                <span className="detail-value">{facultyData.designation}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">🎓</span>
              <div className="detail-content">
                <span className="detail-label">Qualification</span>
                <span className="detail-value">{facultyData.qualification}</span>
              </div>
            </div>

            <div className="profile-detail">
              <span className="detail-icon">🔬</span>
              <div className="detail-content">
                <span className="detail-label">Specialization</span>
                <span className="detail-value">{facultyData.specialization}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
