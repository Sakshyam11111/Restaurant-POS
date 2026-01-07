// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Staff Routes
router.post('/staff/signup', authController.staffSignup);
router.post('/staff/login', authController.staffLogin);

// Customer Routes
router.post('/customer/signup', authController.customerSignup);
router.post('/customer/login', authController.customerLogin);

// Protected Routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;