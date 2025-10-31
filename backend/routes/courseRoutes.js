const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const Course = require('../models/Course');

// Get all courses
router.get('/', verifyToken, async (req, res) => {
  try {
    const { department, semester } = req.query;
    let query = { isActive: true };
    
    if (department) query.department = department;
    if (semester) query.semester = semester;

    const courses = await Course.find(query)
      .populate('faculty', 'name email');

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
  }
});

// Create course (Admin/Faculty)
router.post('/', verifyToken, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    res.status(201).json({ success: true, message: 'Course created successfully', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating course', error: error.message });
  }
});

// Get course details
router.get('/:courseId', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('faculty', 'name email')
      .populate('enrolledStudents');

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
  }
});

module.exports = router;
