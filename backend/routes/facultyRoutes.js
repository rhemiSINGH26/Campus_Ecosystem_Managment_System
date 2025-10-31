const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');

// Get faculty profile
router.get('/profile', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId })
      .populate('userId', '-password -refreshToken')
      .populate('assignedCourses');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

// Get assigned courses
router.get('/courses', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId });
    const courses = await Course.find({ faculty: faculty._id }).populate('enrolledStudents');

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
  }
});

// Create assignment
router.post('/assignments', verifyToken, authorize('faculty'), uploadMultiple, async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId });
    
    // Handle file uploads
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    })) : [];
    
    const assignment = new Assignment({
      faculty: faculty._id,
      ...req.body,
      attachments: attachments
    });

    await assignment.save();

    res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating assignment', error: error.message });
  }
});

// Get assignments
router.get('/assignments', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId });
    const assignments = await Assignment.find({ faculty: faculty._id })
      .populate('course')
      .populate('submissions.student');

    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
});

// Grade assignment
router.put('/assignments/:assignmentId/grade/:studentId', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const { marks, remarks } = req.body;
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === req.params.studentId
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.remarks = remarks;
    submission.isGraded = true;

    await assignment.save();

    res.json({ success: true, message: 'Assignment graded successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error grading assignment', error: error.message });
  }
});

// Mark attendance
router.post('/attendance', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId });
    
    const attendance = new Attendance({
      faculty: faculty._id,
      ...req.body
    });

    await attendance.save();

    res.status(201).json({ success: true, message: 'Attendance marked successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
});

// Get attendance records
router.get('/attendance/:courseId', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.userId });
    const attendance = await Attendance.find({ 
      course: req.params.courseId,
      faculty: faculty._id
    }).populate('records.student');

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Update attendance
router.put('/attendance/:attendanceId', verifyToken, authorize('faculty'), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.attendanceId,
      { records: req.body.records },
      { new: true }
    );

    res.json({ success: true, message: 'Attendance updated successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating attendance', error: error.message });
  }
});

module.exports = router;
