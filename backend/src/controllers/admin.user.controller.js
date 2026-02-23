const adminUserService = require("../services/admin.user.service");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminUserService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {

    const user = await adminUserService.updateUserStatus(
      req.params.userId,
      req.body.status
    );

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    next(err);
  }
};