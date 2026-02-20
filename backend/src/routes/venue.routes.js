const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validate.middleware");

const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenueStatus,
  updateVenue,
  deleteVenue, 
  getAvailability
} = require("../controllers/venue.controller");

const { createVenueSchema, updateStatusSchema, updateVenueSchema } = require("../validations/venue.validation");

// Create Venue
router.post(
  "/",
  protect,
  authorizeRoles("admin", "owner"),
  validate(createVenueSchema),
  createVenue
);

router.get("/", getAllVenues);

router.get("/:id", getVenueById);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  validate(updateStatusSchema),
  updateVenueStatus
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "owner"),
  validate(updateVenueSchema),
  updateVenue
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "owner"),
  deleteVenue
);

router.get(
  "/:venueId/availability",
  getAvailability
);

module.exports = router;
