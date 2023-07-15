const router = require("express").Router();
const {
  signUp,
  login,
  logout,
  profile,
  changePassword,
} = require("../controllers/user");
const isLoggedin = require("../middlewares/isLoggedIn");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedin, profile);
router.post("/change-password", isLoggedin, changePassword);

module.exports = router;
