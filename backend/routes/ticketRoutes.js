const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, getAllTickets, updateTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createTicket);
router.get('/my-tickets', protect, authorize('customer'), getMyTickets);
router.get('/', protect, authorize('admin'), getAllTickets);
router.put('/:id', protect, authorize('admin'), updateTicket);

module.exports = router;