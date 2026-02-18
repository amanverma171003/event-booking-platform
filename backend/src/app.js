const express = require("express");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// landing page route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

app.use(errorHandler);

module.exports = app;
