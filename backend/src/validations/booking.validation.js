const Joi = require("joi");

exports.createBookingSchema = Joi.object({
  venueId: Joi.string().required(),

  startTime: Joi.date().required(),

  endTime: Joi.date()
    .greater(Joi.ref("startTime"))
    .required(),
});
