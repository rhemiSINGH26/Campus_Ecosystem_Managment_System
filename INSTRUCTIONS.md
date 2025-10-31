# 🎓 SMART CAMPUS PLATFORM - COMPLETE INSTRUCTIONS

## 📋 TABLE OF CONTENTS
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Testing the Features](#testing-the-features)
5. [Troubleshooting](#troubleshooting)
6. [File Structure](#file-structure)

---

## ✅ PREREQUISITES

Before you begin, make sure you have installed:

### 1. Node.js (Required)
- **Download:** https://nodejs.org/
- **Version:** 14.x or higher
- **Verify installation:**
  ```powershell
  node --version
  npm --version
  ```

### 2. MongoDB (Required)
- **Download:** https://www.mongodb.com/try/download/community
- **Install MongoDB Community Edition**
- **Start MongoDB Service:**
  ```powershell
  # As Administrator
  net start MongoDB
  ```

### 3. Visual Studio Code (Optional but Recommended)
- **Download:** https://code.visualstudio.com/

---

## 🔧 INSTALLATION STEPS

### Step 1: Navigate to Project Directory
```powershell
cd d:\IA3\Web\Project
```

### Step 2: Install Dependencies (Choose ONE method)

#### Method A: Automated Installation (Recommended)
```powershell
.\install.bat
```

#### Method B: Manual Installation
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install

# Return to root
cd ..
```

**Expected Output:**
- Backend: ~15-20 packages installed
- Frontend: ~1400+ packages installed
- Time: 2-5 minutes depending on internet speed

---

## 🗄️ DATABASE SETUP

### Step 1: Ensure MongoDB is Running
```powershell
# Check if MongoDB is running
net start MongoDB
```

**If MongoDB is not installed as a service:**
```powershell
# Navigate to MongoDB bin folder and run
mongod
```

### Step 2: Seed the Database
```powershell
.\seed-database.bat
```

**Expected Output:**
```
✅ MongoDB Connected
🗑️  Cleared existing data
✅ Admin created
✅ Security user created
✅ Canteen user created
✅ Faculty users created
✅ Courses created
✅ Student users created
✅ Hostels created
✅ Canteen menu created
🎉 Database seeded successfully!
```

**Test Accounts Created:**
- 1 Admin account
- 2 Faculty accounts
- 3 Student accounts
- 1 Security account
- 1 Canteen vendor account

---

## 🚀 RUNNING THE APPLICATION

### Option 1: Separate Terminals (Recommended for Development)

#### Terminal 1 - Start Backend
```powershell
.\start-backend.bat
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 Socket.IO listening for connections
✅ MongoDB Connected Successfully
```

#### Terminal 2 - Start Frontend
```powershell
.\start-frontend.bat
```

**Expected Output:**
```
Compiled successfully!
You can now view smart-campus-frontend in the browser.
  Local:            http://localhost:3000
```

### Option 2: Development Mode (Both Together)
```powershell
.\dev-start.bat
```
This opens two separate terminal windows automatically.

---

## 🧪 TESTING THE FEATURES

### 1. Access the Application
Open your browser and go to: **http://localhost:3000**

### 2. Login as Different Users

#### Test as Student
1. **Login Credentials:**
   - Email: `alice@student.com`
   - Password: `student123`

2. **Test Features:**
   - ✅ View Dashboard → See enrolled courses
   - ✅ Go to Courses → View course details
   - ✅ Go to Assignments → See pending assignments
   - ✅ Go to Canteen → Browse menu, add items to cart
   - ✅ Go to Events → Register for events
   - ✅ Go to Hostel → Apply for gate pass
   - ✅ Go to Complaints → Submit a complaint

#### Test as Faculty
1. **Login Credentials:**
   - Email: `john.doe@campus.com`
   - Password: `faculty123`

2. **Test Features:**
   - ✅ View assigned courses
   - ✅ Create new assignment
   - ✅ Mark attendance
   - ✅ Grade submissions

#### Test as Admin
1. **Login Credentials:**
   - Email: `admin@campus.com`
   - Password: `admin123`

2. **Test Features:**
   - ✅ View analytics dashboard
   - ✅ View all users
   - ✅ Approve events
   - ✅ Manage complaints
   - ✅ Approve gate passes
   - ✅ Allot hostel rooms

#### Test as Canteen Vendor
1. **Login Credentials:**
   - Email: `canteen@campus.com`
   - Password: `canteen123`

2. **Test Features:**
   - ✅ View menu items
   - ✅ Manage orders
   - ✅ Update order status

#### Test as Security
1. **Login Credentials:**
   - Email: `security@campus.com`
   - Password: `security123`

2. **Test Features:**
   - ✅ View entry/exit logs
   - ✅ Generate QR codes
   - ✅ Manage lost & found items

---

## 🔍 TESTING SPECIFIC FEATURES

### Test Real-time Chat
1. Login as Student (alice@student.com)
2. Go to Chat section
3. Open another browser (incognito)
4. Login as Faculty (john.doe@campus.com)
5. Send messages - they should appear instantly

### Test Canteen Ordering
1. Login as Student
2. Go to Canteen
3. Add items to cart
4. Place order
5. Login as Canteen vendor in another browser
6. See the order appear
7. Update order status
8. Student sees status update

### Test Gate Pass Workflow
1. Login as Student
2. Go to Hostel → Apply for Gate Pass
3. Fill form and submit
4. Login as Admin
5. Go to Gate Passes
6. Approve/Reject the request
7. Login back as Student
8. See updated status

### Test Event Registration
1. Login as any user
2. Create an event
3. Login as Admin
4. Approve the event
5. Login as Student
6. Register for event
7. Receive QR code

---

## 🐛 TROUBLESHOOTING

### Issue 1: MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Or run MongoDB manually
cd C:\Program Files\MongoDB\Server\[version]\bin
mongod
```

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```powershell
# Option 1: Kill the process
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Option 2: Change port in backend\.env
# Edit PORT=5001
```

### Issue 3: Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```powershell
cd backend
rm -r node_modules
npm install
```

### Issue 4: React Scripts Not Found
**Error:** `react-scripts: not found`

**Solution:**
```powershell
cd frontend
rm -r node_modules
npm install
```

### Issue 5: CORS Error in Browser
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- Ensure backend is running on http://localhost:5000
- Ensure frontend is running on http://localhost:3000
- Check server.js CORS configuration

### Issue 6: Token Expired
**Error:** `Token expired`

**Solution:**
- Logout and login again
- Clear browser localStorage
- Check JWT expiration in .env

### Issue 7: Cannot Access After Reboot
**Solution:**
```powershell
# 1. Start MongoDB
net start MongoDB

# 2. Start Backend
cd backend
npm start

# 3. Start Frontend (in new terminal)
cd frontend
npm start
```

---

## 📁 FILE STRUCTURE OVERVIEW

```
Project Root
├── 📂 backend/              # Server-side code
│   ├── models/              # Database models (16 files)
│   ├── routes/              # API routes (14 files)
│   ├── middleware/          # Auth middleware
│   ├── socket/              # WebSocket handler
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── seed.js              # Database seeding
│
├── 📂 frontend/             # Client-side code
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth/        # Login, Register
│   │   │   └── Dashboards/  # 5 role-based dashboards
│   │   ├── context/         # Auth & Socket context
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   └── public/
│
├── 📄 Documentation Files
│   ├── README.md            # Complete documentation
│   ├── SETUP.md             # Setup guide
│   ├── API_REFERENCE.md     # API documentation
│   ├── PROJECT_SUMMARY.md   # Project overview
│   └── INSTRUCTIONS.md      # This file
│
└── 🔧 Helper Scripts
    ├── install.bat          # Install dependencies
    ├── start-backend.bat    # Start backend
    ├── start-frontend.bat   # Start frontend
    ├── seed-database.bat    # Seed database
    └── dev-start.bat        # Development mode
```

---

## 🎯 FEATURE CHECKLIST

Use this checklist to verify all features are working:

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Token refresh
- [ ] Role-based redirect

### Student Features
- [ ] View dashboard
- [ ] View courses
- [ ] View assignments
- [ ] Submit assignment
- [ ] View attendance
- [ ] Apply for gate pass
- [ ] Order food
- [ ] Register for event
- [ ] Submit complaint

### Faculty Features
- [ ] View courses
- [ ] Create assignment
- [ ] Mark attendance
- [ ] Grade submissions

### Admin Features
- [ ] View analytics
- [ ] Approve events
- [ ] Manage complaints
- [ ] Approve gate passes
- [ ] Allot hostel

### Canteen Features
- [ ] View menu
- [ ] Manage orders
- [ ] Update order status

### Security Features
- [ ] View entry logs
- [ ] Generate QR codes
- [ ] Manage lost & found

### Real-time Features
- [ ] Live chat works
- [ ] Notifications appear
- [ ] Order updates instant

---

## 📊 PERFORMANCE TIPS

### For Faster Loading
1. Clear browser cache regularly
2. Use latest browser version
3. Close unused browser tabs
4. Restart servers periodically

### For Better Development
1. Use VSCode with extensions:
   - ES7+ React snippets
   - Prettier
   - ESLint
   - MongoDB for VSCode

2. Use Postman for API testing

3. Use MongoDB Compass for database viewing

---

## 🔐 SECURITY REMINDERS

### For Development
- ✅ Use provided test credentials
- ✅ Don't expose .env file
- ✅ Keep MongoDB local

### For Production (Future)
- Change all secrets in .env
- Use environment variables
- Enable MongoDB authentication
- Use HTTPS
- Add rate limiting
- Implement CSRF protection

---

## 📱 BROWSER COMPATIBILITY

### Recommended Browsers
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Edge (Latest)

### Not Recommended
- ❌ Internet Explorer
- ❌ Very old browser versions

---

## 💡 TIPS & TRICKS

### Quick Restart
```powershell
# Stop servers: Ctrl+C in both terminals
# Restart:
.\start-backend.bat
.\start-frontend.bat
```

### Reset Database
```powershell
# Drop database and reseed
.\seed-database.bat
```

### View Logs
- Backend logs: Terminal where backend is running
- Frontend logs: Browser console (F12)
- MongoDB logs: MongoDB service logs

### Test API Directly
Use Postman or curl:
```powershell
# Test login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@campus.com\",\"password\":\"admin123\"}"
```

---

## 🎓 LEARNING RESOURCES

### Understand the Code
1. **Backend Flow:**
   - server.js → routes → middleware → models → database

2. **Frontend Flow:**
   - index.js → App.js → components → context → API calls

3. **Authentication Flow:**
   - Login → JWT token → Store in localStorage → Include in headers

4. **WebSocket Flow:**
   - Connect → Join room → Emit/Listen events

### Next Steps
- Modify existing features
- Add new features
- Change styling
- Deploy to cloud

---

## 📞 GETTING HELP

If you encounter issues:

1. **Check Documentation:**
   - README.md for features
   - SETUP.md for installation
   - API_REFERENCE.md for API details

2. **Check Logs:**
   - Backend terminal for server errors
   - Browser console for frontend errors
   - MongoDB logs for database issues

3. **Common Commands:**
   ```powershell
   # Check if ports are free
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   
   # Check MongoDB status
   net start MongoDB
   
   # Reinstall dependencies
   cd backend && npm install
   cd frontend && npm install
   ```

---

## ✅ FINAL CHECKLIST

Before considering setup complete:

- [ ] MongoDB installed and running
- [ ] Node.js installed (v14+)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database seeded successfully
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can login with test accounts
- [ ] Dashboard loads correctly
- [ ] All role dashboards accessible
- [ ] Real-time features working

---

## 🎉 SUCCESS!

If all above checkpoints pass, your Smart Campus Platform is fully functional!

**URLs to Remember:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: See API_REFERENCE.md

**Test Accounts:**
- Admin: admin@campus.com / admin123
- Faculty: john.doe@campus.com / faculty123
- Student: alice@student.com / student123
- Security: security@campus.com / security123
- Canteen: canteen@campus.com / canteen123

---

**Happy Coding! 🚀**

*For detailed information, refer to README.md and other documentation files.*
