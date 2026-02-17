const jwt = require("jsonwebtoken");

const generateToken = (userId) => {

  // sign with jwt secret
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
