import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Student API
export const studentAPI = {
  getProfile: () => axios.get(`${API_URL}/students/profile`),
  getCourses: () => axios.get(`${API_URL}/students/courses`),
  enrollCourse: (courseId) => axios.post(`${API_URL}/students/enroll/${courseId}`),
  getAssignments: () => axios.get(`${API_URL}/students/assignments`),
  submitAssignment: (assignmentId, data) => axios.post(`${API_URL}/students/assignments/${assignmentId}/submit`, data),
  getAttendance: () => axios.get(`${API_URL}/students/attendance`),
  applyGatePass: (data) => axios.post(`${API_URL}/students/gatepass`, data),
  getGatePasses: () => axios.get(`${API_URL}/students/gatepass`)
};

// Faculty API
export const facultyAPI = {
  getProfile: () => axios.get(`${API_URL}/faculty/profile`),
  getCourses: () => axios.get(`${API_URL}/faculty/courses`),
  createAssignment: (data) => axios.post(`${API_URL}/faculty/assignments`, data),
  getAssignments: () => axios.get(`${API_URL}/faculty/assignments`),
  gradeAssignment: (assignmentId, studentId, data) => 
    axios.put(`${API_URL}/faculty/assignments/${assignmentId}/grade/${studentId}`, data),
  markAttendance: (data) => axios.post(`${API_URL}/faculty/attendance`, data),
  getAttendance: (courseId) => axios.get(`${API_URL}/faculty/attendance/${courseId}`),
  updateAttendance: (attendanceId, data) => axios.put(`${API_URL}/faculty/attendance/${attendanceId}`, data)
};

// Admin API
export const adminAPI = {
  getUsers: () => axios.get(`${API_URL}/admin/users`),
  getAllUsers: () => axios.get(`${API_URL}/admin/users`),
  getAnalytics: () => axios.get(`${API_URL}/admin/analytics`),
  approveEvent: (eventId, data) => axios.put(`${API_URL}/admin/events/${eventId}/approve`, data),
  getComplaints: () => axios.get(`${API_URL}/admin/complaints`),
  assignComplaint: (complaintId, data) => axios.put(`${API_URL}/admin/complaints/${complaintId}/assign`, data),
  allotHostel: (data) => axios.post(`${API_URL}/admin/hostel/allot`, data),
  approveGatePass: (gatePassId, status) => axios.put(`${API_URL}/admin/gatepass/${gatePassId}/approve`, { status }),
  getGatePasses: () => axios.get(`${API_URL}/admin/gatepass`),
  createHostel: (data) => axios.post(`${API_URL}/admin/hostel`, data),
  getHostels: () => axios.get(`${API_URL}/admin/hostel`)
};

// Security API
export const securityAPI = {
  logEntry: (data) => axios.post(`${API_URL}/security/log`, data),
  getLogs: (params) => axios.get(`${API_URL}/security/logs`, { params }),
  verifyQR: (data) => axios.post(`${API_URL}/security/verify-qr`, data),
  getLostFound: () => axios.get(`${API_URL}/security/lostfound`),
  updateLostFound: (itemId, data) => axios.put(`${API_URL}/security/lostfound/${itemId}`, data),
  generateQR: (userId) => axios.get(`${API_URL}/security/generate-qr/${userId}`)
};

// Canteen API
export const canteenAPI = {
  getMenu: (params) => axios.get(`${API_URL}/canteen/menu`, { params }),
  addMenuItem: (data) => axios.post(`${API_URL}/canteen/menu`, data),
  updateMenuItem: (itemId, data) => axios.put(`${API_URL}/canteen/menu/${itemId}`, data),
  deleteMenuItem: (itemId) => axios.delete(`${API_URL}/canteen/menu/${itemId}`),
  placeOrder: (data) => axios.post(`${API_URL}/canteen/orders`, data),
  getMyOrders: () => axios.get(`${API_URL}/canteen/orders/my`),
  getOrders: (params) => axios.get(`${API_URL}/canteen/orders`, { params }),
  updateOrderStatus: (orderId, data) => axios.put(`${API_URL}/canteen/orders/${orderId}/status`, data)
};

