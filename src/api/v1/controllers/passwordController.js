const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");

// import models here
// const User = require("../models/User");
const User = require("../models/User");

// import utils here
const { sendEmail, sendSMS } = require("../../../utils/sendMessage");
/*
validate phone
edge case, user sends +91- this, time instead of 10 digits
maybe create a switch statement for normalization from different countries
keep updating switch cases as per user request requirement
written below CONTROLLERS
*/

// Reset Password and Change Password
//this controller will handle if we have to send an email or SMS and verify them.
// getEmailOrPhoneFP
const forgotPassword = expressAsyncHandler(async (req, res) => {
  // change variable name
  const { email, phone } = req.body;
  const user = await User.findOne({ email }); // find with either email or phone

  if (!user) {
    res.status(404);

    throw new Error("User not found please register");
  }

  try {
    const token = await user.getPasswordResetToken();

    await user.save();

    const resetUrl = `Hi Please follow this link to reset your password. 
      <a href="http://localhost:3000/users/reset-password/${token}">Click here</a>. 
      <br />
      Regards, <br/>
      ShopSphere`;
    //

    if (email) {
      // send OTP through email
      const options = {
        email: email,
        subject: `Link for Password reset`,
        message: "hers is the link",
        htm: resetUrl,
      };
      sendEmail(options, res);
    }

    if (phone) {
      // send URL through message

      const options = {
        phone: phone,
        otp: resetUrl,
      };
      sendSMS(options, res);
    }
  } catch (err) {
    res.status(400);

    throw new Error(err ? err.message : "Something went wrong");
  }
});

//this controller will when user sends there new password
const resetPassword = expressAsyncHandler(async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const token = req.params.token;

  console.log("token is ", token);
  console.log("here");
  const hashedToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex"); // not running
  console.log("now here");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
  });

  if (!user) {
    throw new Error("Token expired, Please try again later");
  }

  if (!password || !confirmPassword) {
    res.status(400);

    throw new Error("Please enter all the fields");
  }

  if (password !== confirmPassword) {
    res.status(400);

    throw new Error("Confirm password doesn't match");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  let new_user = await User.findOne({ email: user.email }).select("-password");
  return res.status(200).json({
    message: "Password has been rest please login",
  });
});

//this controller will when user change there password while loggedIn
// changePassword
const updatePassword = expressAsyncHandler(async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  // check if all fields available
  if (!newPassword || !confirmPassword || !currentPassword) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // check  if passwords match
  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("New password and confirm password doesn't match");
  }

  // find user for password change
  const user = await User.findOne({
    _id: req.user._id
  });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // check for current password to match
  const isValidPassword = await user.isPasswordMatched(
    currentPassword,
    user.password
  );
  if (!isValidPassword) {
    res.status(400);
    throw new Error("Invalid current password");
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error("New Password can't be the same as old password");
  }

  // change password and save user
  user.password = newPassword;
  await user.save();

  // Convert the user to a plain object and exclude the password
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return res.status(200).json({
    message: "Password has been changed.",
    user: userWithoutPassword,
  });
});

module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword,
};
