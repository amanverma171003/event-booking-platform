const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/payment.controller")
const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
