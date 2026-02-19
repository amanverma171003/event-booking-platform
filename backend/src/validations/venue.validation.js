const Joi = require("joi");

// CREATE VENUE
exports.createVenueSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  description: Joi.string().max(1000).optional(),

  city: Joi.string().min(2).max(100).required(),

  state: Joi.string().max(100).optional(),

  address: Joi.string().min(5).max(300).required(),

  area: Joi.string().max(100).optional(),

  capacity: Joi.number().integer().min(1).required(),

  pricePerHour: Joi.number().min(0).required(),

  latitude: Joi.number().min(-90).max(90).required(),

  longitude: Joi.number().min(-180).max(180).required(),

  amenities: Joi.object({
    parking: Joi.boolean().optional(),
    ac: Joi.boolean().optional(),
    rooms: Joi.number().integer().min(0).optional(),
    dj: Joi.boolean().optional(),
    decoration: Joi.boolean().optional(),
  }).optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),
});


exports.updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("approved", "rejected")
    .required(),
});

exports.updateVenueSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),

  description: Joi.string().max(1000).optional(),

  city: Joi.string().min(2).max(100).optional(),

  state: Joi.string().max(100).optional(),

  address: Joi.string().min(5).max(300).optional(),

  area: Joi.string().max(100).optional(),

  capacity: Joi.number().integer().min(1).optional(),

  pricePerHour: Joi.number().min(0).optional(),

  latitude: Joi.number().min(-90).max(90).optional(),

  longitude: Joi.number().min(-180).max(180).optional(),

  amenities: Joi.object({
    parking: Joi.boolean().optional(),
    ac: Joi.boolean().optional(),
    rooms: Joi.number().integer().min(0).optional(),
    dj: Joi.boolean().optional(),
    decoration: Joi.boolean().optional(),
  }).optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),
});
