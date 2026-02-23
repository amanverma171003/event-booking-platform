const User = require("../models/User");

exports.getAllUsers = async () => {
  return User.find().select("-password");
};

exports.updateUserStatus = async (userId, status) => {

  if (!["ACTIVE", "SUSPENDED"].includes(status)) {
    const err = new Error("Invalid status");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  user.status = status;
  await user.save();

  return user;
};