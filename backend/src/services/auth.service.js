const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Otp = require("../models/Otp");
const EmailOtp = require("../models/EmailOtp");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const otpTemplate = require("../mailTemplates/otpVerify");


// SEND EMAIL OTP (Signup)
exports.sendEmailOtp = async (email) => {
  if (!email) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User already registered");
    err.statusCode = 409;
    throw err;
  }

  await EmailOtp.deleteMany({ email });

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await EmailOtp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
  });

  const htmlContent = otpTemplate(otp);
  await sendEmail(email, "Your Registration OTP", htmlContent);

  return true;
};


// VERIFY EMAIL OTP
exports.verifyEmailOtp = async (email, otp) => {
  if (!email || !otp) {
    const err = new Error("Email and OTP are required");
    err.statusCode = 400;
    throw err;
  }

  const otpRecord = await EmailOtp.findOne({ email });

  if (!otpRecord) {
    const err = new Error("Invalid or expired OTP");
    err.statusCode = 400;
    throw err;
  }

  if (otpRecord.expiresAt < new Date()) {
    await EmailOtp.deleteMany({ email });

    const err = new Error("OTP expired. Please request a new one.");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);

  if (!isMatch) {
    otpRecord.attempts += 1;

    if (otpRecord.attempts >= 5) {
      await EmailOtp.deleteMany({ email });

      const err = new Error(
        "Too many incorrect attempts. Please request a new OTP."
      );
      err.statusCode = 400;
      throw err;
    }

    await otpRecord.save();

    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  await EmailOtp.deleteMany({ email });

  return true;
};


// COMPLETE REGISTRATION
exports.completeRegistration = async ({ name, email, password, mobile }) => {
  if (!name || !email || !password) {
    const err = new Error("Required fields missing");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


// SEND MOBILE OTP (Login)
exports.sendMobileOtp = async (mobile) => {
  if (!mobile) {
    const err = new Error("Mobile number required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ mobile });
  if (!user) {
    const err = new Error(
      "User not registered. Please sign up with email."
    );
    err.statusCode = 400;
    throw err;
  }

  await Otp.deleteMany({ mobile });

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.create({
    mobile,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
  });

  // Replace with real SMS provider
  console.log("Mobile OTP:", otp);

  return true;
};


// VERIFY MOBILE OTP (Login)
exports.verifyMobileOtp = async (mobile, otp) => {
  if (!mobile || !otp) {
    const err = new Error("Mobile and OTP are required");
    err.statusCode = 400;
    throw err;
  }

  const otpRecord = await Otp.findOne({ mobile });

  if (!otpRecord) {
    const err = new Error("Invalid or expired OTP");
    err.statusCode = 400;
    throw err;
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteMany({ mobile });

    const err = new Error("OTP expired. Please request a new one.");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);

  if (!isMatch) {
    otpRecord.attempts += 1;

    if (otpRecord.attempts >= 5) {
      await Otp.deleteMany({ mobile });

      const err = new Error(
        "Too many incorrect attempts. Please request a new OTP."
      );
      err.statusCode = 400;
      throw err;
    }

    await otpRecord.save();

    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ mobile });

  if (!user) {
    await Otp.deleteMany({ mobile });

    const err = new Error(
      "User not registered. Please sign up with email."
    );
    err.statusCode = 400;
    throw err;
  }

  await Otp.deleteMany({ mobile });

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// EMAIL LOGIN
exports.loginWithEmail = async (email, password) => {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  if (user.status === "SUSPENDED") {
    const err = new Error("Account suspended. Contact support.");
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// GET CURRENT USER
exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};


// LOGOUT (Stateless JWT)

exports.logout = async () => {
  return true;
};
