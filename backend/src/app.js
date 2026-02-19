const express = require("express");
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venue.routes");
const { errorHandler } = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/auth", authRoutes);

// venue routes
app.use("/api/venues", venueRoutes);

// landing page route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

app.use(errorHandler);

module.exports = app;
