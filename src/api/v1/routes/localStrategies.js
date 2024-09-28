const express = require("express");
const router = express.Router();
// include controllers and middlewares
// const {
//   simpleLoginUser,
// } = require("../controllers/userController");

const {
  sendOTP,
  validateOTP,
  createUser,
  login,
  sendGuestOTP,
  validateGuestOTP,
} = require("../controllers/localController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/register/send-otp", sendOTP);
router.post("/register/validate-otp", validateOTP);
router.post("/register/create-user", createUser);

router.post("/login", login); // http://localhost:3000/api/v1/auth/local/login

router.post("/sso/send-otp", sendGuestOTP); // http://localhost:3000/api/v1/auth/local/sso
router.post("/sso/validate-otp", validateGuestOTP); // http://localhost:3000/api/v1/auth/local/sso

module.exports = router;
