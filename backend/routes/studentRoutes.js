const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const GatePass = require('../models/GatePass');

// Get student profile
router.get('/profile', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId })
      .populate('userId', '-password -refreshToken')
      .populate('enrolledCourses')
      .populate('hostelId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

// Get enrolled courses
router.get('/courses', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId }).populate({
      path: 'enrolledCourses',
      populate: { path: 'faculty', populate: { path: 'userId', select: 'name email phone' } }
    });

    res.json({ success: true, data: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
  }
});

// Enroll in course
router.post('/enroll/:courseId', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (student.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    student.enrolledCourses.push(req.params.courseId);
    await student.save();

    course.enrolledStudents.push(student._id);
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error enrolling in course', error: error.message });
  }
});

// Get assignments
router.get('/assignments', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    const assignments = await Assignment.find({ 
      course: { $in: student.enrolledCourses }
    }).populate('course').populate('faculty', 'name email');

    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
});

// Submit assignment
router.post('/assignments/:assignmentId/submit', verifyToken, authorize('student'), uploadMultiple, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === student._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Assignment already submitted' });
    }

    // Handle file uploads
    const files = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    })) : [];

    assignment.submissions.push({
      student: student._id,
      files: files,
      remarks: req.body.remarks || ''
    });

    await assignment.save();

    res.json({ success: true, message: 'Assignment submitted successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting assignment', error: error.message });
  }
});

// Get attendance
router.get('/attendance', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    const attendance = await Attendance.find({
      course: { $in: student.enrolledCourses },
      'records.student': student._id
    }).populate('course').populate('faculty', 'name');

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Apply for gate pass
router.post('/gatepass', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    
    const gatePass = new GatePass({
      student: student._id,
      ...req.body
    });

    await gatePass.save();

    res.status(201).json({ success: true, message: 'Gate pass applied successfully', data: gatePass });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error applying for gate pass', error: error.message });
  }
});

// Get gate passes
router.get('/gatepass', verifyToken, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const gatePasses = await GatePass.find({ student: student._id }).populate('approvedBy', 'name');

    res.json({ success: true, data: gatePasses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gate passes', error: error.message });
  }
});

module.exports = router;
