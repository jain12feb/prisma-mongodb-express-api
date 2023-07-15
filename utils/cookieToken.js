const getJwtToken = require("../helper/getJwtToken");

const cookieToken = (user, res, code, message) => {
  delete user.password;
  const token = getJwtToken(user);
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(code)
    .cookie("token", token, options)
    .json({
      success: true,
      message: message || undefined,
      token,
      user,
    });
};

module.exports = cookieToken;
