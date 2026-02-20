const express = require("express");
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venue.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const { errorHandler } = require("./middleware/error.middleware");
const reviewRoutes = require("./routes/review.routes");

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// venue routes
app.use("/api/venues", venueRoutes);

// booking routes
app.use("/api/bookings", bookingRoutes);

// payment routes
app.use("/api/payments", paymentRoutes);

// review routes
app.use("/api/reviews", reviewRoutes);

// landing page route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

app.use(errorHandler);

module.exports = app;
