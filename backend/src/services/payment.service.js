const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const crypto = require("crypto");

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

  if (booking.status !== "pending") {
    const err = new Error("Booking not eligible for payment");
    err.statusCode = 400;
    throw err;
  }

  if (booking.expiresAt < new Date()) {
    booking.status = "failed";
    await booking.save();

    const err = new Error("Booking expired");
    err.statusCode = 400;
    throw err;
  }

  const options = {
    amount: booking.totalPrice * 100, // Razorpay uses paisa
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

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    const err = new Error("Payment verification failed");
    err.statusCode = 400;
    throw err;
  }

  const booking = await Booking.findOne({
    razorpayOrderId: razorpay_order_id
  });


  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  if (booking.status === "confirmed") {
    return booking; 
  }

  if (booking.expiresAt < new Date()) {
    booking.status = "failed";
    await booking.save();

    const err = new Error("Booking expired before confirmation");
    err.statusCode = 400;
    throw err;
  }

  booking.status = "confirmed";
  booking.paymentId = razorpay_payment_id;

  await booking.save();

  return booking;
};
