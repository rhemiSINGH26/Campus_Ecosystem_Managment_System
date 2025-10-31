const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { verifyToken } = require('../middleware/auth');

// Get timetable for a student
router.get('/student', verifyToken, async (req, res) => {
  try {
    const student = await require('../models/Student').findOne({ userId: req.userId })
      .populate('userId', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const timetable = await Timetable.find({
      semester: student.semester,
      section: student.section,
      department: student.department
    })
    .populate('course', 'courseCode courseName credits')
    .populate('faculty', 'userId')
    .populate({
      path: 'faculty',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .sort({ day: 1, startTime: 1 });

    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Get student timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable'
    });
  }
});

// Get timetable for faculty
router.get('/faculty', verifyToken, async (req, res) => {
  try {
    const faculty = await require('../models/Faculty').findOne({ userId: req.userId })
      .populate('assignedCourses');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    const courseIds = faculty.assignedCourses.map(c => c._id);
    
    const timetable = await Timetable.find({
      course: { $in: courseIds }
    })
    .populate('course', 'courseCode courseName credits')
    .sort({ day: 1, startTime: 1 });

    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Get faculty timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable'
    });
  }
});

module.exports = router;
