const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const EmailOtp = require("../models/EmailOtp");
const sendEmail = require("../utils/sendEmail");


// send email otp
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    await EmailOtp.deleteMany({ email });

    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailOtp.create({
      email,
      otp,
      expiresAt,
    });

    await sendEmail(
      email,
      "Your Registration OTP",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// send otp
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    await Otp.deleteMany({ mobile });

    const otp = generateOtp();

    // send otp here 


    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      mobile,
      otp,
      expiresAt,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify otp
exports.verifyOtp = async (req, res) => {
  try {

    // get from body and validate them
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP required" });
    }

    // find otp in record
    const otpRecord = await Otp.findOne({ mobile, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    // logic for expired otp
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // create user if doesnt exist
    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        mobile,
        role: "user",
      });
    }

    // generate token
    const token = generateToken(user._id);

    // delete the active otp
    await Otp.deleteMany({ mobile });

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REGISTER
exports.register = async (req, res) => {
  try {

    //get feilds form req body and validate
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ME
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


// LOGOUT 
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
