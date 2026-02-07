// backend/models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableId: {
    type: Number,
    required: [true, 'Table ID is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'on-dine', 'split', 'merge'],
    default: 'available'
  },
  floor: {
    type: String,
    default: 'First Floor'
  },
  reservedBy: {
    guestName: String,
    guestPhone: String,
    reservationTime: Date,
    partySize: Number
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);