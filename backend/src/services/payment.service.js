const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const crypto = require("crypto");
const VendorProfile = require("../models/VendorProfile");
const Venue = require('../models/Venue');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (bookingId, userId) => {

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const err = new Error("Invalid booking ID");
    err.statusCode = 400;
    throw err;
  }

  const booking = await Booking.findById(bookingId);

  if (!booking || booking.user.toString() !== userId) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  if (booking.bookingState !== "PENDING_PAYMENT") {
    const err = new Error("Booking not eligible for payment");
    err.statusCode = 400;
    throw err;
  }

  if (booking.expiresAt < new Date()) {
    booking.bookingState = "EXPIRED";
    await booking.save();

    const err = new Error("Booking expired");
    err.statusCode = 400;
    throw err;
  }

  const options = {
    amount: booking.totalPrice * 100, 
    currency: "INR",
    receipt: booking._id.toString(),
  };

  const order = await razorpay.orders.create(options);

  booking.razorpayOrderId = order.id;
  await booking.save();

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    bookingId: booking._id,
  };
};


exports.verifyPayment = async (data) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId
  } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const err = new Error("Missing payment verification fields");
    err.statusCode = 400;
    throw err;
  }

  //  Signature Verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    const err = new Error("Invalid payment signature");
    err.statusCode = 400;
    throw err;
  }

  // Find booking strictly by razorpayOrderId
  const booking = await Booking.findOne({
    razorpayOrderId: razorpay_order_id
  });

  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  // Ensure bookingId matches (anti-tampering protection)
  if (bookingId && booking._id.toString() !== bookingId) {
    const err = new Error("Booking mismatch");
    err.statusCode = 400;
    throw err;
  }

  //  Prevent verifying expired bookings
  if (booking.expiresAt < new Date()) {
    booking.bookingState = "EXPIRED";
    booking.paymentState = "FAILED";
    await booking.save();

    const err = new Error("Booking expired");
    err.statusCode = 400;
    throw err;
  }

  // Prevent verifying already confirmed
  if (booking.paymentState === "PAID") {
    const err = new Error("Payment already verified");
    err.statusCode = 400;
    throw err;
  }

  if (booking.bookingState !== "PENDING_PAYMENT") {
    const err = new Error("Booking not eligible for payment");
    err.statusCode = 400;
    throw err;
  }

  
  // Fetch venue
  const venue = await Venue.findById(booking.venue);

  if (!venue) {
    const err = new Error("Venue not found");
    err.statusCode = 404;
    throw err;
  }

  // Fetch vendor profile
  const vendorProfile = await VendorProfile.findOne({ user: venue.owner });

  if (!vendorProfile) {
    const err = new Error("Vendor profile not found");
    err.statusCode = 404;
    throw err;
  }

  // Ensure vendor KYC is verified
  if (vendorProfile.kycStatus !== "VERIFIED") {
    const err = new Error("Vendor not KYC verified");
    err.statusCode = 403;
    throw err;
  }

  // Commission calculation
  const commissionRate = vendorProfile.commissionRate ?? 10;

  const platformFee = (booking.totalPrice * commissionRate) / 100;
  const vendorEarning = booking.totalPrice - platformFee;

  booking.platformFee = platformFee;
  booking.vendorEarning = vendorEarning;

  booking.bookingState = "CONFIRMED";
  booking.paymentState = "PAID";
  booking.paymentId = razorpay_payment_id;

  await booking.save();

  return booking;
};


exports.refundPayment = async (booking) => {

  const now = new Date();
  const hoursDiff = (booking.startTime - now) / (1000 * 60 * 60);

  if (booking.paymentState === "REFUNDED" ||
    booking.paymentState === "PARTIALLY_REFUNDED") {
    const err = new Error("Already refunded");
    err.statusCode = 400;
    throw err;
  }

  if (!booking.paymentId) {
    throw new Error("No payment to refund");
  }

  let refundPercentage = 0;

  if (hoursDiff > 24) refundPercentage = 1;
  else if (hoursDiff > 2) refundPercentage = 0.5;
  else refundPercentage = 0;

  if (refundPercentage === 0) return null;

  const refundAmount = booking.totalPrice * refundPercentage;

  const refund = await razorpay.payments.refund(
    booking.paymentId,
    {
      amount: Math.round(refundAmount * 100) // always integer paisa
    }
  );

  booking.refundId = refund.id;
  booking.refundAmount = refundAmount;

  await booking.save();

  return refund;
};