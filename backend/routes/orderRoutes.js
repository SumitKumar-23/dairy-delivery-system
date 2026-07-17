const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getVendorOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/vendor/my-orders', protect, authorize('vendor'), getVendorOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('vendor', 'admin', 'delivery_agent'), updateOrderStatus);

module.exports = router;