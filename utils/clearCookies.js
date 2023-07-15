const clearCookies = (res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.status(200).cookie("token", "", options).json({
    success: true,
    message: "Logout Successfully!",
  });
};

module.exports = clearCookies;
