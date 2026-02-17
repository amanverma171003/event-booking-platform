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
const { validate } = require("../middleware/validationMiddleware");
const { otpLimiter, loginLimiter } = require("../middleware/rateLimiter");

const {
  sendEmailOtpValidator,
  verifyEmailOtpValidator,
  completeRegistrationValidator,
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
} = require("../validators/authValidator");



// EMAIL REGISTRATION FLOW

// Send Email OTP
router.post(
  "/send-email-otp",
  otpLimiter,
  sendEmailOtpValidator,
  validate,
  sendEmailOtp
);


// Verify Email OTP
router.post(
  "/verify-email-otp",
  verifyEmailOtpValidator,
  validate,
  verifyEmailOtp
);

// Complete Registration
router.post(
  "/complete-registration",
  completeRegistrationValidator,
  validate,
  completeRegistration
);


// LOGIN FLOW

// Email + Password Login
router.post(
  "/login",
  loginLimiter,
  loginValidator,
  validate,
  login
);


// Mobile OTP Login 
router.post(
  "/send-otp",
  otpLimiter,
  sendOtpValidator,
  validate,
  sendOtp
);


// Mobile OTP Login 
router.post(
  "/verify-otp",
  verifyOtpValidator,
  validate,
  verifyOtp
);


// USER SESSION
router.get("/me", protect, getMe);
router.post("/logout", logout);


module.exports = router;

