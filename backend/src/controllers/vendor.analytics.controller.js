const vendorAnalyticsService = require("../services/vendor.analytics.service");

exports.getMyAnalytics = async (req, res, next) => {
  try {

    const data = await vendorAnalyticsService.getVendorAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};