const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       employeeController.getEmployees);
router.get('/:id',    employeeController.getEmployeeById);
router.post('/',   protect, employeeController.createEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, employeeController.deleteEmployee);

module.exports = router;