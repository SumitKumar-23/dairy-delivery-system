const Subscription = require('../models/Subscription');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Delivery = require('../models/Delivery');
const Notification = require('../models/Notification');
const { isDueToday } = require('./subscriptionHelper');

const generateSubscriptionOrders = async () => {
  const today = new Date();
  console.log(`[Subscription Job] Running for ${today.toDateString()}`);

  const activeSubscriptions = await Subscription.find({ status: 'active' }).populate('product');

  let created = 0;

  for (const sub of activeSubscriptions) {
    if (!isDueToday(sub, new Date(today))) continue;

    const product = sub.product;

    if (product.stock < sub.quantity) {
      console.log(`  Skipped ${sub._id} — insufficient stock for ${product.name}`);
      continue;
    }

    const subtotal = product.price * sub.quantity;

    const newOrder = await Order.create({
      customer: sub.customer,
      items: [
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: sub.quantity,
        },
      ],
      deliveryAddress: sub.deliveryAddress,
      orderType: 'subscription',
      subtotal,
      deliveryCharge: 0,
      totalAmount: subtotal,
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
    });

    await Delivery.create({
      order: newOrder._id,
      customer: sub.customer,
      deliveryAddress: sub.deliveryAddress,
      scheduledDate: today,
      deliveryTime: sub.deliveryTime,
      status: 'pending',
    });

    await Notification.create({
      user: sub.customer,
      type: 'delivery_scheduled',
      message: `Your ${product.name} delivery is scheduled for today.`,
    });

    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -sub.quantity } });

    sub.lastDeliveryGeneratedDate = today;
    await sub.save();

    created++;
  }

  console.log(`[Subscription Job] Created ${created} order(s)`);
};

module.exports = generateSubscriptionOrders;