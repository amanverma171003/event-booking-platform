const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getMyBookings,
  getUpcomingBookings,
  getPastBookings,
  getMyPayments,
  updateProfile
} = require("../controllers/user.controller");

router.use(protect);

router.get("/me/bookings", getMyBookings);
router.get("/me/bookings/upcoming", getUpcomingBookings);
router.get("/me/bookings/past", getPastBookings);
router.get("/me/payments", getMyPayments);
router.patch("/me/profile", updateProfile);

module.exports = router;