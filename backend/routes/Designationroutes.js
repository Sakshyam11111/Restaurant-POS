const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       designationController.getDesignations);
router.get('/:id',    designationController.getDesignationById);
router.post('/',   protect, designationController.createDesignation);
router.put('/:id', protect, designationController.updateDesignation);
router.delete('/:id', protect, designationController.deleteDesignation);

module.exports = router;