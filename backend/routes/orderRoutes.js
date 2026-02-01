const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

router.post('/', protect, orderController.createOrder);
router.patch('/:id', protect, orderController.updateOrderStatus);
router.delete('/:id', protect, orderController.deleteOrder);

module.exports = router;