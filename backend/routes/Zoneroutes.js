const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       zoneController.getZones);
router.get('/:id',    zoneController.getZoneById);
router.post('/',   protect, zoneController.createZone);
router.put('/:id', protect, zoneController.updateZone);
router.delete('/:id', protect, zoneController.deleteZone);

module.exports = router;