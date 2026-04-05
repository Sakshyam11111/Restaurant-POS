// backend/routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/initialize',                    tableController.initializeTables);
router.get('/',                               tableController.getAllTables);
router.patch('/:tableId/status',              tableController.updateTableStatus);
router.post('/:tableId/reserve',              tableController.reserveTable);
router.post('/:tableId/cancel-reservation',   tableController.cancelReservation);
router.post('/:tableId/start-dining',         tableController.startDining);
router.post('/:tableId/end-dining',           tableController.endDining);
// NEW: links a created order's _id into the table document
router.post('/:tableId/link-order',           tableController.linkOrderToTable);

module.exports = router;