const VendorProfile = require("../models/VendorProfile");
const User = require("../models/User");

exports.createVendorProfile = async (userId, data) => {

  // Ensure user exists and is owner
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (user.role !== "owner") {
    const err = new Error("Only owners can create vendor profile");
    err.statusCode = 403;
    throw err;
  }

  // Prevent duplicate profile
  const existing = await VendorProfile.findOne({ user: userId });

  if (existing) {
    const err = new Error("Vendor profile already exists");
    err.statusCode = 400;
    throw err;
  }

  const profile = await VendorProfile.create({
    user: userId,
    ...data
  });

  return profile;
};



exports.getVendorProfile = async (userId) => {

  const profile = await VendorProfile
    .findOne({ user: userId })
    .populate("user", "name email role");

  if (!profile) {
    const err = new Error("Vendor profile not found");
    err.statusCode = 404;
    throw err;
  }

  return profile;
};



exports.updateVendorProfile = async (userId, data) => {

  const profile = await VendorProfile.findOne({ user: userId });

  if (!profile) {
    const err = new Error("Vendor profile not found");
    err.statusCode = 404;
    throw err;
  }

  const allowedFields = [
    "businessName",
    "phone",
    "address",
    "bankDetails"
  ];

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      profile[field] = data[field];
    }
  });

  await profile.save();

  return profile;
};



exports.getAllVendors = async () => {
  return VendorProfile.find()
    .populate("user", "name email role");
};



exports.updateVendorKycStatus = async (vendorId, status) => {

  const allowedStatuses = ["PENDING", "VERIFIED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    const err = new Error("Invalid KYC status");
    err.statusCode = 400;
    throw err;
  }

  const vendor = await VendorProfile.findById(vendorId);

  if (!vendor) {
    const err = new Error("Vendor not found");
    err.statusCode = 404;
    throw err;
  }

  vendor.kycStatus = status;
  await vendor.save();

  return vendor;
};