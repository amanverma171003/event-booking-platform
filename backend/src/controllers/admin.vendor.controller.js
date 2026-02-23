const vendorService = require("../services/vendor.service");

exports.getAllVendors = async (req, res, next) => {
  try {

    const vendors = await vendorService.getAllVendors();

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });

  } catch (err) {
    next(err);
  }
};



exports.updateVendorKycStatus = async (req, res, next) => {
  try {

    const vendor = await vendorService.updateVendorKycStatus(
      req.params.vendorId,
      req.body.kycStatus
    );

    res.status(200).json({
      success: true,
      data: vendor
    });

  } catch (err) {
    next(err);
  }
};