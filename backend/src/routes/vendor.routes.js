const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate.middleware");

const {getMyAnalytics} = require("../controllers/vendor.analytics.controller");

const {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile
} = require("../controllers/vendor.controller");

const {
  createVendorProfileSchema,
  updateVendorProfileSchema
} = require("../validations/vendor.validation");

router.use(protect);

// Create vendor profile
router.post(
  "/profile",
  validate(createVendorProfileSchema),
  createVendorProfile
);

// Get vendor profile
router.get(
  "/profile",
  getVendorProfile
);

// get vendor analytics
router.get("/analytics", getMyAnalytics);

// Update vendor profile
router.patch(
  "/profile",
  validate(updateVendorProfileSchema),
  updateVendorProfile
);

module.exports = router;