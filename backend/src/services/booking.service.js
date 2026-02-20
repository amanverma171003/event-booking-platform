const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const paymentService = require("./payment.service");

exports.createBooking = async (data, user) => {
  const { venueId, startTime, endTime } = data;

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const venue = await Venue.findById(venueId).session(session);

    if (!venue || venue.status !== "approved" || !venue.isActive) {
      const err = new Error("Venue not available");
      err.statusCode = 404;
      throw err;
    }

    // Overlap check
    const overlappingBooking = await Booking.findOne({
      venue: venueId,
      $and: [
        {
          $or: [
            { bookingState: "CONFIRMED" },
            {
              bookingState: "PENDING_PAYMENT",
              expiresAt: { $gt: new Date() }
            }
          ]
        },
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    }).session(session);

    if (overlappingBooking) {
      const err = new Error("Time slot already booked");
      err.statusCode = 400;
      throw err;
    }

    // Calculate total price
    const durationHours =
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

    const totalPrice = durationHours * venue.pricePerHour;

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const booking = await Booking.create(
      [{
        venue: venueId,
        user: user.id,
        startTime,
        endTime,
        totalPrice,
        bookingState: "PENDING_PAYMENT",
        paymentState: "UNPAID",
        expiresAt
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return booking[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


exports.getMyBookings = async (userId) => {

  const bookings = await Booking.find({ user: userId })
    .populate("venue", "name location.city pricePerHour")
    .sort({ createdAt: -1 });

  return bookings;
};


exports.cancelBooking = async (bookingId, user) => {

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const err = new Error("Invalid booking ID");
    err.statusCode = 400;
    throw err;
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  // Authorization
  if (
    booking.user.toString() !== user.id &&
    user.role !== "admin"
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  //  Only certain booking states allowed
  if (!["PENDING_PAYMENT", "CONFIRMED"].includes(booking.bookingState)) {
    const err = new Error("Booking cannot be cancelled");
    err.statusCode = 400;
    throw err;
  }

  // Cannot cancel after booking start
  const now = new Date();
  if (now >= booking.startTime) {
    const err = new Error("Cannot cancel after booking has started");
    err.statusCode = 400;
    throw err;
  }

  // Refund logic if payment was completed
  if (booking.paymentState === "PAID") {

    const refund = await paymentService.refundPayment(booking);

    if (refund) {

      const expectedFullRefund = booking.totalPrice * 100;

      booking.paymentState =
        refund.amount >= expectedFullRefund
          ? "REFUNDED"
          : "PARTIALLY_REFUNDED";

    } else {
      // No refund applied
      booking.paymentState = "PAID"; 
    }
  }

booking.bookingState = "CANCELLED";
await booking.save();

  return booking;
};

