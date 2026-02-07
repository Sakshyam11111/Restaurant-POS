// backend/routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');

// All table routes require authentication
router.use(protect);

// Initialize tables (one-time setup)
router.post('/initialize', tableController.initializeTables);

// Get all tables
router.get('/', tableController.getAllTables);

// Update table status
router.patch('/:tableId/status', tableController.updateTableStatus);

// Reserve a table
router.post('/:tableId/reserve', tableController.reserveTable);

// Cancel reservation
router.post('/:tableId/cancel-reservation', tableController.cancelReservation);

// Start dining
router.post('/:tableId/start-dining', tableController.startDining);

// End dining
router.post('/:tableId/end-dining', tableController.endDining);

module.exports = router;