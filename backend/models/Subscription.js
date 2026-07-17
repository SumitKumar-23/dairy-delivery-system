const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    frequency: {
      type: String,
      enum: ['daily', 'alternate_days', 'weekly', 'monthly'],
      required: true,
    },
    // For 'weekly': which days of week, e.g. ['Monday', 'Thursday']
    weeklyDays: [{ type: String }],
    deliveryTime: {
      type: String,
      enum: ['Morning', 'Evening'],
      default: 'Morning',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, // null = ongoing until cancelled
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active',
    },
    lastDeliveryGeneratedDate: {
      type: Date, // tracks the last date we auto-generated an order for this subscription
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);