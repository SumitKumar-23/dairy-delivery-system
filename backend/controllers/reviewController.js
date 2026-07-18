const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc   Create a review (only for products in a delivered order)
// @route  POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ message: 'You can only review delivered orders' });
    }

    const productInOrder = order.items.some((item) => item.product.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: 'This product was not part of that order' });
    }

    const review = await Review.create({
      customer: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this product for this order' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get reviews for a product
// @route  GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.json({ reviews, avgRating: Number(avgRating.toFixed(1)), count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getProductReviews };