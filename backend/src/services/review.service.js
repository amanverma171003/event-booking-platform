const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Venue = require("../models/Venue");

exports.createReview = async (user, { bookingId, rating, comment }) => {

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

  // Must belong to user
  if (booking.user.toString() !== user.id) {
    const err = new Error("Unauthorized");
    err.statusCode = 403;
    throw err;
  }

  // Must be confirmed
  if (booking.bookingState !== "CONFIRMED") {
    const err = new Error("Only confirmed bookings can be reviewed");
    err.statusCode = 400;
    throw err;
  }

  // Must be completed
  if (new Date() < booking.endTime) {
    const err = new Error("Cannot review before event completion");
    err.statusCode = 400;
    throw err;
  }

  // Prevent duplicate review
  const existing = await Review.findOne({ booking: bookingId });
  if (existing) {
    const err = new Error("Review already submitted");
    err.statusCode = 400;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const review = await Review.create(
      [{
        venue: booking.venue,
        user: user.id,
        booking: bookingId,
        rating,
        comment
      }],
      { session }
    );

    // Recalculate venue rating
    const stats = await Review.aggregate([
      { $match: { venue: booking.venue } },
      {
        $group: {
          _id: "$venue",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]).session(session);

    await Venue.findByIdAndUpdate(
      booking.venue,
      {
        rating: stats[0].avgRating,
        reviewCount: stats[0].reviewCount
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return review[0];

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getVenueReviews = async (venueId) => {

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  const reviews = await Review.find({ venue: venueId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

exports.deleteReview = async (reviewId, user) => {

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    const err = new Error("Invalid review ID");
    err.statusCode = 400;
    throw err;
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    const err = new Error("Review not found");
    err.statusCode = 404;
    throw err;
  }

  if (
    review.user.toString() !== user.id &&
    user.role !== "admin"
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    await review.deleteOne({ session });

    const stats = await Review.aggregate([
      { $match: { venue: review.venue } },
      {
        $group: {
          _id: "$venue",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]).session(session);

    if (stats.length > 0) {
      await Venue.findByIdAndUpdate(
        review.venue,
        {
          rating: stats[0].avgRating,
          reviewCount: stats[0].reviewCount
        },
        { session }
      );
    } else {
      await Venue.findByIdAndUpdate(
        review.venue,
        { rating: 0, reviewCount: 0 },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return true;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};