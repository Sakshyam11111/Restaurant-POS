const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema(
  {
    designationName: {
      type: String,
      required: [true, 'Designation name is required'],
      trim: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model('Designation', designationSchema);