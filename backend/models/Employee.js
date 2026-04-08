const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    address: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    contactNumber: { type: String, trim: true, default: '' },
    dateOfBirth: { type: String, default: '' },
    joiningDate: { type: String, default: '' },
    education: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    panNumber: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
    username: { type: String, trim: true, default: '' },
    // Base64 encoded photo string
    photo: { type: String, default: '' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);