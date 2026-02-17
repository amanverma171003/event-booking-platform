const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_mode: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
