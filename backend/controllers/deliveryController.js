const Delivery = require('../models/Delivery');
const User = require('../models/User');

// @desc   Get all unassigned deliveries (vendor/admin)
// @route  GET /api/deliveries/unassigned
const getUnassignedDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: 'pending' })
      .populate('customer', 'name phone')
      .populate('order')
      .sort({ scheduledDate: 1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Assign a delivery agent to a delivery
// @route  PUT /api/deliveries/:id/assign
const assignDeliveryAgent = async (req, res) => {
  try {
    const { agentId } = req.body;

    const agent = await User.findOne({ _id: agentId, role: 'delivery_agent' });
    if (!agent) return res.status(404).json({ message: 'Delivery agent not found' });

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.deliveryAgent = agentId;
    delivery.status = 'assigned';
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get deliveries assigned to the logged-in delivery agent
// @route  GET /api/deliveries/my-deliveries
const getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryAgent: req.user._id })
      .populate('customer', 'name phone')
      .populate('order')
      .sort({ scheduledDate: 1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update delivery status (agent marks out for delivery / delivered / missed)
// @route  PUT /api/deliveries/:id/status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    if (delivery.deliveryAgent?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this delivery' });
    }

    delivery.status = status;
    if (notes) delivery.notes = notes;
    if (status === 'delivered') delivery.deliveredAt = new Date();

    await delivery.save();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get delivery history for logged-in customer
// @route  GET /api/deliveries/customer/history
const getCustomerDeliveryHistory = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ customer: req.user._id })
      .populate('deliveryAgent', 'name phone')
      .sort({ scheduledDate: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUnassignedDeliveries,
  assignDeliveryAgent,
  getMyDeliveries,
  updateDeliveryStatus,
  getCustomerDeliveryHistory,
};