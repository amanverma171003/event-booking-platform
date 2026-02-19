exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error("Forbidden: insufficient permissions");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};
