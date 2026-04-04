// backend/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

// GET all menu items — public (POS needs to read menu without login)
router.get('/', menuController.getMenuItems);

// GET single menu item — public
router.get('/:id', menuController.getMenuItemById);

// POST create — protected (only logged-in staff/admin)
router.post('/', protect, menuController.createMenuItem);

// PUT update — protected
router.put('/:id', protect, menuController.updateMenuItem);

// DELETE — protected
router.delete('/:id', protect, menuController.deleteMenuItem);

module.exports = router;