const mongoose = require('mongoose');

const entryLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['entry', 'exit'],
    required: true
  },
  gate: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  purpose: {
    type: String
  },
  vehicleNumber: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('EntryLog', entryLogSchema);
