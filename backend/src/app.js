const express = require("express");
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venue.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const { errorHandler } = require("./middleware/error.middleware");
const reviewRoutes = require("./routes/review.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const userRoutes = require("./routes/user.routes");
const vendorRoutes = require("./routes/vendor.routes");
const adminVendorRoutes = require("./routes/admin.vendor.routes");
const adminUserRoutes = require("./routes/admin.user.routes");

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

// analytics routes
app.use("/api/admin/analytics", analyticsRoutes);

// user routes
app.use("/api/users", userRoutes);

// vendor routes
app.use("/api/vendor", vendorRoutes);

// admin vendor routes
app.use("/api/admin", adminVendorRoutes);

// admin user routes
app.use("/api/admin", adminUserRoutes);

// landing page route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

app.use(errorHandler);

module.exports = app;
