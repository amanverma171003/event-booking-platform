const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  getAllVendors,
  updateVendorKycStatus
} = require("../controllers/admin.vendor.controller");

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/vendors", getAllVendors);

router.patch("/vendors/:vendorId/kyc", updateVendorKycStatus);

module.exports = router;