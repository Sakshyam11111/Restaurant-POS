// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo, restrictToRole } = require('../middleware/authMiddleware');

// All routes require authentication and staff role
router.use(protect);
router.use(restrictTo('staff'));

// Staff profile
router.get('/profile', async (req, res) => {
  try {
    const Staff = require('../models/Staff');
    const staff = await Staff.findById(req.user.userId);
    
    res.status(200).json({
      status: 'success',
      data: { staff }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get staff profile'
    });
  }
});

// Update staff profile
router.patch('/profile', async (req, res) => {
  try {
    const Staff = require('../models/Staff');
    const { fullName, phone } = req.body;
    
    const staff = await Staff.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { staff }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// Admin only - Get all staff
router.get('/all', restrictToRole('admin', 'manager'), async (req, res) => {
  try {
    const Staff = require('../models/Staff');
    const staff = await Staff.find();
    
    res.status(200).json({
      status: 'success',
      results: staff.length,
      data: { staff }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get staff list'
    });
  }
});

module.exports = router;