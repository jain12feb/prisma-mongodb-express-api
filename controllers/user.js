const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const cookieToken = require("../utils/cookieToken");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please Provide all fields" });

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res
        .status(200)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });
    // create a token and set it in the cookies for authentication purposes
    cookieToken(user, res, 201, "Successfully Registered!");
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please Provide all fields" });

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      cookieToken(user, res, 200, "Successfully Login!");
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Password Does Not Match" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No Profile Found!" });

    return res
      .status(200)
      .json({ success: true, message: "Profile Found!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout Successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
      select: {
        password: true,
      },
    });

    const oldPasswordMatch = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!oldPasswordMatch)
      return res.status(400).json({
        success: false,
        message: "Your Old Password is Incorrect!",
      });

    if (req.body.oldPassword === req.body.newPassword)
      return res.status(200).json({
        success: false,
        message: "Your New Password & Old Password cannot be Same",
      });

    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        email: req.user.email,
      },
      data: {
        password: newPassword,
      },
    });

    delete updatedUser.password;

    return res
      .status(200)
      .json({ success: true, message: "Password Updated!", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
