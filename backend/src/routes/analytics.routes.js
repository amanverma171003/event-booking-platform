const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  getOverview,
  getRevenuePerVenue,
  getMonthlyRevenue,
  getBookingStatusStats
} = require("../controllers/analytics.controller");

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/overview", getOverview);
router.get("/revenue-per-venue", getRevenuePerVenue);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/booking-stats", getBookingStatusStats);

module.exports = router;