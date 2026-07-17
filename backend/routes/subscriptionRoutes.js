const express = require('express');
const router = express.Router();
const {
  createSubscription,
  getMySubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  updateSubscription,
} = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('customer'));

router.post('/', createSubscription);
router.get('/my-subscriptions', getMySubscriptions);
router.put('/:id', updateSubscription);
router.put('/:id/pause', pauseSubscription);
router.put('/:id/resume', resumeSubscription);
router.put('/:id/cancel', cancelSubscription);

module.exports = router;    