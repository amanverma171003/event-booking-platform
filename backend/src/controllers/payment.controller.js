const paymentService = require("../services/payment.service");

exports.createOrder = async (req, res, next) => {
  try {
    const result = await paymentService.createPaymentOrder(
      req.body.bookingId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const booking = await paymentService.verifyPayment(req.body);

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

exports.handleWebhook = async (req, res) => {
  const crypto = require("crypto");

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const event = JSON.parse(req.body);

  if (event.event === "payment.captured") {

    const orderId = event.payload.payment.entity.order_id;

    const booking = await Booking.findOne({ razorpayOrderId: orderId });

    if (booking && booking.status !== "confirmed") {
      booking.status = "confirmed";
      booking.paymentId = event.payload.payment.entity.id;
      await booking.save();
    }
  }

  res.status(200).json({ received: true });
};
