const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getMyPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-razorpay-order', protect, authorize('customer'), createRazorpayOrder);
router.post('/verify', protect, authorize('customer'), verifyPayment);
router.get('/my-payments', protect, authorize('customer'), getMyPayments);

module.exports = router;