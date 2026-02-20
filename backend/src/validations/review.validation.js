const Joi = require("joi");

exports.createReviewSchema = Joi.object({
  bookingId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow("").optional()
});

exports.venueIdParamSchema = Joi.object({
  venueId: Joi.string().required()
});

exports.reviewIdParamSchema = Joi.object({
  reviewId: Joi.string().required()
});