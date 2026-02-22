const Booking = require("../models/Booking");
const mongoose = require("mongoose");

exports.getPlatformOverview = async () => {

  const overview = await Booking.aggregate([
    {
      $match: {
        bookingState: "CONFIRMED"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalBookings: { $sum: 1 }
      }
    }
  ]);

  return overview[0] || { totalRevenue: 0, totalBookings: 0 };
};

exports.getRevenuePerVenue = async () => {

  return Booking.aggregate([
    { $match: { bookingState: "CONFIRMED" } },
    {
      $group: {
        _id: "$venue",
        revenue: { $sum: "$totalPrice" },
        bookings: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "venues",
        localField: "_id",
        foreignField: "_id",
        as: "venue"
      }
    },
    { $unwind: "$venue" },
    {
      $project: {
        venueName: "$venue.name",
        revenue: 1,
        bookings: 1
      }
    },
    { $sort: { revenue: -1 } }
  ]);
};

exports.getMonthlyRevenue = async () => {

  return Booking.aggregate([
    { $match: { bookingState: "CONFIRMED" } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        revenue: { $sum: "$totalPrice" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
};

exports.getBookingStatusStats = async () => {

  return Booking.aggregate([
    {
      $group: {
        _id: "$bookingState",
        count: { $sum: 1 }
      }
    }
  ]);
};