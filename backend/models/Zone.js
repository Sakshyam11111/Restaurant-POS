const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema(
  {
    zoneName: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Zone', zoneSchema);