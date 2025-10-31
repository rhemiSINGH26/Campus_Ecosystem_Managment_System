const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const Event = require('../models/Event');
const QRCode = require('qrcode');

// Get all events
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, eventType } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('approvedBy', 'name')
      .sort('-eventDate');

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
});

// Create event
router.post('/', verifyToken, uploadSingle, async (req, res) => {
  try {
    // Handle file upload for poster
    const poster = req.file ? 
      `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    const event = new Event({
      organizer: req.userId,
      ...req.body,
      poster: poster
    });

    await event.save();

    res.status(201).json({ success: true, message: 'Event created successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
});

// Register for event
router.post('/:eventId/register', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Event not approved yet' });
    }

    const alreadyRegistered = event.registeredParticipants.some(
      p => p.user.toString() === req.userId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Generate QR code for attendance
    const qrData = {
      eventId: event._id,
      userId: req.userId,
      timestamp: Date.now()
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    event.registeredParticipants.push({
      user: req.userId,
      qrCode
    });

    await event.save();

    res.json({ 
      success: true, 
      message: 'Registered successfully', 
      data: { event, qrCode } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering for event', error: error.message });
  }
});

// Mark attendance via QR
router.post('/:eventId/attendance', verifyToken, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const { qrData } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const decoded = JSON.parse(qrData);
    const participant = event.registeredParticipants.find(
      p => p.user.toString() === decoded.userId
    );

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.hasAttended = true;
    participant.attendedAt = new Date();

    await event.save();

    res.json({ success: true, message: 'Attendance marked', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
});

// Get event details
router.get('/:eventId', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('organizer', 'name email')
      .populate('registeredParticipants.user', 'name email');

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
  }
});

module.exports = router;
