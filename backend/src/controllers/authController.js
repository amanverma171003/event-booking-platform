const authService = require("../services/auth.service");

// SEND EMAIL OTP (Signup)
exports.sendEmailOtp = async (req, res, next) => {
  try {
    await authService.sendEmailOtp(req.body.email);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};


// VERIFY EMAIL OTP
exports.verifyEmailOtp = async (req, res, next) => {
  try {
    await authService.verifyEmailOtp(
      req.body.email,
      req.body.otp
    );

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


// COMPLETE REGISTRATION
exports.completeRegistration = async (req, res, next) => {
  try {
    const result = await authService.completeRegistration(req.body);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// SEND MOBILE OTP (Login)
exports.sendOtp = async (req, res, next) => {
  try {
    await authService.sendMobileOtp(req.body.mobile);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY MOBILE OTP (Login)
exports.verifyOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyMobileOtp(
      req.body.mobile,
      req.body.otp
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


// EMAIL LOGIN
exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginWithEmail(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT USER
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


// LOGOUT (Stateless)
exports.logout = async (req, res, next) => {
  try {
    await authService.logout();

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};


