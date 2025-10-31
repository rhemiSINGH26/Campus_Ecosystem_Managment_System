const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Hostel = require('./models/Hostel');
const CanteenMenu = require('./models/CanteenMenu');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Hostel.deleteMany({});
    await CanteenMenu.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = new User({
      email: 'admin@campus.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      phone: '1234567890'
    });
    await admin.save();
    console.log('✅ Admin created');

    // Create Security User
    const security = new User({
      email: 'security@campus.com',
      password: 'security123',
      role: 'security',
      name: 'Security Guard',
      phone: '1234567891'
    });
    await security.save();
    console.log('✅ Security user created');

    // Create Canteen User
    const canteen = new User({
      email: 'canteen@campus.com',
      password: 'canteen123',
      role: 'canteen',
      name: 'Canteen Vendor',
      phone: '1234567892'
    });
    await canteen.save();
    console.log('✅ Canteen user created');

    // Create Faculty Users
    const faculty1User = new User({
      email: 'john.doe@campus.com',
      password: 'faculty123',
      role: 'faculty',
      name: 'Dr. John Doe',
      phone: '1234567893'
    });
    await faculty1User.save();

    const faculty1 = new Faculty({
      userId: faculty1User._id,
      facultyId: 'FAC001',
      department: 'Computer Science',
      designation: 'Professor',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence'
    });
    await faculty1.save();

    const faculty2User = new User({
      email: 'jane.smith@campus.com',
      password: 'faculty123',
      role: 'faculty',
      name: 'Dr. Jane Smith',
      phone: '1234567894'
    });
    await faculty2User.save();

    const faculty2 = new Faculty({
      userId: faculty2User._id,
      facultyId: 'FAC002',
      department: 'Electronics',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Electronics',
      specialization: 'VLSI Design'
    });
    await faculty2.save();
    console.log('✅ Faculty users created');

    // Create more Faculty Users
    const faculty3User = new User({
      email: 'maria.garcia@campus.com',
      password: 'faculty123',
      role: 'faculty',
      name: 'Dr. Maria Garcia',
      phone: '1234567898'
    });
    await faculty3User.save();

    const faculty3 = new Faculty({
      userId: faculty3User._id,
      facultyId: 'FAC003',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Software Engineering',
      specialization: 'Web Development'
    });
    await faculty3.save();

    const faculty4User = new User({
      email: 'robert.lee@campus.com',
      password: 'faculty123',
      role: 'faculty',
      name: 'Dr. Robert Lee',
      phone: '1234567899'
    });
    await faculty4User.save();

    const faculty4 = new Faculty({
      userId: faculty4User._id,
      facultyId: 'FAC004',
      department: 'Mathematics',
      designation: 'Professor',
      qualification: 'Ph.D. in Mathematics',
      specialization: 'Applied Mathematics'
    });
    await faculty4.save();
    console.log('✅ All faculty users created');

    // Create Comprehensive Courses with Subject Codes
    const courses = [
      {
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        department: 'Computer Science',
        credits: 4,
        semester: 1,
        faculty: faculty1._id,
        isActive: true
      },
      {
        courseCode: 'CS102',
        courseName: 'Object Oriented Programming',
        department: 'Computer Science',
        credits: 4,
        semester: 2,
        faculty: faculty1._id,
        isActive: true
      },
      {
        courseCode: 'CS201',
        courseName: 'Data Structures and Algorithms',
        department: 'Computer Science',
        credits: 4,
        semester: 3,
        faculty: faculty1._id,
        isActive: true
      },
      {
        courseCode: 'CS202',
        courseName: 'Database Management Systems',
        department: 'Computer Science',
        credits: 3,
        semester: 4,
        faculty: faculty3._id,
        isActive: true
      },
      {
        courseCode: 'CS301',
        courseName: 'Web Development',
        department: 'Computer Science',
        credits: 3,
        semester: 5,
        faculty: faculty3._id,
        isActive: true
      },
      {
        courseCode: 'CS302',
        courseName: 'Artificial Intelligence',
        department: 'Computer Science',
        credits: 4,
        semester: 6,
        faculty: faculty1._id,
        isActive: true
      },
      {
        courseCode: 'EC101',
        courseName: 'Basic Electronics',
        department: 'Electronics',
        credits: 3,
        semester: 1,
        faculty: faculty2._id,
        isActive: true
      },
      {
        courseCode: 'EC201',
        courseName: 'Digital Electronics',
        department: 'Electronics',
        credits: 4,
        semester: 3,
        faculty: faculty2._id,
        isActive: true
      },
      {
        courseCode: 'MATH101',
        courseName: 'Engineering Mathematics I',
        department: 'Mathematics',
        credits: 4,
        semester: 1,
        faculty: faculty4._id,
        isActive: true
      },
      {
        courseCode: 'MATH201',
        courseName: 'Engineering Mathematics II',
        department: 'Mathematics',
        credits: 4,
        semester: 2,
        faculty: faculty4._id,
        isActive: true
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    const [course1, course2, course3, course4, course5, course6, course7, course8, course9, course10] = createdCourses;
    console.log('✅ All courses created');

    // Create Multiple Student Users for Attendance
    const studentData = [
      {
        email: 'alice@student.com',
        name: 'Alice Johnson',
        phone: '1234567895',
        studentId: 'STU001',
        department: 'Computer Science',
        year: 2,
        semester: 3,
        section: 'A',
        courses: [course3, course9],
        parent: { name: 'Robert Johnson', phone: '9876543210', email: 'robert@email.com' }
      },
      {
        email: 'bob@student.com',
        name: 'Bob Williams',
        phone: '1234567896',
        studentId: 'STU002',
        department: 'Computer Science',
        year: 1,
        semester: 1,
        section: 'A',
        courses: [course1, course9],
        parent: { name: 'Sarah Williams', phone: '9876543211', email: 'sarah@email.com' }
      },
      {
        email: 'charlie@student.com',
        name: 'Charlie Brown',
        phone: '1234567897',
        studentId: 'STU003',
        department: 'Electronics',
        year: 1,
        semester: 1,
        section: 'B',
        courses: [course7, course9],
        parent: { name: 'David Brown', phone: '9876543212', email: 'david@email.com' }
      },
      {
        email: 'diana@student.com',
        name: 'Diana Prince',
        phone: '1234567900',
        studentId: 'STU004',
        department: 'Computer Science',
        year: 1,
        semester: 1,
        section: 'A',
        courses: [course1, course9],
        parent: { name: 'Steve Prince', phone: '9876543213', email: 'steve@email.com' }
      },
      {
        email: 'ethan@student.com',
        name: 'Ethan Hunt',
        phone: '1234567901',
        studentId: 'STU005',
        department: 'Computer Science',
        year: 2,
        semester: 3,
        section: 'A',
        courses: [course3, course9],
        parent: { name: 'Jim Hunt', phone: '9876543214', email: 'jim@email.com' }
      },
      {
        email: 'fiona@student.com',
        name: 'Fiona Carter',
        phone: '1234567902',
        studentId: 'STU006',
        department: 'Computer Science',
        year: 1,
        semester: 2,
        section: 'B',
        courses: [course2, course10],
        parent: { name: 'Michael Carter', phone: '9876543215', email: 'michael@email.com' }
      },
      {
        email: 'george@student.com',
        name: 'George Miller',
        phone: '1234567903',
        studentId: 'STU007',
        department: 'Electronics',
        year: 2,
        semester: 3,
        section: 'A',
        courses: [course8, course9],
        parent: { name: 'Lisa Miller', phone: '9876543216', email: 'lisa@email.com' }
      },
      {
        email: 'hannah@student.com',
        name: 'Hannah Davis',
        phone: '1234567904',
        studentId: 'STU008',
        department: 'Computer Science',
        year: 3,
        semester: 5,
        section: 'A',
        courses: [course5, course9],
        parent: { name: 'Tom Davis', phone: '9876543217', email: 'tom@email.com' }
      },
      {
        email: 'isaac@student.com',
        name: 'Isaac Newton',
        phone: '1234567905',
        studentId: 'STU009',
        department: 'Computer Science',
        year: 1,
        semester: 1,
        section: 'A',
        courses: [course1, course9],
        parent: { name: 'Anne Newton', phone: '9876543218', email: 'anne@email.com' }
      },
      {
        email: 'julia@student.com',
        name: 'Julia Roberts',
        phone: '1234567906',
        studentId: 'STU010',
        department: 'Computer Science',
        year: 2,
        semester: 4,
        section: 'B',
        courses: [course4, course10],
        parent: { name: 'Richard Roberts', phone: '9876543219', email: 'richard@email.com' }
      }
    ];

    const students = [];
    for (const data of studentData) {
      const userDoc = new User({
        email: data.email,
        password: 'student123',
        role: 'student',
        name: data.name,
        phone: data.phone
      });
      await userDoc.save();

      const studentDoc = new Student({
        userId: userDoc._id,
        studentId: data.studentId,
        department: data.department,
        year: data.year,
        semester: data.semester,
        section: data.section,
        enrolledCourses: data.courses.map(c => c._id),
        parentContact: data.parent
      });
      await studentDoc.save();
      students.push(studentDoc);

      // Add student to courses
      for (const course of data.courses) {
        course.enrolledStudents.push(studentDoc._id);
        await course.save();
      }
    }
    console.log('✅ All student users created');

    // Update faculty with assigned courses
    faculty1.assignedCourses.push(course1._id, course2._id, course3._id, course6._id);
    await faculty1.save();

    faculty2.assignedCourses.push(course7._id, course8._id);
    await faculty2.save();

    faculty3.assignedCourses.push(course4._id, course5._id);
    await faculty3.save();

    faculty4.assignedCourses.push(course9._id, course10._id);
    await faculty4.save();

    // Create Hostels
    const boysHostel = new Hostel({
      hostelName: 'Sunrise Boys Hostel',
      hostelType: 'boys',
      warden: {
        name: 'Mr. Kumar',
        phone: '9876543213',
        email: 'kumar@campus.com'
      },
      totalRooms: 50,
      occupiedRooms: 5,
      facilities: ['WiFi', 'Gym', 'Canteen', 'Study Room', 'Sports Ground'],
      rooms: [
        { roomNumber: '101', floor: 1, capacity: 2, occupants: [students[1]._id, students[8]._id] },
        { roomNumber: '102', floor: 1, capacity: 2, occupants: [students[2]._id, students[6]._id] },
        { roomNumber: '103', floor: 1, capacity: 2, occupants: [students[4]._id] },
        { roomNumber: '201', floor: 2, capacity: 3, occupants: [] },
        { roomNumber: '202', floor: 2, capacity: 3, occupants: [] }
      ]
    });
    await boysHostel.save();

    const girlsHostel = new Hostel({
      hostelName: 'Sunrise Girls Hostel',
      hostelType: 'girls',
      warden: {
        name: 'Ms. Sharma',
        phone: '9876543214',
        email: 'sharma@campus.com'
      },
      totalRooms: 40,
      occupiedRooms: 3,
      facilities: ['WiFi', 'Gym', 'Canteen', 'Study Room', 'Library'],
      rooms: [
        { roomNumber: '101', floor: 1, capacity: 2, occupants: [students[0]._id, students[3]._id] },
        { roomNumber: '102', floor: 1, capacity: 2, occupants: [students[5]._id, students[7]._id] },
        { roomNumber: '103', floor: 1, capacity: 2, occupants: [students[9]._id] },
        { roomNumber: '201', floor: 2, capacity: 3, occupants: [] }
      ]
    });
    await girlsHostel.save();
    console.log('✅ Hostels created');

    // Update students with hostel info
    const hostelAssignments = [
      { student: students[0], hostel: girlsHostel, room: '101' },
      { student: students[1], hostel: boysHostel, room: '101' },
      { student: students[2], hostel: boysHostel, room: '102' },
      { student: students[3], hostel: girlsHostel, room: '101' },
      { student: students[4], hostel: boysHostel, room: '103' },
      { student: students[5], hostel: girlsHostel, room: '102' },
      { student: students[6], hostel: boysHostel, room: '102' },
      { student: students[7], hostel: girlsHostel, room: '102' },
      { student: students[8], hostel: boysHostel, room: '101' },
      { student: students[9], hostel: girlsHostel, room: '103' }
    ];

    for (const assignment of hostelAssignments) {
      assignment.student.hostelId = assignment.hostel._id;
      assignment.student.roomNumber = assignment.room;
      await assignment.student.save();
    }

    // Create Canteen Menu
    const menuItems = [
      {
        vendor: canteen._id,
        itemName: 'Veg Burger',
        category: 'snacks',
        price: 50,
        description: 'Delicious vegetarian burger with cheese',
        isVeg: true,
        isAvailable: true,
        preparationTime: 10
      },
      {
        vendor: canteen._id,
        itemName: 'Chicken Burger',
        category: 'snacks',
        price: 80,
        description: 'Grilled chicken burger with special sauce',
        isVeg: false,
        isAvailable: true,
        preparationTime: 15
      },
      {
        vendor: canteen._id,
        itemName: 'Veg Thali',
        category: 'lunch',
        price: 120,
        description: 'Complete vegetarian meal',
        isVeg: true,
        isAvailable: true,
        preparationTime: 20
      },
      {
        vendor: canteen._id,
        itemName: 'Chicken Biryani',
        category: 'lunch',
        price: 150,
        description: 'Aromatic chicken biryani',
        isVeg: false,
        isAvailable: true,
        preparationTime: 25
      },
      {
        vendor: canteen._id,
        itemName: 'Masala Dosa',
        category: 'breakfast',
        price: 60,
        description: 'Crispy dosa with potato filling',
        isVeg: true,
        isAvailable: true,
        preparationTime: 15
      },
      {
        vendor: canteen._id,
        itemName: 'Coffee',
        category: 'beverages',
        price: 30,
        description: 'Hot filter coffee',
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        vendor: canteen._id,
        itemName: 'Tea',
        category: 'beverages',
        price: 20,
        description: 'Fresh chai',
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        vendor: canteen._id,
        itemName: 'Samosa',
        category: 'snacks',
        price: 25,
        description: 'Crispy samosa with chutney',
        isVeg: true,
        isAvailable: true,
        preparationTime: 5
      },
      {
        vendor: canteen._id,
        itemName: 'Sandwich',
        category: 'snacks',
        price: 40,
        description: 'Veg grilled sandwich',
        isVeg: true,
        isAvailable: true,
        preparationTime: 10
      },
      {
        vendor: canteen._id,
        itemName: 'Ice Cream',
        category: 'desserts',
        price: 35,
        description: 'Vanilla ice cream',
        isVeg: true,
        isAvailable: true,
        preparationTime: 2
      }
    ];

    await CanteenMenu.insertMany(menuItems);
    console.log('✅ Canteen menu created');

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================\n');
    console.log('Test Accounts Created:');
    console.log('----------------------');
    console.log('Admin:');
    console.log('  Email: admin@campus.com');
    console.log('  Password: admin123\n');
    console.log('Security:');
    console.log('  Email: security@campus.com');
    console.log('  Password: security123\n');
    console.log('Canteen:');
    console.log('  Email: canteen@campus.com');
    console.log('  Password: canteen123\n');
    console.log('Faculty:');
    console.log('  Email: john.doe@campus.com');
    console.log('  Password: faculty123');
    console.log('  Email: jane.smith@campus.com');
    console.log('  Password: faculty123');
    console.log('  Email: maria.garcia@campus.com');
    console.log('  Password: faculty123');
    console.log('  Email: robert.lee@campus.com');
    console.log('  Password: faculty123\n');
    console.log('Students (10 total):');
    console.log('  Email: alice@student.com / bob@student.com');
    console.log('  Email: charlie@student.com / diana@student.com');
    console.log('  Email: ethan@student.com / fiona@student.com');
    console.log('  Email: george@student.com / hannah@student.com');
    console.log('  Email: isaac@student.com / julia@student.com');
    console.log('  Password (all): student123\n');
    console.log('Courses Created:');
    console.log('  10 Courses across CS, EC, and MATH departments');
    console.log('  With proper course codes and faculty assignments\n');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
