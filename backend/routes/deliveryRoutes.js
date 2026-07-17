const express = require('express');
const router = express.Router();
const {
  getUnassignedDeliveries,
  assignDeliveryAgent,
  getMyDeliveries,
  updateDeliveryStatus,
  getCustomerDeliveryHistory,
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/unassigned', protect, authorize('vendor', 'admin'), getUnassignedDeliveries);
router.put('/:id/assign', protect, authorize('vendor', 'admin'), assignDeliveryAgent);
router.get('/my-deliveries', protect, authorize('delivery_agent'), getMyDeliveries);
router.put('/:id/status', protect, authorize('delivery_agent', 'admin'), updateDeliveryStatus);
router.get('/customer/history', protect, authorize('customer'), getCustomerDeliveryHistory);

module.exports = router;