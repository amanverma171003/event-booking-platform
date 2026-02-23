const Booking = require("../models/Booking");
const Venue = require("../models/Venue");

exports.getVendorAnalytics = async (vendorId) => {

  const venues = await Venue.find({ owner: vendorId }).select("_id");

  const venueIds = venues.map(v => v._id);

  const stats = await Booking.aggregate([
    {
      $match: {
        venue: { $in: venueIds },
        bookingState: "COMPLETED"
      }
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        grossRevenue: { $sum: "$totalPrice" },
        totalPlatformFee: { $sum: "$platformFee" },
        totalVendorEarnings: { $sum: "$vendorEarning" },
        totalRefunds: { $sum: "$refundAmount" }
      }
    }
  ]);

  return stats[0] || {
    totalBookings: 0,
    grossRevenue: 0,
    totalPlatformFee: 0,
    totalVendorEarnings: 0,
    totalRefunds: 0
  };
};