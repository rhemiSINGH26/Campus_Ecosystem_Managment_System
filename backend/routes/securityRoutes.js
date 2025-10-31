const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const EntryLog = require('../models/EntryLog');
const LostFound = require('../models/LostFound');
const QRCode = require('qrcode');

// Log entry/exit
router.post('/log', verifyToken, authorize('security'), async (req, res) => {
  try {
    const entryLog = new EntryLog({
      ...req.body,
      verifiedBy: req.userId
    });

    await entryLog.save();

    res.status(201).json({ success: true, message: 'Entry logged successfully', data: entryLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging entry', error: error.message });
  }
});

// Get entry/exit logs
router.get('/logs', verifyToken, authorize('security', 'admin'), async (req, res) => {
  try {
    const { startDate, endDate, type, gate } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (type) query.type = type;
    if (gate) query.gate = gate;

    const logs = await EntryLog.find(query)
      .populate('user', 'name email phone')
      .populate('verifiedBy', 'name')
      .sort('-timestamp');

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching logs', error: error.message });
  }
});

// Verify QR code
router.post('/verify-qr', verifyToken, authorize('security'), async (req, res) => {
  try {
    const { qrCode, gate } = req.body;

    // In a real application, you would decode and verify the QR code
    // For now, we'll just log it
    const entryLog = new EntryLog({
      qrCode,
      gate,
      type: 'entry',
      verifiedBy: req.userId,
      user: req.body.userId // This would come from QR decode
    });

    await entryLog.save();

    res.json({ success: true, message: 'QR verified successfully', data: entryLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying QR', error: error.message });
  }
});

// Get lost and found items
router.get('/lostfound', verifyToken, authorize('security', 'admin'), async (req, res) => {
  try {
    const items = await LostFound.find()
      .populate('reportedBy', 'name email phone')
      .populate('claimedBy', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
  }
});

// Update lost/found item status
router.put('/lostfound/:itemId', verifyToken, authorize('security'), async (req, res) => {
  try {
    const item = await LostFound.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: 'Item updated successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating item', error: error.message });
  }
});

// Generate QR code for user
router.get('/generate-qr/:userId', verifyToken, authorize('security', 'admin'), async (req, res) => {
  try {
    const qrData = {
      userId: req.params.userId,
      timestamp: Date.now(),
      type: 'entry'
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({ success: true, data: { qrCode: qrCodeUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating QR', error: error.message });
  }
});

module.exports = router;
