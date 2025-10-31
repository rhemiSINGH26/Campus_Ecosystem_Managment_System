# Smart Campus Platform - API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Headers
All protected routes require:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Full Name",
  "phone": "1234567890",
  "role": "student",
  "studentId": "STU001",      // For students
  "department": "CS",
  "year": 2,
  "semester": 3,
  "section": "A"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id": "...", "role": "student", ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

## 👨‍🎓 Student Routes

### Get Student Profile
```http
GET /students/profile
Authorization: Bearer <student_token>
```

### Get Enrolled Courses
```http
GET /students/courses
Authorization: Bearer <student_token>
```

### Enroll in Course
```http
POST /students/enroll/:courseId
Authorization: Bearer <student_token>
```

### Get Assignments
```http
GET /students/assignments
Authorization: Bearer <student_token>
```

### Submit Assignment
```http
POST /students/assignments/:assignmentId/submit
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "files": [{ "filename": "...", "url": "..." }],
  "remarks": "My submission notes"
}
```

### Get Attendance
```http
GET /students/attendance
Authorization: Bearer <student_token>
```

### Apply for Gate Pass
```http
POST /students/gatepass
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "reason": "Family Emergency",
  "fromDate": "2024-01-15",
  "toDate": "2024-01-17",
  "destination": "Home",
  "emergencyContact": "9876543210"
}
```

### Get Gate Passes
```http
GET /students/gatepass
Authorization: Bearer <student_token>
```

---

## 👨‍🏫 Faculty Routes

### Get Faculty Profile
```http
GET /faculty/profile
Authorization: Bearer <faculty_token>
```

### Get Assigned Courses
```http
GET /faculty/courses
Authorization: Bearer <faculty_token>
```

### Create Assignment
```http
POST /faculty/assignments
Authorization: Bearer <faculty_token>
Content-Type: application/json

{
  "course": "courseId",
  "title": "Assignment 1",
  "description": "Complete the following...",
  "dueDate": "2024-02-01",
  "totalMarks": 100
}
```

### Grade Assignment
```http
PUT /faculty/assignments/:assignmentId/grade/:studentId
Authorization: Bearer <faculty_token>
Content-Type: application/json

{
  "marks": 85,
  "remarks": "Good work!"
}
```

### Mark Attendance
```http
POST /faculty/attendance
Authorization: Bearer <faculty_token>
Content-Type: application/json

{
  "course": "courseId",
  "date": "2024-01-15",
  "session": "morning",
  "topic": "Introduction to AI",
  "records": [
    { "student": "studentId", "status": "present" },
    { "student": "studentId2", "status": "absent" }
  ]
}
```

---

## 👨‍💼 Admin Routes

### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer <admin_token>
```

### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

### Approve/Reject Event
```http
PUT /admin/events/:eventId/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved"  // or "rejected"
}
```

### Get All Complaints
```http
GET /admin/complaints
Authorization: Bearer <admin_token>
```

### Assign Complaint
```http
PUT /admin/complaints/:complaintId/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "assignedTo": "userId"
}
```

### Allot Hostel
```http
POST /admin/hostel/allot
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "studentId": "...",
  "hostelId": "...",
  "roomNumber": "101"
}
```

### Approve Gate Pass
```http
PUT /admin/gatepass/:gatePassId/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved",  // or "rejected"
  "remarks": "Approved for valid reason"
}
```

---

## 👮 Security Routes

### Log Entry/Exit
```http
POST /security/log
Authorization: Bearer <security_token>
Content-Type: application/json

{
  "user": "userId",
  "type": "entry",  // or "exit"
  "gate": "Main Gate",
  "qrCode": "scanned_qr_data",
  "purpose": "Class"
}
```

### Get Logs
```http
GET /security/logs?startDate=2024-01-01&endDate=2024-01-31&type=entry
Authorization: Bearer <security_token>
```

### Generate QR Code
```http
GET /security/generate-qr/:userId
Authorization: Bearer <security_token>
```

---

## 🍽️ Canteen Routes

### Get Menu
```http
GET /canteen/menu?category=lunch&isVeg=true
Authorization: Bearer <token>
```

### Add Menu Item (Vendor only)
```http
POST /canteen/menu
Authorization: Bearer <canteen_token>
Content-Type: application/json

{
  "itemName": "Veg Burger",
  "category": "snacks",
  "price": 50,
  "description": "Delicious burger",
  "isVeg": true,
  "preparationTime": 10
}
```

### Update Menu Item
```http
PUT /canteen/menu/:itemId
Authorization: Bearer <canteen_token>
Content-Type: application/json

