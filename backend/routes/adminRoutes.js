const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const generateSubscriptionOrders = require('../utils/generateSubscriptionOrders');

// @desc   Manually trigger subscription order generation (for testing/admin use)
// @route  POST /api/admin/run-subscription-job
router.post('/run-subscription-job', protect, authorize('admin'), async (req, res) => {
  try {
    await generateSubscriptionOrders();
    res.json({ message: 'Subscription job executed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;