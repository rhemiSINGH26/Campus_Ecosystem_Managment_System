# Smart Campus Ecosystem Platform

A unified digital platform for college campus management with role-based access control for Students, Faculty, Admin, Security Staff, and Canteen Vendors.

## Features

### Student Features
- Course enrollment and time-table management
- View and submit assignments
- Track attendance
- Hostel management (gate pass applications)
- Event registration with QR attendance
- Canteen food ordering (Wallet/UPI)
- Complaint submission
- Lost & found portal
- Student-teacher chat
- Real-time notifications

### Faculty Features
- Upload notes and assignments
- Mark and track attendance
- Grade student submissions
- Course management
- Student communication
- View enrolled students
- Assignment analytics

### Admin Features
- User management
- Event approval system
- Hostel allotment management
- Complaint monitoring and assignment
- Analytics dashboard
- Gate pass approvals
- System-wide announcements

### Security Staff Features
- QR code scanning for entry/exit
- Entry/exit log management
- Lost & found item management
- Generate QR codes for users
- Gate verification system

### Canteen Vendor Features
- Menu management (add/update/delete items)
- Order management
- Order status updates
- Real-time order notifications

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Bcrypt** for password hashing
- **QRCode** for QR generation

### Frontend
- **React.js** (without TypeScript)
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for WebSocket
- **React Toastify** for notifications
- **QR Scanner** for QR code reading

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created with default values)

4. Start MongoDB service:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo service mongod start
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Default Test Accounts

**All Users Password: password123**

### Quick Test Accounts:
- **Student:** student1@campus.com (or student2, student3, ... up to student60)
- **Faculty:** faculty1@campus.com (or faculty2, faculty3, ... up to faculty6)
- **Admin:** admin@campus.com
- **Security:** security@campus.com
- **Canteen:** canteen@campus.com

### Database Includes:
- ✅ 60 Students (student1@campus.com to student60@campus.com)
- ✅ 6 Faculty Members (faculty1@campus.com to faculty6@campus.com)
- ✅ 15 Courses with proper codes (CS101, CS102, EC101, etc.)
- ✅ 25 Timetable Entries
- ✅ 3 Events
- ✅ 15 Canteen Menu Items
- ✅ Hostel Room Assignments
- ✅ 3 Sample Assignments

See [CREDENTIALS.md](./CREDENTIALS.md) for complete list of all users.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/courses` - Get enrolled courses
- `POST /api/students/enroll/:courseId` - Enroll in course
- `GET /api/students/assignments` - Get assignments
- `POST /api/students/assignments/:id/submit` - Submit assignment
- `GET /api/students/attendance` - Get attendance records
- `POST /api/students/gatepass` - Apply for gate pass
- `GET /api/students/gatepass` - Get gate passes

### Faculty
- `GET /api/faculty/profile` - Get faculty profile
- `GET /api/faculty/courses` - Get assigned courses
- `POST /api/faculty/assignments` - Create assignment
- `GET /api/faculty/assignments` - Get assignments
- `PUT /api/faculty/assignments/:id/grade/:studentId` - Grade assignment
- `POST /api/faculty/attendance` - Mark attendance
- `GET /api/faculty/attendance/:courseId` - Get attendance

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get dashboard analytics
- `PUT /api/admin/events/:id/approve` - Approve/reject event
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/assign` - Assign complaint
- `POST /api/admin/hostel/allot` - Allot hostel
- `PUT /api/admin/gatepass/:id/approve` - Approve gate pass

### Security
- `POST /api/security/log` - Log entry/exit
- `GET /api/security/logs` - Get entry/exit logs
- `POST /api/security/verify-qr` - Verify QR code
- `GET /api/security/lostfound` - Get lost/found items
- `PUT /api/security/lostfound/:id` - Update item status

### Canteen
- `GET /api/canteen/menu` - Get menu items
- `POST /api/canteen/menu` - Add menu item
- `PUT /api/canteen/menu/:id` - Update menu item
- `DELETE /api/canteen/menu/:id` - Delete menu item
- `POST /api/canteen/orders` - Place order
- `GET /api/canteen/orders/my` - Get user orders
- `GET /api/canteen/orders` - Get all orders (vendor)
- `PUT /api/canteen/orders/:id/status` - Update order status

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/attendance` - Mark attendance

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/my` - Get user complaints
- `GET /api/complaints/:id` - Get complaint details
- `POST /api/complaints/:id/comment` - Add comment
- `PUT /api/complaints/:id/status` - Update status

### Lost & Found
- `POST /api/lostfound` - Report item
- `GET /api/lostfound` - Get all items
- `POST /api/lostfound/:id/claim` - Claim item
- `GET /api/lostfound/my` - Get user items

### Chat
- `GET /api/chat/:receiverId` - Get messages
- `POST /api/chat` - Send message
- `PUT /api/chat/read/:receiverId` - Mark as read
- `GET /api/chat` - Get conversations

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

## WebSocket Events

### Client to Server
- `join` - Join with userId
- `sendMessage` - Send chat message
- `typing` - Typing indicator
- `sendNotification` - Send notification
- `orderUpdate` - Order update

### Server to Client
- `newMessage` - New chat message received
- `messageSent` - Message sent confirmation
- `newNotification` - New notification
- `userTyping` - User is typing
- `orderStatusChanged` - Order status changed
- `announcement` - System announcement

## Project Structure

```
smart-campus/
├── backend/
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & other middleware
│   ├── socket/           # Socket.io handlers
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/           # Login, Register
    │   │   └── Dashboards/     # Role-based dashboards
    │   ├── context/            # React Context (Auth, Socket)
    │   ├── services/           # API services
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Key Features Implementation

### Role-Based Access Control (RBAC)
- JWT-based authentication
- Role verification middleware
- Separate dashboards for each role

### Real-time Communication
- Socket.io for instant messaging
- Live notifications
- Order status updates

### QR Code System
- QR generation for events
- QR scanning for attendance
- Entry/exit verification

### Hostel Management
- Gate pass application workflow
- Admin approval system
- Date-based permissions

### Event Management
- Event creation and approval
- Registration system
- QR-based attendance tracking

### Canteen Ordering
- Browse menu
- Shopping cart
- Order tracking
- Vendor dashboard

## Security Features
- Password hashing with bcrypt
- JWT access & refresh tokens
- Protected API routes
- Role-based authorization
- Token expiration handling

## Future Enhancements
- Payment gateway integration
- SMS/Email notifications
- Mobile app development
- Advanced analytics
- Document upload system
- Timetable generation
- Library management
- Transport management

## Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
# Windows: net start MongoDB
# Linux/Mac: sudo service mongod start
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Change proxy in frontend/package.json
```

### CORS Errors
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check CORS configuration in server.js

## License
MIT

## Support
For issues and questions, please create an issue in the repository.
