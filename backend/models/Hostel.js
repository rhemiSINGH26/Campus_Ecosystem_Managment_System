const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true
  },
  hostelType: {
    type: String,
    enum: ['boys', 'girls'],
    required: true
  },
  warden: {
    name: String,
    phone: String,
    email: String
  },
  totalRooms: {
    type: Number,
    required: true
  },
  occupiedRooms: {
    type: Number,
    default: 0
  },
  facilities: [String],
  rooms: [{
    roomNumber: String,
    floor: Number,
    capacity: Number,
    occupants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
