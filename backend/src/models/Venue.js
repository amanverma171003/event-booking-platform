const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      state: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      area: {
        type: String,
        trim: true,
      },

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
      index: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    // Structured amenities (better than string array)
    amenities: {
      parking: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      rooms: { type: Number, default: 0 },
      dj: { type: Boolean, default: false },
      decoration: { type: Boolean, default: false },
    },

    images: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Admin approval system
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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


// INDEXES

// Geo search
venueSchema.index({ "location.coordinates": "2dsphere" });

// Search optimization
venueSchema.index({
  "location.city": 1,
  pricePerHour: 1,
  capacity: 1,
  status: 1,
});

venueSchema.index({ owner: 1 });

module.exports = mongoose.model("Venue", venueSchema);

