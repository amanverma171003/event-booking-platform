const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      city: { type: String, required: true },
      state: { type: String },
      address: { type: String },
      area: { type: String },

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          // [longitude, latitude]
          type: [Number], 
          required: true,
        },
      },
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// indexing for faster queries
venueSchema.index({ "location.coordinates": "2dsphere" });

venueSchema.index({
  "location.city": 1,
  pricePerHour: 1,
  capacity: 1,
});

venueSchema.index({ owner: 1 });
