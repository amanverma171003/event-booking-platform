const venueService = require("../services/venue.service");
const availabilityService = require("../services/availablity.service");

exports.createVenue = async (req, res, next) => {
  try {
    const venue = await venueService.createVenue(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllVenues = async (req, res, next) => {
  try {
    const result = await venueService.getAllVenues(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

exports.getVenueById = async (req, res, next) => {
  try {
    const venue = await venueService.getVenueById(req.params.id);
    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    next(error);
  }
};

exports.updateVenueStatus = async (req, res, next) => {
  try {
    const venue = await venueService.updateVenueStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    next(error);
  }
};

exports.updateVenue = async (req, res, next) => {
  try {
    const venue = await venueService.updateVenue(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVenue = async (req, res, next) => {
  try {
    await venueService.softDeleteVenue(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {

    const data = await availabilityService.getAvailability(
      req.params.venueId,
      req.query.date
    );

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

