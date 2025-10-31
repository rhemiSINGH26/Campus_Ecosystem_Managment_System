const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploaded files)
app.use('/uploads', express.static('uploads'));

// Make io accessible to routes
app.set('io', io);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Connection Handler
const socketHandler = require('./socket/socketHandler');
socketHandler(io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/security', require('./routes/securityRoutes'));
app.use('/api/canteen', require('./routes/canteenRoutes'));
app.use('/api/hostel', require('./routes/hostelRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/lostfound', require('./routes/lostFoundRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Campus API Server Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO listening for connections`);
});
