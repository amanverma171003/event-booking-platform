const Joi = require("joi");

// SEND EMAIL OTP
exports.sendEmailOtpSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid email format",
    }),
});


// VERIFY EMAIL OTP
exports.verifyEmailOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(), 
});


// COMPLETE REGISTRATION
exports.completeRegistrationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

// SEND MOBILE OTP
exports.sendMobileOtpSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

// VERIFY MOBILE OTP
exports.verifyMobileOtpSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  otp: Joi.string().length(6).required(),
});

// LOGIN WITH EMAIL
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
