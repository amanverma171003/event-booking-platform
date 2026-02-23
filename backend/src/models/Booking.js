const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
      index: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    platformFee: {
      type: Number,
      default: 0
    },

    vendorEarning: {
      type: Number,
      default: 0
    },

    // Booking Lifecycle State
    bookingState: {
      type: String,
      enum: [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "FAILED",
        "EXPIRED",
        "COMPLETED",
      ],
      default: "PENDING_PAYMENT",
      index: true,
    },

    // Payment Lifecycle State
    paymentState: {
      type: String,
      enum: [
        "UNPAID",
        "PAID",
        "REFUND_PENDING",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      default: "UNPAID",
      index: true,
    },

    // Razorpay Tracking
    paymentId: {
      type: String,
    },

    razorpayOrderId: {
      type: String,
      index: true,
    },

    // Refund Tracking
    refundId: {
      type: String,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    // Expiry for Pending Payment
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent overlapping queries from being slow
bookingSchema.index({ venue: 1, startTime: 1, endTime: 1 });

// Fast state filtering
bookingSchema.index({ bookingState: 1, paymentState: 1 });

// Vendor analytics optimization
bookingSchema.index({ venue: 1, bookingState: 1, paymentState: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
