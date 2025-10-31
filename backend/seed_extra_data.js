const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');
const LostFound = require('./models/LostFound');
const GatePass = require('./models/GatePass');
const Complaint = require('./models/Complaint');
const Event = require('./models/Event');

const seedExtraData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Get some students and admin
    const students = await Student.find().limit(30);
    const admin = await User.findOne({ email: 'admin@campus.com' });
    
    if (students.length === 0) {
      console.log('❌ No students found. Please run seed_new.js first!');
      process.exit(1);
    }

    console.log('\n🔍 Creating Lost & Found items...');
    await LostFound.deleteMany({});
    
    const lostFoundItems = [
      { type: 'lost', itemName: 'Black Backpack', category: 'accessories', location: 'Library 2nd Floor' },
      { type: 'found', itemName: 'Blue Water Bottle', category: 'other', location: 'Canteen' },
      { type: 'lost', itemName: 'iPhone 13 Pro', category: 'electronics', location: 'Sports Ground' },
      { type: 'found', itemName: 'Silver Wristwatch', category: 'accessories', location: 'Auditorium' },
      { type: 'lost', itemName: 'Red Notebook', category: 'books', location: 'Classroom 301' },
      { type: 'found', itemName: 'Wireless Earbuds', category: 'electronics', location: 'Parking Area' },
      { type: 'lost', itemName: 'Student ID Card', category: 'documents', location: 'Main Gate' },
      { type: 'found', itemName: 'Brown Wallet', category: 'accessories', location: 'Computer Lab' },
      { type: 'lost', itemName: 'Calculator (Casio)', category: 'electronics', location: 'Exam Hall' },
      { type: 'found', itemName: 'Umbrella (Black)', category: 'other', location: 'Bus Stop' },
      { type: 'lost', itemName: 'Laptop Charger', category: 'electronics', location: 'Library Study Room' },
      { type: 'found', itemName: 'Spectacles Case', category: 'accessories', location: 'Cafeteria' },
      { type: 'lost', itemName: 'Green Hoodie', category: 'clothing', location: 'Gym' },
      { type: 'found', itemName: 'USB Drive (32GB)', category: 'electronics', location: 'Lab 405' },
      { type: 'lost', itemName: 'Textbook: DSA', category: 'books', location: 'Corridor Block C' }
    ];

    for (let i = 0; i < lostFoundItems.length; i++) {
      const item = lostFoundItems[i];
      await LostFound.create({
        reportedBy: students[i % students.length]._id,
        type: item.type,
        itemName: item.itemName,
        description: `${item.type === 'lost' ? 'Lost' : 'Found'} ${item.itemName} at ${item.location}. Please contact if you have any information.`,
        category: item.category,
        location: item.location,
        date: new Date(Date.now() - (i * 86400000 * 2)),
        status: ['active', 'claimed', 'returned'][i % 3]
      });
    }
    console.log(`✅ Created ${lostFoundItems.length} lost & found items`);

    console.log('\n🎫 Creating Gate Passes...');
    await GatePass.deleteMany({});
    
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

    for (let i = 0; i < 15; i++) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() + (i % 7));
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + (i % 3));
      
      await GatePass.create({
        student: students[i * 2 % students.length]._id,
        reason: reasons[i],
        destination: ['City Hospital', 'Home Town', 'Tech Park', 'Main Bank', 'Railway Station', 'Shopping Mall', 'Government Office'][i % 7],
        fromDate: fromDate,
        toDate: toDate,
        status: ['pending', 'approved', 'rejected'][i % 3],
        approvedBy: i % 3 === 1 ? admin._id : undefined,
        approvalDate: i % 3 === 1 ? new Date() : undefined,
        remarks: i % 3 === 2 ? 'Insufficient reason provided' : (i % 3 === 1 ? 'Approved' : undefined)
      });
    }
    console.log(`✅ Created 15 gate passes`);

    console.log('\n📢 Creating Additional Complaints...');
    
    const complaintData = [
      { category: 'hostel', subject: 'Room cleaning not done', description: 'My room has not been cleaned for 3 days' },
      { category: 'canteen', subject: 'Food quality issues', description: 'Food served today was not fresh' },
      { category: 'classroom', subject: 'AC not working', description: 'The AC in Room 301 is not working' },
      { category: 'library', subject: 'Insufficient books', description: 'Need more copies of DSA textbooks' },
      { category: 'sports', subject: 'Ground maintenance needed', description: 'The football ground needs maintenance' },
      { category: 'transport', subject: 'Bus delay', description: 'Bus is consistently late by 30 minutes' },
      { category: 'hostel', subject: 'Water supply problem', description: 'No water in hostel block A since morning' },
      { category: 'classroom', subject: 'Projector malfunction', description: 'Projector in room 205 not working' },
      { category: 'canteen', subject: 'Hygiene concerns', description: 'Tables are not being cleaned properly' },
      { category: 'library', subject: 'Timing extension request', description: 'Please extend library hours during exams' },
      { category: 'classroom', subject: 'Damaged furniture', description: 'Broken chairs in classroom 402' },
      { category: 'other', subject: 'Insufficient parking', description: 'Need more parking space for two-wheelers' },
      { category: 'other', subject: 'Noise pollution', description: 'Construction noise near study area' },
      { category: 'other', subject: 'Waste disposal', description: 'Dustbins overflowing near hostel' },
      { category: 'transport', subject: 'Bus schedule issue', description: 'Need additional bus for evening route' }
    ];

    for (let i = 0; i < complaintData.length; i++) {
      const data = complaintData[i];
      await Complaint.create({
        complainant: students[i * 2 % students.length].userId,
        category: data.category,
        subject: data.subject,
        description: data.description,
        priority: ['low', 'medium', 'high', 'urgent'][i % 4],
        status: ['open', 'in-progress', 'resolved'][i % 3],
        assignedTo: i % 3 === 1 ? admin._id : undefined
      });
    }
    console.log(`✅ Created ${complaintData.length} complaints`);

    console.log('\n📊 Summary:');
    console.log(`   • Lost & Found Items: 15`);
    console.log(`   • Gate Passes: 15`);
    console.log(`   • Complaints: 15`);
    console.log('\n✨ Extra data seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedExtraData();
