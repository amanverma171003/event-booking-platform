const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  sendOtp,
  verifyOtp
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
} = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");
const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

router.post("/send-otp", sendOtpValidator, validate, sendOtp);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);

router.get("/me", protect, getMe);
router.post("/logout", logout);


module.exports = router;
