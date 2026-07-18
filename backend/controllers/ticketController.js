const Ticket = require('../models/Ticket');

// @desc   Create a support ticket
// @route  POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { orderId, category, subject, description } = req.body;
    const ticket = await Ticket.create({
      customer: req.user._id,
      order: orderId || null,
      category,
      subject,
      description,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in customer's tickets
// @route  GET /api/tickets/my-tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all tickets (admin)
// @route  GET /api/tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('customer', 'name phone email').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Respond to / update a ticket (admin)
// @route  PUT /api/tickets/:id
const updateTicket = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (status) ticket.status = status;
    if (adminReply !== undefined) ticket.adminReply = adminReply;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicket };