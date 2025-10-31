const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Attendance = require('../models/Attendance');

// Get attendance records
router.get('/', verifyToken, async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    let query = {};
    
    if (courseId) query.course = courseId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query)
      .populate('course')
      .populate('faculty', 'name')
      .populate('records.student')
      .sort('-date');

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

module.exports = router;
