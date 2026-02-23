const vendorService = require("../services/vendor.service");

exports.createVendorProfile = async (req, res, next) => {
  try {

    const profile = await vendorService.createVendorProfile(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: profile
    });

  } catch (err) {
    next(err);
  }
};



exports.getVendorProfile = async (req, res, next) => {
  try {

    const profile = await vendorService.getVendorProfile(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (err) {
    next(err);
  }
};



exports.updateVendorProfile = async (req, res, next) => {
  try {

    const profile = await vendorService.updateVendorProfile(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (err) {
    next(err);
  }
};