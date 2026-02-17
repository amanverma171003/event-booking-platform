const { body } = require("express-validator");

exports.registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain number"),

  body("mobile")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password required"),
];

exports.sendOtpValidator = [
  body("mobile")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
];

exports.verifyOtpValidator = [
  body("mobile")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

// SEND EMAIL OTP VALIDATOR
exports.sendEmailOtpValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];

// VERIFY EMAIL OTP VALIDATOR
exports.verifyEmailOtpValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

// COMPLETE REGISTRATION VALIDATOR
exports.completeRegistrationValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain number"),

  body("mobile")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
];
