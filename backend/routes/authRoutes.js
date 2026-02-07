const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Admin routes
router.post('/admin/login', authController.adminLogin);

// Staff routes
router.post('/staff/signup', authController.staffSignup);
router.post('/staff/login', authController.staffLogin);

// Common routes (require authentication)
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;