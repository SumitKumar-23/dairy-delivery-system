const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const generateSubscriptionOrders = require('../utils/generateSubscriptionOrders');
const {
  getAllUsers,
  getDashboardStats,
  getAllOrders,
  getAllProducts,
  toggleUserStatus,
} = require('../controllers/adminController');

router.use(protect, authorize('admin')); // every route below requires admin

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);
router.put('/users/:id/toggle-status', toggleUserStatus);

router.post('/run-subscription-job', async (req, res) => {
  try {
    await generateSubscriptionOrders();
    res.json({ message: 'Subscription job executed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;