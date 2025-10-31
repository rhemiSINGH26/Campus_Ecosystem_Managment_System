const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const LostFound = require('../models/LostFound');

// Report lost/found item
router.post('/', verifyToken, uploadMultiple, async (req, res) => {
  try {
    // Handle file uploads
    const images = req.files ? req.files.map(file => 
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    ) : [];

    const item = new LostFound({
      reportedBy: req.userId,
      ...req.body,
      images: images
    });

    await item.save();

    res.status(201).json({ success: true, message: 'Item reported successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reporting item', error: error.message });
  }
});

// Get all lost/found items
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, category, status } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    const items = await LostFound.find(query)
      .populate('reportedBy', 'name email phone')
      .populate('claimedBy', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
  }
});

// Claim item
router.post('/:itemId/claim', verifyToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Item already claimed' });
    }

    item.claimedBy = req.userId;
    item.verificationDetails = req.body.verificationDetails;
    item.status = 'claimed';

    await item.save();

    res.json({ success: true, message: 'Claim submitted for verification', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error claiming item', error: error.message });
  }
});

// Get user's items
router.get('/my', verifyToken, async (req, res) => {
  try {
    const items = await LostFound.find({ reportedBy: req.userId })
      .populate('claimedBy', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
  }
});

module.exports = router;
