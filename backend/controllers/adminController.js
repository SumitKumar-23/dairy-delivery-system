const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// @desc   Get all users (optionally filter by role)
// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get dashboard summary stats
// @route  GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalCustomers, totalVendors, totalAgents, totalOrders, activeSubscriptions, revenueAgg] =
      await Promise.all([
        User.countDocuments({ role: 'customer' }),
        User.countDocuments({ role: 'vendor' }),
        User.countDocuments({ role: 'delivery_agent' }),
        Order.countDocuments(),
        Subscription.countDocuments({ status: 'active' }),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
      ]);

    res.json({
      totalCustomers,
      totalVendors,
      totalAgents,
      totalOrders,
      activeSubscriptions,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all orders (admin oversight)
// @route  GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all products (admin oversight)
// @route  GET /api/admin/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendor', 'name shopName').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Deactivate/reactivate a user (soft toggle since we don't have an isActive field yet — will add it)
// @route  PUT /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = !user.isVerified; // reusing isVerified as an active/inactive-style flag for now
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  getAllOrders,
  getAllProducts,
  toggleUserStatus,
};