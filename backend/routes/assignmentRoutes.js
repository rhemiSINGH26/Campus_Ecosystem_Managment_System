const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Assignment = require('../models/Assignment');

// Get all assignments
router.get('/', verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .populate('course')
      .populate('faculty', 'name email')
      .sort('-createdAt');

    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
});

// Get assignment details
router.get('/:assignmentId', verifyToken, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate('course')
      .populate('faculty', 'name email')
      .populate('submissions.student');

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignment', error: error.message });
  }
});

module.exports = router;
