const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Event = require('../models/Event');
const Complaint = require('../models/Complaint');
const Hostel = require('../models/Hostel');
const GatePass = require('../models/GatePass');

// Get all users
router.get('/users', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

// Get analytics dashboard data
router.get('/analytics', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalEvents = await Event.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['open', 'in-progress'] } });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const pendingGatePasses = await GatePass.countDocuments({ status: 'pending' });

    const departmentWiseStudents = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const yearWiseStudents = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalEvents,
        pendingComplaints,
        pendingEvents,
        pendingGatePasses,
        departmentWiseStudents,
        yearWiseStudents
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
  }
});

// Approve/Reject event
router.put('/events/:eventId/approve', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { 
        status, 
        approvedBy: req.userId 
      },
      { new: true }
    );

    res.json({ success: true, message: `Event ${status}`, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
});

// Get all complaints
router.get('/complaints', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('complainant', 'name email')
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching complaints', error: error.message });
  }
});

// Assign complaint
router.put('/complaints/:complaintId/assign', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.complaintId,
      { 
        assignedTo,
        status: 'in-progress'
      },
      { new: true }
    );

    res.json({ success: true, message: 'Complaint assigned', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error assigning complaint', error: error.message });
  }
});

// Manage hostel allotment
router.post('/hostel/allot', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { studentId, hostelId, roomNumber } = req.body;

    const student = await Student.findById(studentId);
    const hostel = await Hostel.findById(hostelId);

    if (!student || !hostel) {
      return res.status(404).json({ success: false, message: 'Student or Hostel not found' });
    }

    student.hostelId = hostelId;
    student.roomNumber = roomNumber;
    await student.save();

    const room = hostel.rooms.find(r => r.roomNumber === roomNumber);
    if (room) {
      room.occupants.push(studentId);
      await hostel.save();
    }

    res.json({ success: true, message: 'Hostel allotted successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error allotting hostel', error: error.message });
  }
});

// Approve/Reject gate pass
router.put('/gatepass/:gatePassId/approve', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const gatePass = await GatePass.findByIdAndUpdate(
      req.params.gatePassId,
      { 
        status,
        remarks,
        approvedBy: req.userId,
        approvalDate: new Date()
      },
      { new: true }
    );

    res.json({ success: true, message: `Gate pass ${status}`, data: gatePass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating gate pass', error: error.message });
  }
});

// Create hostel
router.post('/hostel', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();

    res.status(201).json({ success: true, message: 'Hostel created successfully', data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating hostel', error: error.message });
  }
});

// Get all hostels
router.get('/hostel', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('rooms.occupants');
    res.json({ success: true, data: hostels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hostels', error: error.message });
  }
});

module.exports = router;
