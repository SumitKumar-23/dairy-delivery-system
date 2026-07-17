const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // unassigned until a vendor/admin assigns one
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    zone: {
      type: String, // e.g. "Sector A" — used for route grouping
      default: 'Unassigned',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      enum: ['Morning', 'Evening'],
      default: 'Morning',
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'out_for_delivery', 'delivered', 'missed'],
      default: 'pending',
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);