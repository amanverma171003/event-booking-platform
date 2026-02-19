const Venue = require("../models/Venue");
const mongoose = require("mongoose");

exports.createVenue = async (data, user) => {
  const venue = await Venue.create({
    name: data.name,
    description: data.description,

    location: {
      city: data.city,
      state: data.state,
      address: data.address,
      area: data.area,
      coordinates: {
        type: "Point",
        coordinates: [data.longitude, data.latitude], // long, lat
      },
    },

    capacity: data.capacity,
    pricePerHour: data.pricePerHour,
    amenities: data.amenities || {},
    images: data.images || [],

    owner: user.id,
  });

  return venue;
};

exports.getAllVenues = async (query) => {
  const {
    city,
    minPrice,
    maxPrice,
    minCapacity,
    page = 1,
    limit = 10,
  } = query;

  const filter = {
    status: "approved",
    isActive: true,
  };

  if (city) {
    filter["location.city"] = city;
  }

  if (minCapacity) {
    filter.capacity = { $gte: Number(minCapacity) };
  }

  if (minPrice || maxPrice) {
    filter.pricePerHour = {};
    if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;

  const venues = await Venue.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Venue.countDocuments(filter);

  return {
    venues,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

exports.getVenueById = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  const venue = await Venue.findById(id);

  if (!venue || !venue.isActive || venue.status !== "approved") {
    const err = new Error("Venue not found");
    err.statusCode = 404;
    throw err;
  }

  return venue;
};

exports.updateVenueStatus = async (id, status) => {
  const venue = await Venue.findById(id);

  if (!venue) {
    const err = new Error("Venue not found");
    err.statusCode = 404;
    throw err;
  }

  venue.status = status;
  await venue.save();

  return venue;
};

exports.updateVenue = async (id, data, user) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  const venue = await Venue.findById(id);

  if (!venue) {
    const err = new Error("Venue not found");
    err.statusCode = 404;
    throw err;
  }

  if (
    venue.owner.toString() !== user.id &&
    user.role !== "admin"
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (data.name) venue.name = data.name;
  if (data.description) venue.description = data.description;

  if (data.city) venue.location.city = data.city;
  if (data.state) venue.location.state = data.state;
  if (data.address) venue.location.address = data.address;
  if (data.area) venue.location.area = data.area;

  if (data.capacity) venue.capacity = data.capacity;
  if (data.pricePerHour) venue.pricePerHour = data.pricePerHour;

  if (data.amenities) venue.amenities = data.amenities;
  if (data.images) venue.images = data.images;

  if (data.latitude && data.longitude) {
    venue.location.coordinates = {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    };
  }

  // Reset approval if owner edits approved venue
  if (user.role === "owner" && venue.status === "approved") {
    venue.status = "pending";
  }

  await venue.save();

  return venue;
};

exports.softDeleteVenue = async (id, user) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid venue ID");
    err.statusCode = 400;
    throw err;
  }

  const venue = await Venue.findById(id);

  if (!venue) {
    const err = new Error("Venue not found");
    err.statusCode = 404;
    throw err;
  }

  if (
    venue.owner.toString() !== user.id &&
    user.role !== "admin"
  ) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  venue.isActive = false;
  await venue.save();

  return true;
};

