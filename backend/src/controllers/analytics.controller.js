const analyticsService = require("../services/analytics.service");

exports.getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getPlatformOverview();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getRevenuePerVenue = async (req, res, next) => {
  try {
    const data = await analyticsService.getRevenuePerVenue();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getMonthlyRevenue = async (req, res, next) => {
  try {
    const data = await analyticsService.getMonthlyRevenue();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getBookingStatusStats = async (req, res, next) => {
  try {
    const data = await analyticsService.getBookingStatusStats();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};