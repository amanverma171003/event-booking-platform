const bookingSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
      index: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed"],
      default: "pending",
      index: true,
    },

    paymentId: {
      type: String,
    },

  },
  { timestamps: true }
);

bookingSchema.index({ venue: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
