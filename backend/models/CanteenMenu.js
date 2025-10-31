const mongoose = require('mongoose');

const canteenMenuSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15
  }
}, { timestamps: true });

module.exports = mongoose.model('CanteenMenu', canteenMenuSchema);
