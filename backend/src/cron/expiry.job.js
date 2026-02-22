const cron = require("node-cron");
const Booking = require("../models/Booking");

const runExpiryJob = () => {

  cron.schedule("*/1 * * * *", async () => {
    console.log("Running expiry job...");

    const now = new Date();

    const result = await Booking.updateMany(
      {
        bookingState: "PENDING_PAYMENT",
        expiresAt: { $lt: now }
      },
      {
        bookingState: "EXPIRED",
        paymentState: "FAILED"
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Expired ${result.modifiedCount} bookings`);
    }
  });

};

module.exports = runExpiryJob;
