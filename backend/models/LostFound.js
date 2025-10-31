const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'documents', 'books', 'clothing', 'accessories', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned'],
    default: 'active'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDetails: {
    type: String
  },
  handedOverTo: {
    name: String,
    phone: String,
    date: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
