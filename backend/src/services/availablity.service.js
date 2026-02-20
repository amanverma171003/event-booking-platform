const Booking = require("../models/Booking");
const mongoose = require("mongoose");

exports.getAvailability = async (venueId, date) => {

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  if (!date) {
    const err = new Error("Date is required");
    err.statusCode = 400;
    throw err;
  }

  const selectedDate = new Date(date);

  const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999));

  const bookings = await Booking.find({
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
      {
        startTime: { $lt: endOfDay },
        endTime: { $gt: startOfDay }
      }
    ]
  }).select("startTime endTime");

  return bookings;
};