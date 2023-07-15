const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

const isLoggedin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You must be Loggen In!",
      });
    }

    let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user;
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error?.message || error }); // not logged in or expired JWT token
  }
};

module.exports = isLoggedin;
