const Booking = require("../models/Booking");
const User = require("../models/User");

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("venue", "name location pricePerHour")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (err) {
    next(err);
  }
};


exports.getUpcomingBookings = async (req, res, next) => {
  try {
    const now = new Date();

    const bookings = await Booking.find({
      user: req.user.id,
      bookingState: "CONFIRMED",
      startTime: { $gt: now }
    })
      .populate("venue", "name location")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (err) {
    next(err);
  }
};


exports.getPastBookings = async (req, res, next) => {
  try {
    const now = new Date();

    const bookings = await Booking.find({
      user: req.user.id,
      endTime: { $lt: now }
    })
      .populate("venue", "name location")
      .sort({ endTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (err) {
    next(err);
  }
};


exports.getMyPayments = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      paymentState: { 
        $in: ["PAID", "REFUNDED", "PARTIALLY_REFUNDED"] 
      }
    })
      .select("venue totalPrice paymentState paymentId refundAmount createdAt")
      .populate("venue", "name");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (err) {
    next(err);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {

    const allowedFields = ["name", "mobile"];

    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    next(err);
  }
};
