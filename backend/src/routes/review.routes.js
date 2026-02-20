const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {validate} = require("../middleware/validate.middleware");
const {
  createReviewSchema,
  venueIdParamSchema,
  reviewIdParamSchema
} = require("../validations/review.validation");

const {
  createReview,
  getVenueReviews,
  deleteReview
} = require("../controllers/review.controller");


// Create Review
router.post(
  "/",
  protect,
  validate(createReviewSchema),
  createReview
);

// Get Reviews for Venue
router.get(
  "/venue/:venueId",
  validate(venueIdParamSchema, "params"),
  getVenueReviews
);

// Delete Review
router.delete(
  "/:reviewId",
  protect,
  validate(reviewIdParamSchema, "params"),
  deleteReview
);

module.exports = router;