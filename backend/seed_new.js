const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Hostel = require('./models/Hostel');
const CanteenMenu = require('./models/CanteenMenu');
const Event = require('./models/Event');
const Complaint = require('./models/Complaint');
const Assignment = require('./models/Assignment');
const Timetable = require('./models/Timetable');

dotenv.config();

// Helper function to generate student names
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya',
  'Aadhya', 'Ananya', 'Diya', 'Isha', 'Kavya', 'Kiara', 'Myra', 'Saanvi', 'Sara', 'Navya',
  'Rohan', 'Vihaan', 'Advait', 'Dhruv', 'Kabir', 'Reyansh', 'Atharv', 'Pranav', 'Aryan', 'Aarav',
  'Priya', 'Riya', 'Anika', 'Aditi', 'Pooja', 'Sneha', 'Neha', 'Shruti', 'Divya', 'Anjali',
  'Karan', 'Harsh', 'Kunal', 'Manish', 'Nikhil', 'Rahul', 'Rohit', 'Siddharth', 'Varun', 'Yash',
  'Simran', 'Tanvi', 'Tara', 'Uma', 'Vanya', 'Zara', 'Bhavya', 'Charvi', 'Dia', 'Eesha'];

const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Joshi', 'Mehta', 'Nair',
  'Iyer', 'Rao', 'Desai', 'Kulkarni', 'Pandey', 'Agarwal', 'Bansal', 'Chopra', 'Das', 'Ghosh',
  'Jain', 'Kapoor', 'Malhotra', 'Mishra', 'Pillai', 'Shah', 'Sinha', 'Thakur', 'Trivedi', 'Yadav'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Hostel.deleteMany({});
    await CanteenMenu.deleteMany({});
    await Event.deleteMany({});
    await Complaint.deleteMany({});
    await Assignment.deleteMany({});
    await Timetable.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const admin = new User({
      email: 'admin@campus.com',
      password: 'password123',
      role: 'admin',
      name: 'Admin User',
      phone: '1234567890'
    });
    await admin.save();

    const security = new User({
      email: 'security@campus.com',
      password: 'password123',
      role: 'security',
      name: 'Security Guard',
      phone: '1234567891'
    });
    await security.save();

    const canteen = new User({
      email: 'canteen@campus.com',
      password: 'password123',
      role: 'canteen',
      name: 'Canteen Manager',
      phone: '1234567892'
    });
    await canteen.save();

    const facultyData = [
      { email: 'faculty1@campus.com', name: 'Dr. John Doe', phone: '1234567893', facultyId: 'FAC001', department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D.', specialization: 'AI' },
      { email: 'faculty2@campus.com', name: 'Dr. Jane Smith', phone: '1234567894', facultyId: 'FAC002', department: 'Electronics', designation: 'Associate Professor', qualification: 'Ph.D.', specialization: 'VLSI' },
      { email: 'faculty3@campus.com', name: 'Dr. Maria Garcia', phone: '1234567895', facultyId: 'FAC003', department: 'Computer Science', designation: 'Assistant Professor', qualification: 'Ph.D.', specialization: 'Web Dev' },
      { email: 'faculty4@campus.com', name: 'Dr. Robert Lee', phone: '1234567896', facultyId: 'FAC004', department: 'Mathematics', designation: 'Professor', qualification: 'Ph.D.', specialization: 'Math' },
      { email: 'faculty5@campus.com', name: 'Dr. Sarah Johnson', phone: '1234567897', facultyId: 'FAC005', department: 'Computer Science', designation: 'Assistant Professor', qualification: 'Ph.D.', specialization: 'ML' },
      { email: 'faculty6@campus.com', name: 'Dr. Michael Brown', phone: '1234567898', facultyId: 'FAC006', department: 'Electronics', designation: 'Associate Professor', qualification: 'Ph.D.', specialization: 'Wireless' }
    ];

    const faculty = [];
    for (const data of facultyData) {
      const userDoc = new User({
        email: data.email,
        password: 'password123',
        role: 'faculty',
        name: data.name,
        phone: data.phone
      });
      await userDoc.save();

      const facultyDoc = new Faculty({
        userId: userDoc._id,
        facultyId: data.facultyId,
        department: data.department,
        designation: data.designation,
        qualification: data.qualification,
        specialization: data.specialization,
        assignedCourses: []
      });
      await facultyDoc.save();
      faculty.push(facultyDoc);
    }
    console.log('✅ 6 faculty created');

    const coursesData = [
      { code: 'CS101', name: 'Introduction to Programming', dept: 'Computer Science', credits: 4, semester: 1, faculty: faculty[0]._id },
      { code: 'CS102', name: 'Object Oriented Programming', dept: 'Computer Science', credits: 4, semester: 2, faculty: faculty[0]._id },
      { code: 'CS201', name: 'Data Structures', dept: 'Computer Science', credits: 4, semester: 3, faculty: faculty[0]._id },
      { code: 'CS202', name: 'Database Systems', dept: 'Computer Science', credits: 3, semester: 4, faculty: faculty[2]._id },
      { code: 'CS301', name: 'Web Development', dept: 'Computer Science', credits: 3, semester: 5, faculty: faculty[2]._id },
      { code: 'CS302', name: 'Artificial Intelligence', dept: 'Computer Science', credits: 4, semester: 6, faculty: faculty[0]._id },
      { code: 'CS303', name: 'Machine Learning', dept: 'Computer Science', credits: 4, semester: 6, faculty: faculty[4]._id },
      { code: 'CS401', name: 'Cloud Computing', dept: 'Computer Science', credits: 3, semester: 7, faculty: faculty[2]._id },
      { code: 'EC101', name: 'Basic Electronics', dept: 'Electronics', credits: 3, semester: 1, faculty: faculty[1]._id },
      { code: 'EC201', name: 'Digital Electronics', dept: 'Electronics', credits: 4, semester: 3, faculty: faculty[1]._id },
      { code: 'EC301', name: 'Microprocessors', dept: 'Electronics', credits: 4, semester: 5, faculty: faculty[1]._id },
      { code: 'EC302', name: 'Wireless Communication', dept: 'Electronics', credits: 3, semester: 6, faculty: faculty[5]._id },
      { code: 'MATH101', name: 'Engineering Mathematics I', dept: 'Mathematics', credits: 4, semester: 1, faculty: faculty[3]._id },
      { code: 'MATH201', name: 'Engineering Mathematics II', dept: 'Mathematics', credits: 4, semester: 2, faculty: faculty[3]._id },
      { code: 'MATH301', name: 'Probability & Statistics', dept: 'Mathematics', credits: 3, semester: 5, faculty: faculty[3]._id }
    ];

    const courses = [];
    for (const data of coursesData) {
      const courseDoc = new Course({
        courseCode: data.code,
        courseName: data.name,
        department: data.dept,
        credits: data.credits,
        semester: data.semester,
        faculty: data.faculty,
        enrolledStudents: [],
        isActive: true
      });
      await courseDoc.save();
      courses.push(courseDoc);
    }
    console.log('✅ 15 courses created');

    const students = [];
    const departments = ['Computer Science', 'Electronics'];
    const sections = ['A', 'B', 'C'];
    
    for (let i = 0; i < 60; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / 2) % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const email = `student${i + 1}@campus.com`;
      const studentId = `STU${String(i + 1).padStart(3, '0')}`;
      
      const year = Math.floor(i / 15) + 1;
      const semester = (year * 2) - 1;
      const department = departments[i % 2];
      const section = sections[i % 3];

      let enrolledCourses = [];
      if (department === 'Computer Science') {
        if (semester === 1) enrolledCourses = [courses[0]._id, courses[12]._id];
        else if (semester === 2) enrolledCourses = [courses[1]._id, courses[13]._id];
        else if (semester === 3) enrolledCourses = [courses[2]._id];
        else if (semester === 4) enrolledCourses = [courses[3]._id];
        else if (semester === 5) enrolledCourses = [courses[4]._id, courses[14]._id];
        else if (semester === 6) enrolledCourses = [courses[5]._id, courses[6]._id];
        else if (semester === 7) enrolledCourses = [courses[7]._id];
      } else {
        if (semester === 1) enrolledCourses = [courses[8]._id, courses[12]._id];
        else if (semester === 2) enrolledCourses = [courses[13]._id];
        else if (semester === 3) enrolledCourses = [courses[9]._id];
        else if (semester === 5) enrolledCourses = [courses[10]._id, courses[14]._id];
        else if (semester === 6) enrolledCourses = [courses[11]._id];
      }

      const userDoc = new User({
        email: email,
        password: 'password123',
        role: 'student',
        name: fullName,
        phone: `98765${String(43210 + i).slice(-5)}`
      });
      await userDoc.save();

      const studentDoc = new Student({
        userId: userDoc._id,
        studentId: studentId,
        department: department,
        year: year,
        semester: semester,
        section: section,
        enrolledCourses: enrolledCourses,
        parentContact: {
          name: `Parent of ${fullName}`,
          phone: `99887${String(76543 + i).slice(-5)}`,
          email: `parent${i + 1}@email.com`
        }
      });
      await studentDoc.save();
      students.push(studentDoc);

      for (const courseId of enrolledCourses) {
        const course = courses.find(c => c._id.toString() === courseId.toString());
        if (course) {
          course.enrolledStudents.push(studentDoc._id);
          await course.save();
        }
      }
    }
    console.log('✅ 60 students created');

    faculty[0].assignedCourses = [courses[0]._id, courses[1]._id, courses[2]._id, courses[5]._id];
    await faculty[0].save();
    faculty[1].assignedCourses = [courses[8]._id, courses[9]._id, courses[10]._id];
    await faculty[1].save();
    faculty[2].assignedCourses = [courses[3]._id, courses[4]._id, courses[7]._id];
    await faculty[2].save();
    faculty[3].assignedCourses = [courses[12]._id, courses[13]._id, courses[14]._id];
    await faculty[3].save();
    faculty[4].assignedCourses = [courses[6]._id];
    await faculty[4].save();
    faculty[5].assignedCourses = [courses[11]._id];
    await faculty[5].save();

    const boysHostelRooms = [];
    for (let floor = 1; floor <= 5; floor++) {
      for (let room = 1; room <= 20; room++) {
        boysHostelRooms.push({
          roomNumber: `${floor}${String(room).padStart(2, '0')}`,
          floor: floor,
          capacity: 2,
          occupants: []
        });
      }
    }

    const girlsHostelRooms = [];
    for (let floor = 1; floor <= 5; floor++) {
      for (let room = 1; room <= 20; room++) {
        girlsHostelRooms.push({
          roomNumber: `${floor}${String(room).padStart(2, '0')}`,
          floor: floor,
          capacity: 2,
          occupants: []
        });
      }
    }

    let boysRoomIndex = 0, girlsRoomIndex = 0;
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const isMale = i % 2 === 0;
      
      if (isMale && boysRoomIndex < boysHostelRooms.length) {
        const room = boysHostelRooms[Math.floor(boysRoomIndex / 2)];
        room.occupants.push(student._id);
        student.roomNumber = room.roomNumber;
        student.hostelId = null; // Will be set after hostel creation
        if (room.occupants.length === 2) boysRoomIndex += 2;
        else boysRoomIndex++;
        await student.save();
      } else if (!isMale && girlsRoomIndex < girlsHostelRooms.length) {
        const room = girlsHostelRooms[Math.floor(girlsRoomIndex / 2)];
        room.occupants.push(student._id);
        student.roomNumber = room.roomNumber;
        student.hostelId = null;
        if (room.occupants.length === 2) girlsRoomIndex += 2;
        else girlsRoomIndex++;
        await student.save();
      }
    }

    const boysHostel = new Hostel({
      hostelName: 'Sunrise Boys Hostel',
      hostelType: 'boys',
      warden: { name: 'Mr. Rajesh Kumar', phone: '9876543213', email: 'kumar@campus.com' },
      totalRooms: 100,
      occupiedRooms: Math.ceil(students.filter((_, i) => i % 2 === 0).length / 2),
      facilities: ['WiFi', 'Gym', 'Canteen', 'Study Room', 'Sports Ground'],
      rooms: boysHostelRooms
    });
    await boysHostel.save();

    const girlsHostel = new Hostel({
      hostelName: 'Sunrise Girls Hostel',
      hostelType: 'girls',
      warden: { name: 'Ms. Priya Sharma', phone: '9876543214', email: 'sharma@campus.com' },
      totalRooms: 100,
      occupiedRooms: Math.ceil(students.filter((_, i) => i % 2 === 1).length / 2),
      facilities: ['WiFi', 'Gym', 'Canteen', 'Study Room', 'Library'],
      rooms: girlsHostelRooms
    });
    await girlsHostel.save();

    for (let i = 0; i < students.length; i++) {
      students[i].hostelId = (i % 2 === 0) ? boysHostel._id : girlsHostel._id;
      await students[i].save();
    }
    console.log('✅ Hostels created');

    const menuItems = [
      { itemName: 'Veg Burger', category: 'snacks', price: 50, description: 'Delicious veg burger', isVeg: true, isAvailable: true, preparationTime: 10, vendor: canteen._id },
      { itemName: 'Chicken Burger', category: 'snacks', price: 80, description: 'Grilled chicken burger', isVeg: false, isAvailable: true, preparationTime: 15, vendor: canteen._id },
      { itemName: 'Veg Thali', category: 'lunch', price: 120, description: 'Complete veg meal', isVeg: true, isAvailable: true, preparationTime: 20, vendor: canteen._id },
      { itemName: 'Chicken Biryani', category: 'lunch', price: 150, description: 'Aromatic biryani', isVeg: false, isAvailable: true, preparationTime: 25, vendor: canteen._id },
      { itemName: 'Masala Dosa', category: 'breakfast', price: 60, description: 'Crispy dosa', isVeg: true, isAvailable: true, preparationTime: 15, vendor: canteen._id },
      { itemName: 'Coffee', category: 'beverages', price: 30, description: 'Hot coffee', isVeg: true, isAvailable: true, preparationTime: 5, vendor: canteen._id },
      { itemName: 'Tea', category: 'beverages', price: 20, description: 'Fresh chai', isVeg: true, isAvailable: true, preparationTime: 5, vendor: canteen._id },
      { itemName: 'Samosa', category: 'snacks', price: 25, description: 'Crispy samosa', isVeg: true, isAvailable: true, preparationTime: 5, vendor: canteen._id },
      { itemName: 'Sandwich', category: 'snacks', price: 40, description: 'Grilled sandwich', isVeg: true, isAvailable: true, preparationTime: 10, vendor: canteen._id },
      { itemName: 'Ice Cream', category: 'desserts', price: 35, description: 'Vanilla ice cream', isVeg: true, isAvailable: true, preparationTime: 2, vendor: canteen._id },
      { itemName: 'Pasta', category: 'lunch', price: 90, description: 'White sauce pasta', isVeg: true, isAvailable: true, preparationTime: 20, vendor: canteen._id },
      { itemName: 'Pizza Slice', category: 'snacks', price: 70, description: 'Cheese pizza', isVeg: true, isAvailable: true, preparationTime: 15, vendor: canteen._id },
      { itemName: 'Cold Drink', category: 'beverages', price: 30, description: 'Chilled drink', isVeg: true, isAvailable: true, preparationTime: 2, vendor: canteen._id },
      { itemName: 'Juice', category: 'beverages', price: 50, description: 'Fresh juice', isVeg: true, isAvailable: true, preparationTime: 5, vendor: canteen._id },
      { itemName: 'Idli Sambar', category: 'breakfast', price: 40, description: 'Soft idlis', isVeg: true, isAvailable: true, preparationTime: 10, vendor: canteen._id }
    ];

    for (const item of menuItems) {
      const menuItem = new CanteenMenu(item);
      await menuItem.save();
    }
    console.log('✅ 15 menu items created');

    const events = [
      { title: 'Tech Fest 2025', description: 'Technical festival', eventType: 'technical', eventDate: new Date('2025-11-15'), startTime: '09:00', endTime: '17:00', venue: 'Main Auditorium', organizer: admin._id, category: 'technical', maxParticipants: 500, registeredParticipants: [students[0]._id], isApproved: true },
      { title: 'Cultural Night', description: 'Cultural performances', eventType: 'cultural', eventDate: new Date('2025-11-20'), startTime: '18:00', endTime: '21:00', venue: 'Open Theatre', organizer: admin._id, category: 'cultural', maxParticipants: 300, registeredParticipants: [], isApproved: true },
      { title: 'Sports Day', description: 'Sports competition', eventType: 'sports', eventDate: new Date('2025-12-05'), startTime: '08:00', endTime: '16:00', venue: 'Sports Ground', organizer: admin._id, category: 'sports', maxParticipants: 200, registeredParticipants: [], isApproved: true }
    ];

    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
    }
    console.log('✅ 3 events created');

    const assignments = [
      { course: courses[0]._id, faculty: faculty[0]._id, title: 'Python Programming', description: 'Basic data structures', dueDate: new Date('2025-11-10'), totalMarks: 100, submissions: [] },
      { course: courses[2]._id, faculty: faculty[0]._id, title: 'Binary Search Tree', description: 'Implement BST', dueDate: new Date('2025-11-15'), totalMarks: 100, submissions: [] },
      { course: courses[4]._id, faculty: faculty[2]._id, title: 'Responsive Website', description: 'Build portfolio', dueDate: new Date('2025-11-20'), totalMarks: 100, submissions: [] }
    ];

    for (const assignmentData of assignments) {
      const assignment = new Assignment(assignmentData);
      await assignment.save();
    }
    console.log('✅ 3 assignments created');

    // ============ CREATE TIMETABLES FOR ALL SEMESTERS ============
    const timetables = [];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rooms = ['101', '102', '103', '201', '202', '203', '301', '302'];

    // Create timetable for Semester 1 CS Section A
    const sem1CSCourses = [courses[0], courses[12]]; // CS101, MATH101
    let slotIndex = 0;
    for (const day of days.slice(0, 5)) {
      for (const course of sem1CSCourses) {
        const slot = timeSlots[slotIndex % timeSlots.length];
        timetables.push({
          course: course._id,
          faculty: course.faculty,
          day: day,
          startTime: slot.start,
          endTime: slot.end,
          room: rooms[slotIndex % rooms.length],
          semester: 1,
          section: 'A',
          department: 'Computer Science'
        });
        slotIndex++;
      }
    }

    // Create timetable for Semester 3 CS Section A
    const sem3CSCourses = [courses[2]]; // CS201
    slotIndex = 0;
    for (const day of days.slice(0, 5)) {
      const course = sem3CSCourses[0];
      const slot = timeSlots[slotIndex % timeSlots.length];
      timetables.push({
        course: course._id,
        faculty: course.faculty,
        day: day,
        startTime: slot.start,
        endTime: slot.end,
        room: rooms[slotIndex % rooms.length],
        semester: 3,
        section: 'A',
        department: 'Computer Science'
      });
      slotIndex++;
    }

    // Create timetable for Semester 1 EC Section A
    const sem1ECCourses = [courses[8], courses[12]]; // EC101, MATH101
    slotIndex = 0;
    for (const day of days.slice(0, 5)) {
      for (const course of sem1ECCourses) {
        const slot = timeSlots[slotIndex % timeSlots.length];
        timetables.push({
          course: course._id,
          faculty: course.faculty,
          day: day,
          startTime: slot.start,
          endTime: slot.end,
          room: rooms[slotIndex % rooms.length],
          semester: 1,
          section: 'A',
          department: 'Electronics'
        });
        slotIndex++;
      }
    }

    for (const timetableData of timetables) {
      const timetable = new Timetable(timetableData);
      await timetable.save();
    }
    console.log(`✅ ${timetables.length} timetable entries created`);

    console.log('\n========================================');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('========================================\n');
    console.log('📊 Data Created:');
    console.log('   • 60 Students');
    console.log('   • 6 Faculty Members');
    console.log('   • 15 Courses');
    console.log('   • 25 Timetable Entries');
    console.log('   • 3 Events');
    console.log('   • 15 Canteen Menu Items');
    console.log('\n🔐 LOGIN CREDENTIALS (All passwords: password123)');
    console.log('========================================');
    console.log('\n👨‍🎓 STUDENTS:');
    console.log('   student1@campus.com  to  student60@campus.com');
    console.log('\n👨‍🏫 FACULTY:');
    console.log('   faculty1@campus.com  to  faculty6@campus.com');
    console.log('\n👤 OTHER USERS:');
    console.log('   admin@campus.com     (Admin)');
    console.log('   security@campus.com  (Security)');
    console.log('   canteen@campus.com   (Canteen Manager)');
    console.log('\n🔑 Password for ALL users: password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();
