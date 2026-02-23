const Joi = require("joi");

exports.createVendorProfileSchema = Joi.object({
  businessName: Joi.string().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  bankDetails: Joi.object({
    accountHolderName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required()
  }).required()
});

exports.updateVendorProfileSchema = Joi.object({
  businessName: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  bankDetails: Joi.object({
    accountHolderName: Joi.string().optional(),
    accountNumber: Joi.string().optional(),
    ifscCode: Joi.string().optional()
  }).optional()
});