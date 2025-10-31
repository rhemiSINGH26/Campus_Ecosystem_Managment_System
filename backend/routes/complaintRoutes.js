const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

// Create complaint
router.post('/', verifyToken, async (req, res) => {
  try {
    const complaint = new Complaint({
      complainant: req.userId,
      ...req.body
    });

    await complaint.save();

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting complaint', error: error.message });
  }
});

// Get user's complaints
router.get('/my', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ complainant: req.userId })
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching complaints', error: error.message });
  }
});

// Get complaint details
router.get('/:complaintId', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId)
      .populate('complainant', 'name email')
      .populate('assignedTo', 'name')
      .populate('comments.user', 'name');

    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching complaint', error: error.message });
  }
});

// Add comment to complaint
router.post('/:complaintId/comment', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.comments.push({
      user: req.userId,
      message: req.body.message
    });

    await complaint.save();

    res.json({ success: true, message: 'Comment added', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
});

// Update complaint status
router.put('/:complaintId/status', verifyToken, async (req, res) => {
  try {
    const { status, resolution } = req.body;
    
    const updateData = { status };
    if (status === 'resolved' || status === 'closed') {
      updateData.resolution = resolution;
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.complaintId,
      updateData,
      { new: true }
    );

    res.json({ success: true, message: 'Status updated', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
  }
});

module.exports = router;
