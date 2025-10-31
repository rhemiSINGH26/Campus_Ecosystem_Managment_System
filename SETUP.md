# Smart Campus Platform - Quick Start Guide

## Step-by-Step Installation Instructions

### Step 1: Prerequisites Check

Before starting, ensure you have:

1. **Node.js** installed (v14 or higher)
   - Check: Open PowerShell and run `node --version`
   - Download from: https://nodejs.org/ if not installed

2. **MongoDB** installed locally
   - Check: Run `mongod --version`
   - Download from: https://www.mongodb.com/try/download/community if not installed

### Step 2: Start MongoDB

Open PowerShell as Administrator and run:
```powershell
net start MongoDB
```

If MongoDB is not set as a service, navigate to MongoDB bin folder and run:
```powershell
mongod
```

### Step 3: Install Dependencies

Open PowerShell in the project directory (`d:\IA3\Web\Project`) and run:

```powershell
.\install.bat
```

This will install all dependencies for both backend and frontend.

**Alternative Manual Installation:**
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

### Step 4: Seed the Database

Run the seed script to populate the database with test data:

```powershell
.\seed-database.bat
```

This creates:
- Admin, Faculty, Student, Security, and Canteen users
- Sample courses
- Hostel data
- Canteen menu items

### Step 5: Start the Application

Open **TWO** PowerShell windows:

**Window 1 - Start Backend Server:**
```powershell
.\start-backend.bat
```
Or manually:
```powershell
cd backend
npm start
```

**Window 2 - Start Frontend:**
```powershell
.\start-frontend.bat
```
Or manually:
```powershell
cd frontend
npm start
```

### Step 6: Access the Application

The application will automatically open in your browser at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Test Accounts

Use these credentials to login:

### 👨‍💼 Admin
- **Email:** admin@campus.com
- **Password:** admin123
- **Features:** User management, event approvals, analytics, hostel allotment

### 👨‍🏫 Faculty
- **Email:** john.doe@campus.com or jane.smith@campus.com
- **Password:** faculty123
- **Features:** Course management, assignments, attendance marking

### 👨‍🎓 Students
- **Email:** alice@student.com / bob@student.com / charlie@student.com
- **Password:** student123
- **Features:** Course enrollment, assignments, canteen orders, hostel

### 👮 Security
- **Email:** security@campus.com
- **Password:** security123
- **Features:** Entry/exit logs, QR scanning, lost & found

### 🍽️ Canteen
- **Email:** canteen@campus.com
- **Password:** canteen123
- **Features:** Menu management, order processing

## Common Features to Test

### For Students:
1. Login with alice@student.com / student123
2. View enrolled courses
3. Check assignments
4. Apply for gate pass
5. Order food from canteen
6. Register for events
7. Submit complaints

### For Faculty:
1. Login with john.doe@campus.com / faculty123
2. View assigned courses
3. Create assignments
4. Mark attendance
5. Grade student submissions

### For Admin:
1. Login with admin@campus.com / admin123
2. View analytics dashboard
3. Approve events
4. Manage complaints
5. Approve gate passes
6. Allot hostel rooms

### For Canteen:
1. Login with canteen@campus.com / canteen123
2. View menu items
3. Manage incoming orders
4. Update order status

## Troubleshooting

### Problem: MongoDB Connection Error
**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

### Problem: Port 5000 already in use
**Solution:**
Edit `backend\.env` file and change PORT to different number:
```
PORT=5001
```

### Problem: Port 3000 already in use
**Solution:**
When prompted, type 'Y' to run on different port, or:
Edit `frontend\package.json` and add:
```json
"start": "set PORT=3001 && react-scripts start"
```

### Problem: Cannot find module errors
**Solution:**
```powershell
# Reinstall dependencies
cd backend
rm -r node_modules
npm install

cd ..\frontend
rm -r node_modules
npm install
```

### Problem: CORS errors
**Solution:**
- Ensure backend is running on http://localhost:5000
- Ensure frontend is running on http://localhost:3000
- Check CORS configuration in `backend\server.js`

### Problem: JWT Token errors
**Solution:**
- Clear browser localStorage
- Logout and login again
- Check if .env file exists in backend folder

## Development Mode

For development with auto-reload:

**Backend:**
```powershell
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```powershell
cd frontend
npm start  # Already has hot-reload
```

## Project Structure Overview

```
smart-campus/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── socket/          # WebSocket handlers
│   ├── .env             # Environment variables
│   ├── server.js        # Main server file
│   └── seed.js          # Database seeding
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # State management
│   │   ├── services/    # API calls
│   │   └── App.js       # Main app component
│   └── public/
│
├── README.md            # Full documentation
├── SETUP.md             # This file
├── install.bat          # Installation script
├── start-backend.bat    # Start backend server
├── start-frontend.bat   # Start frontend app
└── seed-database.bat    # Seed database
```

## Features Checklist

### ✅ Implemented Features:
- [x] User authentication (JWT + Refresh tokens)
- [x] Role-based access control (RBAC)
- [x] Student dashboard
- [x] Faculty dashboard
- [x] Admin dashboard
- [x] Security dashboard
- [x] Canteen dashboard
- [x] Course management
- [x] Assignment system
- [x] Attendance tracking
- [x] Event registration with QR
- [x] Hostel management
- [x] Gate pass system
- [x] Canteen food ordering
- [x] Complaint management
- [x] Lost & Found portal
- [x] Real-time chat (Socket.io)
- [x] Push notifications
- [x] QR code generation
- [x] MongoDB integration
- [x] RESTful API
- [x] Responsive UI

## Next Steps

1. **Customize the platform:**
   - Add your college logo
   - Update colors and themes
   - Add more departments

2. **Extend features:**
   - Add file upload for assignments
   - Implement payment gateway
   - Add SMS/Email notifications
   - Create mobile app

3. **Deploy to production:**
   - Use MongoDB Atlas for database
   - Deploy backend to Heroku/AWS
   - Deploy frontend to Vercel/Netlify

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the main README.md file
3. Check browser console for errors
4. Check terminal/PowerShell for server errors

## Security Notes

⚠️ **Important for Production:**
- Change JWT secrets in `.env`
- Use strong passwords
- Enable HTTPS
- Add rate limiting
- Implement input validation
- Use environment variables for sensitive data
- Enable MongoDB authentication
- Add CSRF protection

## Performance Tips

- Use pagination for large data sets
- Implement caching (Redis)
- Optimize database queries
- Use CDN for static assets
- Enable compression
- Monitor server resources

---

**Happy Coding! 🚀**

For detailed API documentation and feature explanations, see README.md