// Common APIs
export const eventAPI = {
  getEvents: (params) => axios.get(`${API_URL}/events`, { params }),
  getAllEvents: () => axios.get(`${API_URL}/events`),
  createEvent: (data) => axios.post(`${API_URL}/events`, data),
  registerEvent: (eventId) => axios.post(`${API_URL}/events/${eventId}/register`),
  markAttendance: (eventId, data) => axios.post(`${API_URL}/events/${eventId}/attendance`, data),
  getEvent: (eventId) => axios.get(`${API_URL}/events/${eventId}`)
};

export const complaintAPI = {
  createComplaint: (data) => axios.post(`${API_URL}/complaints`, data),
  getMyComplaints: () => axios.get(`${API_URL}/complaints/my`),
  getAllComplaints: () => axios.get(`${API_URL}/complaints`),
  getComplaint: (complaintId) => axios.get(`${API_URL}/complaints/${complaintId}`),
  addComment: (complaintId, data) => axios.post(`${API_URL}/complaints/${complaintId}/comment`, data),
  updateStatus: (complaintId, data) => axios.put(`${API_URL}/complaints/${complaintId}/status`, data),
  updateComplaint: (complaintId, data) => axios.put(`${API_URL}/complaints/${complaintId}`, data)
};

export const lostFoundAPI = {
  reportItem: (data) => axios.post(`${API_URL}/lostfound`, data),
  getItems: (params) => axios.get(`${API_URL}/lostfound`, { params }),
  claimItem: (itemId, data) => axios.post(`${API_URL}/lostfound/${itemId}/claim`, data),
  getMyItems: () => axios.get(`${API_URL}/lostfound/my`)
};

export const chatAPI = {
  getConversations: () => axios.get(`${API_URL}/chat/conversations`),
  getMessages: (chatId) => axios.get(`${API_URL}/chat/${chatId}/messages`),
  sendMessage: (chatId, data) => axios.post(`${API_URL}/chat/${chatId}/send`, data),
  createChat: (recipientId) => axios.post(`${API_URL}/chat/create`, { recipientId }),
  getAllUsers: () => axios.get(`${API_URL}/chat/users/all`),
  getUnreadCount: () => axios.get(`${API_URL}/chat/unread/count`)
};

export const notificationAPI = {
  getNotifications: () => axios.get(`${API_URL}/notifications`),
  markAsRead: (notificationId) => axios.put(`${API_URL}/notifications/${notificationId}/read`),
  markAllAsRead: () => axios.put(`${API_URL}/notifications/read-all`),
  getUnreadCount: () => axios.get(`${API_URL}/notifications/unread-count`)
};

export const courseAPI = {
  getCourses: (params) => axios.get(`${API_URL}/courses`, { params }),
  createCourse: (data) => axios.post(`${API_URL}/courses`, data),
  getCourse: (courseId) => axios.get(`${API_URL}/courses/${courseId}`)
};

export const hostelAPI = {
  getHostels: () => axios.get(`${API_URL}/hostel`),
  getHostel: (hostelId) => axios.get(`${API_URL}/hostel/${hostelId}`)
};

export const timetableAPI = {
  getStudentTimetable: () => axios.get(`${API_URL}/timetable/student`),
  getFacultyTimetable: () => axios.get(`${API_URL}/timetable/faculty`)
};

export default {
  studentAPI,
  facultyAPI,
  adminAPI,
  securityAPI,
  canteenAPI,
  eventAPI,
  complaintAPI,
  lostFoundAPI,
  chatAPI,
  notificationAPI,
  courseAPI,
  hostelAPI,
  timetableAPI
};
