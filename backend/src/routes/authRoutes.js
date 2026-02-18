const express = require("express");
const router = express.Router();

const {
  sendEmailOtp,
  verifyEmailOtp,
  completeRegistration,
  login,
  sendOtp,
  verifyOtp,
  getMe,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate.middleware");
const { otpLimiter, loginLimiter } = require("../middleware/rateLimiter");

const {
  sendEmailOtpSchema,
  verifyEmailOtpSchema,
  completeRegistrationSchema,
  loginSchema,
  sendMobileOtpSchema,
  verifyMobileOtpSchema,
} = require("../validations/auth.validation");


// EMAIL REGISTRATION FLOW

// Send Email OTP
router.post(
  "/send-email-otp",
  otpLimiter,
  validate(sendEmailOtpSchema),
  sendEmailOtp
);

// Verify Email OTP
router.post(
  "/verify-email-otp",
  validate(verifyEmailOtpSchema),
  verifyEmailOtp
);

// Complete Registration
router.post(
  "/complete-registration",
  validate(completeRegistrationSchema),
  completeRegistration
);


// LOGIN FLOW

// Email + Password Login
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  login
);

// Send Mobile OTP
router.post(
  "/send-otp",
  otpLimiter,
  validate(sendMobileOtpSchema),
  sendOtp
);

// Verify Mobile OTP
router.post(
  "/verify-otp",
  validate(verifyMobileOtpSchema),
  verifyOtp
);

// USER SESSION
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;


