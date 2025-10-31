const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Hostel = require('../models/Hostel');
const GatePass = require('../models/GatePass');

// Get all hostels
router.get('/', verifyToken, async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json({ success: true, data: hostels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hostels', error: error.message });
  }
});

// Get hostel details
router.get('/:hostelId', verifyToken, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId)
      .populate('rooms.occupants');

    res.json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hostel', error: error.message });
  }
});

module.exports = router;