{
  "price": 55,
  "isAvailable": true
}
```

### Place Order
```http
POST /canteen/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuItem": "itemId",
      "itemName": "Veg Burger",
      "quantity": 2,
      "price": 50
    }
  ],
  "totalAmount": 100,
  "paymentMethod": "wallet",
  "specialInstructions": "Extra cheese"
}
```

### Get My Orders
```http
GET /canteen/orders/my
Authorization: Bearer <token>
```

### Update Order Status (Vendor)
```http
PUT /canteen/orders/:orderId/status
Authorization: Bearer <canteen_token>
Content-Type: application/json

{
  "orderStatus": "preparing"  // placed, preparing, ready, completed
}
```

---

## 🎉 Event Routes

### Get All Events
```http
GET /events?status=approved&eventType=cultural
Authorization: Bearer <token>
```

### Create Event
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Fest 2024",
  "description": "Annual technical festival",
  "eventType": "technical",
  "venue": "Main Auditorium",
  "eventDate": "2024-03-15",
  "startTime": "10:00",
  "endTime": "17:00",
  "maxParticipants": 500
}
```

### Register for Event
```http
POST /events/:eventId/register
Authorization: Bearer <token>
```

### Mark Event Attendance (Admin/Faculty)
```http
POST /events/:eventId/attendance
Authorization: Bearer <admin_or_faculty_token>
Content-Type: application/json

{
  "qrData": "scanned_qr_data"
}
```

---

## 📝 Complaint Routes

### Create Complaint
```http
POST /complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "hostel",
  "subject": "Water Issue",
  "description": "No water supply in room 101",
  "priority": "high"
}
```

### Get My Complaints
```http
GET /complaints/my
Authorization: Bearer <token>
```

### Add Comment
```http
POST /complaints/:complaintId/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "The issue has been resolved"
}
```

### Update Status
```http
PUT /complaints/:complaintId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved",
  "resolution": "Water tank refilled"
}
```

---

## 🔍 Lost & Found Routes

### Report Item
```http
POST /lostfound
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "lost",  // or "found"
  "itemName": "Wallet",
  "category": "accessories",
  "description": "Black leather wallet",
  "location": "Library",
  "date": "2024-01-15"
}
```

### Get Items
```http
GET /lostfound?type=lost&category=electronics&status=active
Authorization: Bearer <token>
```

### Claim Item
```http
POST /lostfound/:itemId/claim
Authorization: Bearer <token>
Content-Type: application/json

{
  "verificationDetails": "It has my ID card inside"
}
```

---

## 💬 Chat Routes

### Get Messages
```http
GET /chat/:receiverId
Authorization: Bearer <token>
```

### Send Message
```http
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiver": "userId",
  "message": "Hello!",
  "messageType": "text"
}
```

### Mark as Read
```http
PUT /chat/read/:receiverId
Authorization: Bearer <token>
```

---

## 🔔 Notification Routes

### Get Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /notifications/:notificationId/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

---

## 📚 Course Routes

### Get All Courses
```http
GET /courses?department=CS&semester=3
Authorization: Bearer <token>
```

### Create Course (Admin/Faculty)
```http
POST /courses
Authorization: Bearer <admin_or_faculty_token>
Content-Type: application/json

{
  "courseCode": "CS301",
  "courseName": "Database Systems",
  "department": "Computer Science",
  "credits": 4,
  "semester": 5,
  "faculty": "facultyId"
}
```

---

## 🏨 Hostel Routes

### Get All Hostels
```http
GET /hostel
Authorization: Bearer <token>
```

### Get Hostel Details
```http
GET /hostel/:hostelId
Authorization: Bearer <token>
```

---

## 🔌 WebSocket Events

### Connect to Socket
```javascript
const socket = io('http://localhost:5000');

// Join with user ID
socket.emit('join', userId);
```

### Client Events
```javascript
// Send message
socket.emit('sendMessage', {
  sender: userId,
  receiver: receiverId,
  message: 'Hello!',
  messageType: 'text'
});

// Typing indicator
socket.emit('typing', {
  sender: userId,
  receiver: receiverId,
  isTyping: true
});
```

### Server Events
```javascript
// Receive new message
socket.on('newMessage', (message) => {
  console.log('New message:', message);
});

// Receive notification
socket.on('newNotification', (notification) => {
  console.log('New notification:', notification);
});

// Order update
socket.on('orderStatusChanged', (order) => {
  console.log('Order updated:', order);
});
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": { ... }
}
```

---

## 🔑 Common Query Parameters

- `?status=pending` - Filter by status
- `?category=hostel` - Filter by category
- `?department=CS` - Filter by department
- `?startDate=2024-01-01&endDate=2024-01-31` - Date range
- `?page=1&limit=10` - Pagination (when implemented)
- `?search=keyword` - Search (when implemented)

---

## 🛡️ HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

**Note:** Replace `<token>`, `:id`, and other placeholders with actual values when making requests.

For detailed feature documentation, see README.md
