const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All routes require authentication and customer role
router.use(protect);
router.use(restrictTo('customer'));

// Customer profile
router.get('/profile', async (req, res) => {
  try {
    const Customer = require('../models/Customer');
    const customer = await Customer.findById(req.user.userId);
    
    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get customer profile'
    });
  }
});

// Update customer profile
router.patch('/profile', async (req, res) => {
  try {
    const Customer = require('../models/Customer');
    const { fullName, phone, address } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// Get loyalty points
router.get('/loyalty-points', async (req, res) => {
  try {
    const Customer = require('../models/Customer');
    const customer = await Customer.findById(req.user.userId);
    
    res.status(200).json({
      status: 'success',
      data: { 
        loyaltyPoints: customer.loyaltyPoints 
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get loyalty points'
    });
  }
});

module.exports = router;