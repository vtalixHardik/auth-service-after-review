const express = require("express");
const router = express.Router();
// include controllers and middlewares
// const {
//   simpleLoginUser,
// } = require("../controllers/userController");

const {
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/passwordController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/forgot-password", forgotPassword); // http://localhost:3000/api/v1/auth/local/forgot-password
router.put("/reset-password/:token", resetPassword); // http://localhost:3000/api/v1/auth/local/change-password

router.post("/update-password", authMiddleware, updatePassword); // http://localhost:3000/api/v1/auth/local/change-password

module.exports = router;
