const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Event = require('./models/Event');
const Complaint = require('./models/Complaint');
const LostFound = require('./models/LostFound');
const GatePass = require('./models/GatePass');
const Order = require('./models/Order');
const Hostel = require('./models/Hostel');
const Timetable = require('./models/Timetable');
const Attendance = require('./models/Attendance');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

const seedDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    
    // Clear all collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Event.deleteMany({});
    await Complaint.deleteMany({});
    await LostFound.deleteMany({});
    await GatePass.deleteMany({});
    await Order.deleteMany({});
    await Hostel.deleteMany({});
    await Timetable.deleteMany({});
    await Attendance.deleteMany({});

    console.log('✅ Existing data cleared\n');

    // Hash password once for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ==================== USERS ====================
    console.log('👥 Creating users...');
    
    // Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890',
      department: 'Administration'
    });

    // Security
    const security = await User.create({
      name: 'Security Guard',
      email: 'security@campus.com',
      password: hashedPassword,
      role: 'security',
      phone: '1234567891',
      department: 'Security'
    });

    // Canteen
    const canteen = await User.create({
      name: 'Canteen Manager',
      email: 'canteen@campus.com',
      password: hashedPassword,
      role: 'canteen',
      phone: '1234567892',
      department: 'Canteen'
    });

    // Faculty (6 faculty members)
    const facultyData = [
      { name: 'Dr. Sarah Johnson', department: 'Computer Science', specialization: 'AI & Machine Learning' },
      { name: 'Prof. Michael Chen', department: 'Computer Science', specialization: 'Data Structures' },
      { name: 'Dr. Emily Williams', department: 'Electronics', specialization: 'Digital Systems' },
      { name: 'Prof. David Brown', department: 'Mathematics', specialization: 'Calculus' },
      { name: 'Dr. Lisa Anderson', department: 'Physics', specialization: 'Quantum Mechanics' },
      { name: 'Prof. James Wilson', department: 'Computer Science', specialization: 'Database Management' }
    ];

    const faculty = [];
    for (let i = 0; i < facultyData.length; i++) {
      const f = await User.create({
        name: facultyData[i].name,
        email: `faculty${i + 1}@campus.com`,
        password: hashedPassword,
        role: 'faculty',
        phone: `12345678${93 + i}`,
        department: facultyData[i].department,
        specialization: facultyData[i].specialization
      });
      faculty.push(f);
    }

    // Students (60 students)
    const students = [];
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
    const years = ['1', '2', '3', '4'];
    
    for (let i = 1; i <= 60; i++) {
      const student = await User.create({
        name: `Student ${i}`,
        email: `student${i}@campus.com`,
        password: hashedPassword,
        role: 'student',
        phone: `98765${43210 + i}`,
        department: departments[(i - 1) % departments.length],
        year: years[Math.floor((i - 1) / 15) % 4],
        rollNumber: `STU${2024}${String(i).padStart(3, '0')}`,
        semester: Math.floor((i - 1) / 15) % 4 + 1,
        hostelRoom: `H${Math.floor(i / 10) + 1}-${(i % 10) + 1}`,
        bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][i % 6]
      });
      students.push(student);
    }

    console.log(`✅ Created ${students.length + faculty.length + 3} users\n`);

    // ==================== COURSES ====================
    console.log('📚 Creating courses...');
    
    const coursesData = [
      { courseCode: 'CS101', courseName: 'Introduction to Programming', credits: 4, department: 'Computer Science', semester: 1, faculty: faculty[0]._id },
      { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', credits: 4, department: 'Computer Science', semester: 2, faculty: faculty[1]._id },
      { courseCode: 'CS301', courseName: 'Database Management Systems', credits: 3, department: 'Computer Science', semester: 3, faculty: faculty[5]._id },
      { courseCode: 'CS401', courseName: 'Artificial Intelligence', credits: 4, department: 'Computer Science', semester: 4, faculty: faculty[0]._id },
      { courseCode: 'EC101', courseName: 'Digital Electronics', credits: 3, department: 'Electronics', semester: 1, faculty: faculty[2]._id },
      { courseCode: 'EC201', courseName: 'Microprocessors', credits: 4, department: 'Electronics', semester: 2, faculty: faculty[2]._id },
      { courseCode: 'MA101', courseName: 'Calculus I', credits: 3, department: 'Mathematics', semester: 1, faculty: faculty[3]._id },
      { courseCode: 'MA201', courseName: 'Linear Algebra', credits: 3, department: 'Mathematics', semester: 2, faculty: faculty[3]._id },
      { courseCode: 'PH101', courseName: 'Physics I', credits: 3, department: 'Physics', semester: 1, faculty: faculty[4]._id },
      { courseCode: 'PH201', courseName: 'Quantum Physics', credits: 4, department: 'Physics', semester: 2, faculty: faculty[4]._id },
      { courseCode: 'CS202', courseName: 'Operating Systems', credits: 4, department: 'Computer Science', semester: 2, faculty: faculty[1]._id },
      { courseCode: 'CS302', courseName: 'Computer Networks', credits: 3, department: 'Computer Science', semester: 3, faculty: faculty[5]._id },
      { courseCode: 'CS402', courseName: 'Machine Learning', credits: 4, department: 'Computer Science', semester: 4, faculty: faculty[0]._id },
      { courseCode: 'EC301', courseName: 'VLSI Design', credits: 3, department: 'Electronics', semester: 3, faculty: faculty[2]._id },
      { courseCode: 'MA301', courseName: 'Probability & Statistics', credits: 3, department: 'Mathematics', semester: 3, faculty: faculty[3]._id }
    ];

    const courses = [];
    for (const courseData of coursesData) {
      const course = await Course.create({
        ...courseData,
        enrolledStudents: students.slice(0, 15 + Math.floor(Math.random() * 20)).map(s => s._id)
      });
      courses.push(course);
    }

    console.log(`✅ Created ${courses.length} courses\n`);

    // ==================== ASSIGNMENTS ====================
    console.log('📝 Creating assignments...');
    
    const assignments = [];
    for (let i = 0; i < 15; i++) {
      const course = courses[i % courses.length];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i % 30) + 1);
      
      const assignment = await Assignment.create({
        title: `Assignment ${i + 1}: ${['Programming Exercise', 'Project Work', 'Lab Report', 'Case Study', 'Research Paper'][i % 5]}`,
        description: `Complete the ${['coding task', 'design project', 'laboratory experiment', 'analysis report', 'research work'][i % 5]} as per the guidelines provided in class.`,
        course: course._id,
        faculty: course.faculty,
        dueDate: dueDate,
        totalMarks: [50, 100, 75, 80, 60][i % 5],
        attachments: i % 3 === 0 ? [{ filename: 'assignment_guidelines.pdf', url: '/uploads/assignment_guidelines.pdf' }] : [],
        submissions: []
      });
      assignments.push(assignment);
    }

    console.log(`✅ Created ${assignments.length} assignments\n`);

    // ==================== EVENTS ====================
    console.log('🎉 Creating events...');
    
    const eventsData = [
      { title: 'Tech Fest 2024', eventType: 'technical', venue: 'Main Auditorium', maxParticipants: 500 },
      { title: 'Annual Sports Day', eventType: 'sports', venue: 'Sports Ground', maxParticipants: 1000 },
      { title: 'Cultural Night', eventType: 'cultural', venue: 'Open Air Theatre', maxParticipants: 800 },
      { title: 'Hackathon 24hrs', eventType: 'technical', venue: 'Computer Lab', maxParticipants: 100 },
      { title: 'Guest Lecture: AI in Healthcare', eventType: 'seminar', venue: 'Seminar Hall', maxParticipants: 200 },
      { title: 'Blood Donation Camp', eventType: 'other', venue: 'Medical Center', maxParticipants: 150 },
      { title: 'Photography Workshop', eventType: 'workshop', venue: 'Media Lab', maxParticipants: 50 },
      { title: 'Coding Competition', eventType: 'technical', venue: 'Computer Center', maxParticipants: 120 },
      { title: 'Music Concert', eventType: 'cultural', venue: 'Amphitheatre', maxParticipants: 600 },
      { title: 'Career Fair 2024', eventType: 'seminar', venue: 'Exhibition Hall', maxParticipants: 400 },
      { title: 'Yoga & Wellness Session', eventType: 'sports', venue: 'Yoga Hall', maxParticipants: 80 },
      { title: 'Startup Pitch Competition', eventType: 'workshop', venue: 'Innovation Hub', maxParticipants: 60 },
      { title: 'Environmental Awareness Rally', eventType: 'other', venue: 'Campus Grounds', maxParticipants: 300 },
      { title: 'Robotics Exhibition', eventType: 'technical', venue: 'Engineering Block', maxParticipants: 250 },
      { title: 'Alumni Meet 2024', eventType: 'other', venue: 'Convention Center', maxParticipants: 500 }
    ];

    const events = [];
    for (let i = 0; i < eventsData.length; i++) {
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + (i * 3) + 1);
      
      const event = await Event.create({
        ...eventsData[i],
        description: `Join us for an exciting ${eventsData[i].title}! This event promises to be educational, entertaining, and memorable.`,
        eventDate: eventDate,
        startTime: `${10 + (i % 8)}:00`,
        endTime: `${14 + (i % 6)}:00`,
        organizer: i % 2 === 0 ? admin._id : faculty[i % faculty.length]._id,
        status: i % 4 === 0 ? 'pending' : (i % 4 === 1 ? 'approved' : 'completed'),
        approvedBy: i % 4 !== 0 ? admin._id : null,
        registeredParticipants: students.slice(0, 10 + (i % 30)).map(s => ({
          user: s._id,
          registeredAt: new Date(Date.now() - (i * 86400000)),
          hasAttended: i % 4 === 2
        })),
        poster: `/images/event${i % 5 + 1}.jpg`
      });
      events.push(event);
    }

    console.log(`✅ Created ${events.length} events\n`);

    // ==================== COMPLAINTS ====================
    console.log('📢 Creating complaints...');
    
    const complaintCategories = ['Academic', 'Infrastructure', 'Hostel', 'Library', 'Canteen', 'Transport', 'Sports', 'Others'];
    const complaintTitles = [
      'AC not working in classroom',
      'Poor WiFi connectivity in hostel',
      'Insufficient books in library',
      'Food quality issues in canteen',
      'Broken equipment in lab',
      'Delay in bus schedule',
      'Sports ground maintenance needed',
      'Hostel water supply problem',
      'Classroom projector malfunction',
      'Canteen hygiene concerns',
      'Library timing extension request',
      'Damaged furniture in classroom',
      'Insufficient parking space',
      'Noise pollution near study area',
      'Improper waste disposal'
    ];

    const complaints = [];
    for (let i = 0; i < 15; i++) {
      const complaint = await Complaint.create({
        student: students[i * 4]._id,
        title: complaintTitles[i],
        description: `Detailed description of the issue: ${complaintTitles[i]}. This needs immediate attention and resolution.`,
        category: complaintCategories[i % complaintCategories.length],
        priority: ['low', 'medium', 'high'][i % 3],
        status: ['pending', 'in-progress', 'resolved'][i % 3]
      });
      complaints.push(complaint);
    }

    console.log(`✅ Created ${complaints.length} complaints\n`);

    // ==================== LOST & FOUND ====================
    console.log('🔍 Creating lost & found items...');
    
    const lostFoundItems = [
      { type: 'lost', item: 'Black Backpack', location: 'Library 2nd Floor', category: 'Bag' },
      { type: 'found', item: 'Blue Water Bottle', location: 'Canteen', category: 'Bottle' },
      { type: 'lost', item: 'iPhone 13 Pro', location: 'Sports Ground', category: 'Electronics' },
      { type: 'found', item: 'Silver Wristwatch', location: 'Auditorium', category: 'Accessories' },
      { type: 'lost', item: 'Red Notebook', location: 'Classroom 301', category: 'Stationary' },
      { type: 'found', item: 'Wireless Earbuds', location: 'Parking Area', category: 'Electronics' },
      { type: 'lost', item: 'Student ID Card', location: 'Main Gate', category: 'Documents' },
      { type: 'found', item: 'Brown Wallet', location: 'Computer Lab', category: 'Wallet' },
      { type: 'lost', item: 'Calculator (Casio)', location: 'Exam Hall', category: 'Electronics' },
      { type: 'found', item: 'Umbrella (Black)', location: 'Bus Stop', category: 'Others' },
      { type: 'lost', item: 'Laptop Charger', location: 'Library Study Room', category: 'Electronics' },
      { type: 'found', item: 'Spectacles Case', location: 'Cafeteria', category: 'Accessories' },
      { type: 'lost', item: 'Green Hoodie', location: 'Gym', category: 'Clothing' },
      { type: 'found', item: 'USB Drive (32GB)', location: 'Lab 405', category: 'Electronics' },
      { type: 'lost', item: 'Textbook: DSA', location: 'Corridor Block C', category: 'Books' }
    ];

    const lostFounds = [];
    for (let i = 0; i < lostFoundItems.length; i++) {
      const item = lostFoundItems[i];
      const lostFound = await LostFound.create({
        reportedBy: students[(i * 3) % students.length]._id,
        type: item.type,
        itemName: item.item,
        description: `${item.type === 'lost' ? 'Lost' : 'Found'} ${item.item} at ${item.location}. Please contact if you have any information.`,
        category: item.category,
        location: item.location,
        dateReported: new Date(Date.now() - (i * 86400000 * 2)),
        status: ['pending', 'claimed', 'returned'][i % 3],
        imageUrl: i % 3 === 0 ? `/images/item_${i}.jpg` : null,
        contactInfo: students[(i * 3) % students.length].phone
      });
      lostFounds.push(lostFound);
    }

    console.log(`✅ Created ${lostFounds.length} lost & found items\n`);

    // ==================== GATE PASSES ====================
    console.log('🎫 Creating gate passes...');
    
    const reasons = [
      'Medical Appointment',
      'Family Emergency',
      'Job Interview',
      'Bank Work',
      'Home Visit',
      'Shopping',
      'Document Collection',
      'Meeting with Parents',
      'Health Checkup',
      'Library Visit Outside',
      'Workshop Attendance',
      'Internship Interview',
      'Personal Work',
      'Court Appearance',
      'Visa Documentation'
    ];

    const gatePasses = [];
    for (let i = 0; i < 15; i++) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() + (i % 7));
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + (i % 3));
      
      const gatePass = await GatePass.create({
        student: students[i * 3 % students.length]._id,
        reason: reasons[i],
        destination: ['City Hospital', 'Home Town', 'Tech Park', 'Main Bank', 'Railway Station', 'Shopping Mall', 'Government Office'][i % 7],
        fromDate: fromDate,
        toDate: toDate,
        status: ['pending', 'approved', 'rejected'][i % 3],
        approvedBy: i % 3 === 1 ? admin._id : null,
        approvalDate: i % 3 === 1 ? new Date() : null,
        remarks: i % 3 === 2 ? 'Insufficient reason provided' : (i % 3 === 1 ? 'Approved' : null)
      });
      gatePasses.push(gatePass);
    }

    console.log(`✅ Created ${gatePasses.length} gate passes\n`);

    // ==================== CANTEEN ORDERS ====================
    console.log('🍔 Creating canteen orders...');
    
    const menuItems = [
      { name: 'Veg Burger', price: 50 },
      { name: 'Chicken Sandwich', price: 80 },
      { name: 'Masala Dosa', price: 60 },
      { name: 'Paneer Roll', price: 70 },
      { name: 'Cold Coffee', price: 40 },
      { name: 'Veg Biryani', price: 100 },
      { name: 'French Fries', price: 50 },
      { name: 'Pizza Slice', price: 90 },
      { name: 'Samosa (2pc)', price: 30 },
      { name: 'Mango Juice', price: 35 }
    ];

    const canteenOrders = [];
    for (let i = 0; i < 15; i++) {
      const orderItems = [];
      const numItems = (i % 3) + 1;
      let total = 0;
      
      for (let j = 0; j < numItems; j++) {
        const item = menuItems[(i + j) % menuItems.length];
        const quantity = (j % 2) + 1;
        orderItems.push({
          itemName: item.name,
          quantity: quantity,
          price: item.price
        });
        total += item.price * quantity;
      }

      const canteenOrder = await Order.create({
        orderNumber: `ORD${Date.now()}${i}`,
        customer: students[i * 2 % students.length]._id,
        items: orderItems,
        totalAmount: total,
        orderStatus: ['placed', 'preparing', 'ready', 'completed'][i % 4],
        paymentStatus: i % 3 === 0 ? 'completed' : 'pending',
        paymentMethod: ['cash', 'upi', 'wallet'][i % 3],
        specialInstructions: i % 5 === 0 ? 'Extra spicy please' : null,
        estimatedTime: 15 + (i % 20)
      });
      canteenOrders.push(canteenOrder);
    }

    console.log(`✅ Created ${canteenOrders.length} canteen orders\n`);

    // ==================== HOSTEL ROOMS ====================
    console.log('🏠 Creating hostel records...');
    
    const hostelIssues = [
      'Room cleaning not done',
      'Water heater not working',
      'Door lock broken',
      'Electricity issues',
      'AC/Fan malfunction',
      'Bathroom drainage problem',
      'Window glass broken',
      'Furniture damage',
      'Pest control needed',
      'WiFi connectivity poor',
      'Room light not working',
      'Cupboard lock issue',
      'Bathroom tap leaking',
      'Wall paint peeling',
      'Room ventilation poor'
    ];

    const hostels = [];
    const hostelNames = ['Hostel A - Boys', 'Hostel B - Boys', 'Hostel C - Girls', 'Hostel D - Girls'];
    
    for (let i = 0; i < hostelNames.length; i++) {
      const rooms = [];
      for (let j = 1; j <= 5; j++) {
        const roomOccupants = students.slice(i * 7 + j, i * 7 + j + 2).map(s => s._id);
        rooms.push({
          roomNumber: `${i + 1}0${j}`,
          floor: Math.floor(j / 3) + 1,
          capacity: 3,
          occupants: roomOccupants
        });
      }
      
      const hostel = await Hostel.create({
        hostelName: hostelNames[i],
        hostelType: i < 2 ? 'boys' : 'girls',
        warden: {
          name: `Warden ${i + 1}`,
          phone: `98765432${i}0`,
          email: `warden${i + 1}@campus.com`
        },
        totalRooms: 50,
        occupiedRooms: 30 + i * 5,
        facilities: ['WiFi', 'Common Room', 'Gym', 'Laundry', 'Mess', 'Study Hall'],
        rooms: rooms
      });
      hostels.push(hostel);
    }

    console.log(`✅ Created ${hostels.length} hostels\n`);

    // ==================== TIMETABLE ====================
    console.log('📅 Creating timetables...');
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
    const rooms = ['101', '102', '201', '202', '301', '302', 'Lab1', 'Lab2'];

    const timetables = [];
    for (let i = 0; i < 25; i++) {
      const course = courses[i % courses.length];
      const timetable = await Timetable.create({
        course: course._id,
        faculty: course.faculty,
        day: days[i % days.length],
        timeSlot: timeSlots[i % timeSlots.length],
        room: rooms[i % rooms.length],
        type: i % 3 === 0 ? 'lecture' : (i % 3 === 1 ? 'lab' : 'tutorial'),
        semester: Math.floor(i / 6) % 4 + 1,
        department: course.department
      });
      timetables.push(timetable);
    }

    console.log(`✅ Created ${timetables.length} timetable entries\n`);

    // ==================== ATTENDANCE ====================
    console.log('✅ Creating attendance records...');
    
    const attendances = [];
    for (let i = 0; i < 20; i++) {
      const course = courses[i % courses.length];
      const date = new Date();
      date.setDate(date.getDate() - (i * 3));
      
      const presentStudents = students.slice(0, 10 + (i % 15));
      
      const attendance = await Attendance.create({
        course: course._id,
        faculty: course.faculty,
        date: date,
        presentStudents: presentStudents.map(s => s._id),
        absentStudents: students.filter(s => !presentStudents.includes(s)).slice(0, 5).map(s => s._id),
        totalClasses: 1,
        remarks: i % 4 === 0 ? 'Good attendance' : null
      });
      attendances.push(attendance);
    }

    console.log(`✅ Created ${attendances.length} attendance records\n`);

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(60));
    console.log('✨ DATABASE SEEDED SUCCESSFULLY! ✨');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${students.length + faculty.length + 3}`);
    console.log(`   • Courses: ${courses.length}`);
    console.log(`   • Assignments: ${assignments.length}`);
    console.log(`   • Events: ${events.length}`);
    console.log(`   • Complaints: ${complaints.length}`);
    console.log(`   • Lost & Found: ${lostFounds.length}`);
    console.log(`   • Gate Passes: ${gatePasses.length}`);
    console.log(`   • Canteen Orders: ${canteenOrders.length}`);
    console.log(`   • Hostels: ${hostels.length}`);
    console.log(`   • Timetable Entries: ${timetables.length}`);
    console.log(`   • Attendance Records: ${attendances.length}`);

    console.log('\n🔑 Login Credentials:');
    console.log('─'.repeat(60));
    console.log('   📧 Email Pattern: role + number + @campus.com');
    console.log('   🔒 Password: password123 (for all users)');
    console.log('─'.repeat(60));
    console.log('   Admin:    admin@campus.com');
    console.log('   Security: security@campus.com');
    console.log('   Canteen:  canteen@campus.com');
    console.log('   Faculty:  faculty1@campus.com to faculty6@campus.com');
    console.log('   Students: student1@campus.com to student60@campus.com');
    console.log('─'.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
