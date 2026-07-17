const Subscription = require('../models/Subscription');
const Product = require('../models/Product');

// @desc   Create a new subscription
// @route  POST /api/subscriptions
const createSubscription = async (req, res) => {
  try {
    const { productId, quantity, frequency, weeklyDays, deliveryTime, deliveryAddress, startDate, endDate } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.isSubscribable) {
      return res.status(400).json({ message: 'This product is not available for subscription' });
    }

    const subscription = await Subscription.create({
      customer: req.user._id,
      product: productId,
      quantity,
      frequency,
      weeklyDays: weeklyDays || [],
      deliveryTime,
      deliveryAddress,
      startDate,
      endDate: endDate || null,
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in customer's subscriptions
// @route  GET /api/subscriptions/my-subscriptions
const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ customer: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Pause a subscription
// @route  PUT /api/subscriptions/:id/pause
const pauseSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'paused';
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Resume a subscription
// @route  PUT /api/subscriptions/:id/resume
const resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'active';
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel a subscription
// @route  PUT /api/subscriptions/:id/cancel
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'cancelled';
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update subscription (quantity, frequency, address, etc.)
// @route  PUT /api/subscriptions/:id
const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    Object.assign(subscription, req.body);
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubscription,
  getMySubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  updateSubscription,
};