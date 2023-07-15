const jwt = require("jsonwebtoken");

const getJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "1h", // token will expire in an hour
  });
};

module.exports = getJwtToken;
