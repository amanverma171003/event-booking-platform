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


