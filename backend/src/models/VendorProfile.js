const mongoose = require("mongoose");

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    businessName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String
    },

    address: {
      type: String
    },

    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String
    },

    kycStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING"
    },

    commissionRate: {
      type: Number,
      // platform commission %
      default: 10 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorProfile", vendorProfileSchema);