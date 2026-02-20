const reviewService = require("../services/review.service");

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(
      req.user,
      req.body
    );

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    next(error);
  }
};

exports.getVenueReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getVenueReviews(
      req.params.venueId
    );

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(
      req.params.reviewId,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Review deleted"
    });

  } catch (error) {
    next(error);
  }
};