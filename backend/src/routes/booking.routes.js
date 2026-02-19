const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate.middleware");

const { createBooking,getMyBookings, cancelBooking } = require("../controllers/booking.controller");
const { createBookingSchema } = require("../validations/booking.validation");

router.post(
  "/",
  protect,
  validate(createBookingSchema),
  createBooking
);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.patch(
  "/:id/cancel",
  protect,
  cancelBooking
);



module.exports = router;
