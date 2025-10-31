const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');
const LostFound = require('./models/LostFound');
const EntryLog = require('./models/EntryLog');
const Complaint = require('./models/Complaint');
const Event = require('./models/Event');
const GatePass = require('./models/GatePass');

const seedAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected\n');

    // Get users
    const students = await Student.find().limit(40);
    const users = await User.find({ role: 'student' }).limit(40);
    const admin = await User.findOne({ email: 'admin@campus.com' });
    const security = await User.findOne({ email: 'security@campus.com' });
    
    if (students.length === 0 || users.length === 0) {
      console.log('❌ No users found. Please run seed_new.js first!');
      process.exit(1);
    }

    console.log('🔍 Creating Lost & Found items...');
    await LostFound.deleteMany({});
    
    const lostFoundData = [
      // Electronics
      { type: 'lost', itemName: 'iPhone 14 Pro (Black)', category: 'electronics', location: 'Main Library 3rd Floor', description: 'Black iPhone 14 Pro with blue case. Last seen near study desk 15.' },
      { type: 'found', itemName: 'Samsung Galaxy Buds', category: 'electronics', location: 'Canteen Area', description: 'White Samsung Galaxy Buds found on table near vending machine.' },
      { type: 'lost', itemName: 'HP Laptop Charger', category: 'electronics', location: 'Computer Lab B-302', description: '65W HP laptop charger with black cable.' },
      { type: 'found', itemName: 'Apple Watch Series 8', category: 'electronics', location: 'Sports Ground', description: 'Black Apple Watch found near the basketball court.' },
      { type: 'lost', itemName: 'Lenovo ThinkPad', category: 'electronics', location: 'Seminar Hall', description: 'Lenovo ThinkPad with college stickers. Contains important project files.' },
      { type: 'found', itemName: 'JBL Bluetooth Speaker', category: 'electronics', location: 'Hostel Common Room', description: 'Red JBL Flip 5 speaker.' },
      { type: 'lost', itemName: 'Power Bank 20000mAh', category: 'electronics', location: 'Bus Stop', description: 'Black Anker power bank with two charging cables.' },
      { type: 'found', itemName: 'Casio Scientific Calculator', category: 'electronics', location: 'Exam Hall A', description: 'Casio fx-991EX calculator in blue cover.' },
      
      // Documents
      { type: 'lost', itemName: 'Student ID Card', category: 'documents', location: 'Main Gate', description: 'Student ID card of Rahul Sharma, Roll No: STU2024045.' },
      { type: 'found', itemName: 'Aadhar Card', category: 'documents', location: 'Photocopy Shop', description: 'Found Aadhar card. Available with security office.' },
      { type: 'lost', itemName: 'Library Card', category: 'documents', location: 'Library Ground Floor', description: 'Lost library card with barcode damaged.' },
      { type: 'found', itemName: 'Driving License', category: 'documents', location: 'Parking Lot', description: 'Driving license found near bike parking.' },
      
      // Books & Stationery
      { type: 'lost', itemName: 'Data Structures Textbook', category: 'books', location: 'Classroom C-401', description: 'Data Structures by Tanenbaum with handwritten notes.' },
      { type: 'found', itemName: 'Notebook (Blue)', category: 'books', location: 'Library Reading Room', description: 'Blue spiral notebook with Physics notes.' },
      { type: 'lost', itemName: 'Pen Drive 64GB', category: 'electronics', location: 'Lab D-105', description: 'SanDisk 64GB pen drive with project files.' },
      { type: 'found', itemName: 'Set of Pens (Parker)', category: 'other', location: 'Faculty Room', description: 'Parker pen set in leather case.' },
      
      // Accessories
      { type: 'lost', itemName: 'Ray-Ban Sunglasses', category: 'accessories', location: 'Cafeteria', description: 'Black Ray-Ban wayfarer sunglasses.' },
      { type: 'found', itemName: 'Titan Watch', category: 'accessories', location: 'Gym', description: 'Silver Titan analog watch with leather strap.' },
      { type: 'lost', itemName: 'Gold Chain', category: 'accessories', location: 'Hostel Bathroom', description: 'Gold chain pendant lost in hostel H1 bathroom.' },
      { type: 'found', itemName: 'Backpack (Nike)', category: 'accessories', location: 'Bus Stand', description: 'Black Nike backpack with books inside.' },
      
      // Clothing
      { type: 'lost', itemName: 'Blue Hoodie', category: 'clothing', location: 'Sports Complex', description: 'Dark blue Adidas hoodie, size L.' },
      { type: 'found', itemName: 'Red Umbrella', category: 'other', location: 'Main Building Entrance', description: 'Large red umbrella with wooden handle.' },
      { type: 'lost', itemName: 'College Jacket', category: 'clothing', location: 'Auditorium', description: 'College sports team jacket with name tag.' },
      { type: 'found', itemName: 'Water Bottle (Milton)', category: 'other', location: 'Lecture Hall B-201', description: 'Blue Milton water bottle 1L capacity.' },
      
      // More items
      { type: 'lost', itemName: 'Wallet (Brown Leather)', category: 'accessories', location: 'Library Cafe', description: 'Brown leather wallet with cards inside. No cash.' },
      { type: 'found', itemName: 'Keys (Hostel Room)', category: 'other', location: 'Corridor Block C', description: 'Set of 3 keys with red keychain.' },
      { type: 'lost', itemName: 'Spectacles Case', category: 'accessories', location: 'Chemistry Lab', description: 'Hard spectacles case with prescription glasses.' },
      { type: 'found', itemName: 'Lunch Box', category: 'other', location: 'Canteen Table 12', description: 'Steel lunch box with name sticker.' },
      { type: 'lost', itemName: 'Headphones (Sony)', category: 'electronics', location: 'Music Room', description: 'Sony WH-1000XM4 noise cancelling headphones.' },
      { type: 'found', itemName: 'College Diary 2024', category: 'books', location: 'Admin Office', description: 'College issued diary with schedules and notes.' }
    ];

    for (let i = 0; i < lostFoundData.length; i++) {
      const item = lostFoundData[i];
      const dateOffset = Math.floor(Math.random() * 30); // Random date within last 30 days
      await LostFound.create({
        reportedBy: users[i % users.length]._id,
        type: item.type,
        itemName: item.itemName,
        description: item.description,
        category: item.category,
        location: item.location,
        date: new Date(Date.now() - (dateOffset * 86400000)),
        status: ['active', 'claimed', 'returned'][i % 3],
        claimedBy: i % 3 === 1 ? users[(i + 5) % users.length]._id : null,
        images: i % 4 === 0 ? [`/uploads/lostfound_${i}.jpg`] : []
      });
    }
    console.log(`✅ Created ${lostFoundData.length} lost & found items\n`);

    // Entry/Exit Logs
    console.log('📋 Creating Entry/Exit Logs...');
    await EntryLog.deleteMany({});
    
    const entryTypes = ['entry', 'exit'];
    const purposes = ['Class', 'Library', 'Sports', 'Canteen', 'Medical', 'Personal Work', 'Shopping', 'Home Visit', 'Bank', 'Meeting'];
    const gates = ['Main Gate', 'North Gate', 'South Gate', 'East Gate'];
    
    for (let i = 0; i < 50; i++) {
      const hoursAgo = Math.floor(Math.random() * 72); // Last 3 days
      const logDate = new Date(Date.now() - (hoursAgo * 3600000));
      const type = entryTypes[i % 2];
      
      await EntryLog.create({
        user: students[i % students.length].userId,
        type: type,
        gate: gates[i % gates.length],
        qrCode: `QR${Date.now()}-${i}`,
        timestamp: logDate,
        purpose: purposes[i % purposes.length],
        verifiedBy: security._id,
        vehicleNumber: i % 3 === 0 ? `MH12AB${1000 + i}` : null
      });
    }
    console.log(`✅ Created 50 entry/exit logs\n`);

    // More Events
    console.log('🎉 Creating more events...');
    
    const moreEvents = [
      { title: 'Data Science Workshop', eventType: 'workshop', venue: 'AI Lab', description: 'Hands-on workshop on Data Science and Machine Learning fundamentals' },
      { title: 'Annual Day Celebration', eventType: 'cultural', venue: 'Main Auditorium', description: 'Celebrate the college annual day with performances and award ceremony' },
      { title: 'Basketball Tournament', eventType: 'sports', venue: 'Sports Complex', description: 'Inter-department basketball tournament championship' },
      { title: 'Industry Expert Talk', eventType: 'seminar', venue: 'Seminar Hall 1', description: 'Industry experts sharing insights on career opportunities' },
      { title: 'Coding Bootcamp', eventType: 'technical', venue: 'Computer Lab Complex', description: '3-day intensive coding bootcamp for competitive programming' },
      { title: 'Yoga & Meditation Session', eventType: 'sports', venue: 'Wellness Center', description: 'Morning yoga and meditation for stress relief' },
      { title: 'Science Exhibition', eventType: 'technical', venue: 'Exhibition Hall', description: 'Showcase of innovative science projects by students' },
      { title: 'Dance Competition', eventType: 'cultural', venue: 'Open Air Theatre', description: 'Solo and group dance competition with exciting prizes' },
      { title: 'Placement Drive - TCS', eventType: 'seminar', venue: 'Placement Cell', description: 'Campus recruitment drive by Tata Consultancy Services' },
      { title: 'Photography Contest', eventType: 'other', venue: 'Campus Wide', description: 'Capture the essence of campus life through your lens' }
    ];

    for (let i = 0; i < moreEvents.length; i++) {
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + (i * 4) + 2);
      
      await Event.create({
        ...moreEvents[i],
        eventDate: eventDate,
        startTime: `${9 + (i % 6)}:00`,
        endTime: `${13 + (i % 6)}:00`,
        organizer: i % 2 === 0 ? admin._id : users[i % users.length]._id,
        maxParticipants: 50 + (i * 30),
        status: ['pending', 'approved', 'completed'][i % 3],
        approvedBy: i % 3 !== 0 ? admin._id : null,
        registeredParticipants: students.slice(0, 5 + (i % 15)).map(s => ({
          user: s.userId,
          registeredAt: new Date(Date.now() - (i * 86400000)),
          hasAttended: i % 3 === 2
        })),
        poster: `/images/event_poster_${i}.jpg`
      });
    }
    console.log(`✅ Created ${moreEvents.length} additional events\n`);

    // More Complaints
    console.log('📢 Creating more complaints...');
    
    const moreComplaints = [
      { category: 'hostel', subject: 'Leaking Ceiling in Room', description: 'Water leaking from ceiling in room H2-305 during rain' },
      { category: 'canteen', subject: 'High Food Prices', description: 'Canteen food prices have increased significantly compared to last semester' },
      { category: 'classroom', subject: 'Non-functional Smartboard', description: 'Smartboard in room E-203 not working for past 2 weeks' },
      { category: 'library', subject: 'AC Not Working', description: 'Air conditioning in library study area on 2nd floor not functioning' },
      { category: 'sports', subject: 'Badminton Court Maintenance', description: 'Badminton court 2 has damaged flooring and needs repair' },
      { category: 'transport', subject: 'Late Bus Arrival', description: 'Route 3 bus consistently arriving 20-30 minutes late' },
      { category: 'hostel', subject: 'Internet Connectivity Issues', description: 'WiFi not working in hostel block A since yesterday evening' },
      { category: 'classroom', subject: 'Insufficient Seating', description: 'Classroom D-401 has only 40 seats but 55 students enrolled' },
      { category: 'canteen', subject: 'Limited Vegetarian Options', description: 'Request for more vegetarian food items in daily menu' },
      { category: 'library', subject: 'Noisy Environment', description: 'Students making noise in silent reading zone of library' },
      { category: 'other', subject: 'Street Light Not Working', description: 'Street lights between hostel and academic block not working' },
      { category: 'transport', subject: 'Need Additional Bus', description: 'Morning 8 AM bus overcrowded, need one more bus on this route' },
      { category: 'hostel', subject: 'Laundry Machine Broken', description: 'Washing machine in hostel H3 common area out of order' },
      { category: 'classroom', subject: 'Poor Ventilation', description: 'Classroom F-105 has poor air circulation and gets very hot' },
      { category: 'other', subject: 'Garbage Pile-up', description: 'Garbage bins near block C overflowing and creating hygiene issues' }
    ];

    for (let i = 0; i < moreComplaints.length; i++) {
      const data = moreComplaints[i];
      await Complaint.create({
        complainant: users[(i * 2) % users.length]._id,
        category: data.category,
        subject: data.subject,
        description: data.description,
        priority: ['low', 'medium', 'high', 'urgent'][i % 4],
        status: ['open', 'in-progress', 'resolved', 'closed'][i % 4],
        assignedTo: i % 2 === 0 ? admin._id : undefined,
        comments: i % 4 === 3 ? [{
          user: admin._id,
          message: 'Issue has been resolved. Please verify.',
          createdAt: new Date()
        }] : [],
        resolution: i % 4 === 3 ? 'Issue fixed and verified by maintenance team' : null,
        resolvedAt: i % 4 === 3 ? new Date() : null
      });
    }
    console.log(`✅ Created ${moreComplaints.length} additional complaints\n`);

    // More Gate Passes
    console.log('🎫 Creating more gate passes...');
    await GatePass.deleteMany({});
    
    const gatePassReasons = [
      'Medical Emergency - Hospital Visit',
      'Parent-Teacher Meeting',
      'Job Interview at Tech Company',
      'Bank Work - Account Opening',
      'Family Function - Wedding',
      'Medical Checkup - Regular',
      'Passport Office Visit',
      'Driver License Test',
      'College Document Submission',
      'Shopping - Books & Stationery',
      'Meeting with Project Guide',
      'Court Hearing',
      'Medical Consultation - Dental',
      'Vehicle Service Center',
      'Home Visit - Festival',
      'Internship Interview',
      'Visa Documentation',
      'Medical Test - Blood Work',
      'Property Matter - Legal',
      'Cousin Wedding',
      'Urgent Family Matter',
      'Medical Emergency - Eye Specialist',
      'Shopping - Electronics',
      'Meeting with Parents',
      'Bank Loan Documentation'
    ];

    const destinations = [
      'City Hospital', 'Home Town', 'Tech Park IT Hub', 'HDFC Bank Main Branch', 
      'Marriage Hall - Downtown', 'Apollo Hospital', 'Passport Seva Kendra',
      'RTO Office', 'University Head Office', 'Book Depot Market', 
      'Professor Residence', 'District Court', 'Dental Clinic - MG Road',
      'Service Center', 'Native Place', 'Company Office - Whitefield',
      'Embassy Office', 'Diagnostic Center', 'Lawyer Office',
      'Banquet Hall', 'Home', 'Eye Hospital', 'Electronics Mall', 'Railway Station', 'ICICI Bank'
    ];

    for (let i = 0; i < 25; i++) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() + (i % 10) - 2);
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + (i % 4));
      
      await GatePass.create({
        student: students[i % students.length]._id,
        reason: gatePassReasons[i],
        destination: destinations[i],
        fromDate: fromDate,
        toDate: toDate,
        emergencyContact: `98765${43210 + i}`,
        status: ['pending', 'approved', 'rejected'][i % 3],
        approvedBy: i % 3 === 1 ? admin._id : undefined,
        approvalDate: i % 3 === 1 ? new Date() : undefined,
        remarks: i % 3 === 2 ? 'Please provide valid reason and documentation' : (i % 3 === 1 ? 'Approved. Valid till mentioned date.' : undefined)
      });
    }
    console.log(`✅ Created 25 gate passes\n`);

    console.log('═'.repeat(50));
    console.log('✨ ALL ADDITIONAL DATA SEEDED SUCCESSFULLY! ✨');
    console.log('═'.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   • Lost & Found Items: ${lostFoundData.length}`);
    console.log(`   • Entry/Exit Logs: 50`);
    console.log(`   • Additional Events: ${moreEvents.length}`);
    console.log(`   • Additional Complaints: ${moreComplaints.length}`);
    console.log(`   • Gate Passes: 25`);
    console.log('\n✅ All sections now have comprehensive dummy data!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAllData();
