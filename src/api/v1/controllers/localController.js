const expressAsyncHandler = require("express-async-handler");
const validator = require("validator");
const crypto = require("crypto");

// import models here
const User = require("../models/User");
const OTP = require("../models/OTP");
const Guest = require("../models/Guest");

// import utils here
// const { generateToken } = require("../config/jwtToken");
// const { sendEmail, sendSMS } = require("../utils/sendMessage");
const { generateToken } = require("../../../config/jwtToken");
const { sendEmail, sendSMS } = require("../../../utils/sendMessage");
// const { emailValidator } = require("../../../utils/emailValidator");

// written below Global Regex for Validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = null;

/*
validate phone
edge case, user sends +91- this, time instead of 10 digits
maybe create a switch statement for normalization from different countries
keep updating switch cases as per user request requirement
written below CONTROLLERS
*/

// OTP find and delete using AND

// Register
//this controller will handle if we have to send an email or SMS and verify them.
// getEmailOrPhone
const sendOTP = expressAsyncHandler(async (req, res) => {
    if (req.user) {
      res.status(400);
      throw new Error("User already logged in");
    }
    const { email, phone } = req.body;
  
    try {
      // validate req.body
      // checking if email or phone exist
      let user = await User.findOne({
        $or: [{ email: email }, { phone: phone }],
      });
      // console.log("User is ", user);
  
      // if user already exists
      if (user) {
        res.status(400);
  
        throw new Error("User Already exist please Log in");
      }
  
      const otp = crypto.randomInt(100000, 999999);
  
      if (email) {
        if (
          !email.includes("@") ||
          !emailRegex.test(email) ||
          !validator.isEmail(email)
        ) {
          res.status(400);
  
          throw new Error("Enter valid email");
        }
  
        // add `otp` in OTP table
        user = await OTP.create({
          email,
          otp,
        });
  
        // send OTP through email
        const options = {
          email: email,
          subject: `OTP for verfication`,
          message: `Your OTP is ${otp}`,
        };
        sendEmail(options, res);
      }
  
      if (phone) {
        // add `otp` in OTP table
        user = await OTP.create({
          phone,
          otp,
        });
        // send OTP through message
        console.log(typeof otp);
        const options = {
          phone: phone,
          otp: otp,
        };
        sendSMS(options, res);
      }
  
      // maybe create OTP after sending SMS or mail to reduce service size?
      /* 
      user = await OTP.create({
          phone,
          email,
          otp,
          verified: false
        }); 
      */
    } catch (err) {
      res.status(400);
  
      throw new Error(err ? err.message : "Something went wrong");
    }
  });
  
// this controller verifies OTP
//   getOtp
const validateOTP = expressAsyncHandler(async (req, res) => {
  try {
    const { otp, phone, email } = req.body;

    if (!otp) {
      res.status(400);

      throw new Error("Please Enter OTP");
    }

    // If registering through phone
    if (phone) {
      // validate phone
      // edge case, user sends +91- this, time instead of 10 digits
      // maybe create a switch statement for normalization from different countries
      // keep updating switch cases as per user request requirement
      const entry = await OTP.findOne({ phone });
      if (!entry) {
        res.status(400);

        throw new Error("Please request a new OTP.");
      }

      // Check if the OTP is expired
      const currentTime = new Date();
      if (currentTime > entry.expiry) {
        res.status(400);
        // delete OTP
        await OTP.deleteOne({ phone });

        throw new Error("OTP has expired. Please request a new one.");
      }

      if (otp === JSON.stringify(entry?.otp)) {
        await OTP.updateOne({ phone }, { verified: true });

        return res.status(200).json({
          success: true,
          message: "User verified",
          verified: true,
        });
      } else {
        res.status(400);

        throw new Error("Invalid OTP");
      }
    }

    // If registering through email
    if (email) {
      // validate email
      if (
        !email ||
        !email.includes("@") ||
        !emailRegex.test(email) ||
        !validator.isEmail(email)
      ) {
        res.status(400);

        throw new Error("Enter a valid Email");
      }
      const entry = await OTP.findOne({ email: email });

      if (!entry) {
        res.status(400);

        throw new Error("Email not registered");
      }

      // Check if the OTP is expired
      const currentTime = new Date();
      if (currentTime > entry.expiry) {
        res.status(400);
        // delete OTP
        await OTP.deleteOne({ email });

        throw new Error("OTP has expired. Please request a new one.");
      }

      if (otp === JSON.stringify(entry?.otp)) {
        await OTP.updateOne({ email }, { verified: true });

        return res.status(200).json({
          success: true,
          message: "User verified",
          email: email,
          verified: true,
        });
      } else {
        res.status(400);

        throw new Error(err ? err.message : "invalid OTP");
      }
    }
    // if user registers with phone but tries to send email and vice versa they will be sent to catch(err)

    if (!phone && !email) {
      res.status(400);

      throw new Error("Please Enter all the required fields correctly");
    }
  } catch (err) {
    res.status(400);

    throw new Error(err ? err.message : "Something went wrong");
  }
});

// this controller verifies and confirm password
//   getConfirm_password
const createUser = expressAsyncHandler(async (req, res) => {
  const { password, confirmPassword, email, phone } = req.body;
  let { role } = req.body;

  if (!password || !confirmPassword) {
    res.status(400);

    throw new Error("Password or Confirm Password isn't available");
  }

  // make sure both of them matches
  if (password !== confirmPassword) {
    res.status(400);

    throw new Error("Password and confirm Password doesn't match");
  }

  // check if user sent either email or phone
  if (!email && !phone) {
    res.status(400);

    throw new Error("Please fill all the fields");
  }

  // edge case, user sends email instead of phone and vice versa :-
  // if email, check if email is present in OTP, only register when email is sent, delete OTP
  if (email) {
    if (
      !email ||
      !email.includes("@") ||
      !emailRegex.test(email) ||
      !validator.isEmail(email)
    ) {
      res.status(400);

      throw new Error("Enter a valid Email");
    }
    const entry = await OTP.findOne({ email: email });
    // edge case, user tries to register without verifying OTP
    console.log("entry is ", entry);

    if (!entry || !entry.verified) {
      res.status(400);

      throw new Error("Email not found");
    }
    await OTP.deleteOne({ email });
  }
  // if phone, check if phone is present in OTP, only register when phone is sent, delete OTP
  if (phone) {
    const entry = await OTP.findOne({ phone: phone });
    // edge case, user tries to register without verifying OTP
    if (!entry || !entry.verified) {
      res.status(400);

      throw new Error("Phone not found");
    }
    await OTP.deleteOne({ phone });
  }
  // delete OTP by either phone or email?

  try {
    if (role) {
      role = role.toLowerCase();
    }
    let user = await User.create({
      email: email,
      phone: phone,
      password: password,
      role: role,
    });

    // generate and pass token
    const token = generateToken(user._id);

    // respond with token
    return res.status(200).json({
      message: "User created and Logged In",
      success: true,
      token: token,
    });
  } catch (err) {
    res.status(400);

    throw new Error(
      err ? err.message : "Error occurred while registering User"
    );
  }
});


// SSO
//this controller will handle if we have to send an email or SMS and verify them for guest that do not want to register.
// getEmailOrPhoneSSO
const sendGuestOTP = expressAsyncHandler(async (req, res) => {
  if (req.user) {
    res.status(400);

    throw new Error("User already logged in");
  }
  const { email } = req.body;

  try {
    // checking if email exist in Guest
    let user = await Guest.findOne({
      email: req?.body?.email,
    });

    if (!user) {
      // if user already exists
      res.status(400);

      throw new Error("User doesn't exist. Please contact your organization");
    }

    const otp = crypto.randomInt(100000, 999999);

    if (email) {
      // add `otp` in OTP table
      user = await OTP.create({
        email,
        otp,
      });

      // send OTP through email
      const options = {
        email: email,
        subject: `OTP for verfication`,
        message: `Your OTP is ${otp}`,
      };
      sendEmail(options, res);
    }
  } catch (err) {
    res.status(400);

    throw new Error(err ? err.message : "Something went wrong");
  }
});

// this controller verifies OTP for guests that do not want to register
// getOTPSSO
const validateGuestOTP = expressAsyncHandler(async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      res.status(400);

      throw new Error("Please Enter all the required fields");
    }

    // As registering through email
    if (email) {
      const entry = await OTP.findOne({ email: email });

      if (!entry) {
        // return?
        res.status(400);

        throw new Error("Email not found, Please generate OTP");
      }

      if (otp === JSON.stringify(entry?.otp)) {
        let guest = Guest.find({ email: email });
        // GENERATE TOKEN
        token = generateToken(guest._id);

        await OTP.deleteOne({ email });

        return res.status(200).json({
          success: true,
          message: "User verified",
          email: email,
          token: token,
        });
      } else {
        res.status(400);

        throw new Error("Invalid OTP");
      }
    }
  } catch (err) {
    res.status(400);

    throw new Error(err ? err.message : "Something went wrong");
  }
});

// Login
// This controller handles login based on email or phone and password provided
// findAndAuthUser
const login = expressAsyncHandler(async (req, res) => {
    if (req.user) {
      res.status(400);
  
      throw new Error("User already logged in");
    }
    const { email, phone, password } = req.body;
    try {
      if (!password) {
        res.status(400);
  
        throw new Error("Please Enter your Password");
      }
  
      if (!email && !phone) {
        res.status(400);
  
        throw new Error("Please fill all the required fields");
      }
  
      // edge case, check if user already logged in, by token?
      const token = req.headers.authorization;
      if (token) {
        res.status(400);
  
        throw new Error("User already Logged In");
      }
      //check if the username is already registered or not
      let user = await User.findOne({
        $or: [{ email: email }, { phone: phone }, {accountStatus: "inactive"}, {accountStatus: "banned"}]
      });
  
      if (!user) {
        res.status(400);
        throw new Error("User Not Found or Suspended, might not be registered");
      }
  
      if (user && (await user.isPasswordMatched(password))) {
        console.log("Generating token");
  
        // generate and pass token
        const token = generateToken(user._id);
        return res.status(200).json({
          message: "Login Confirmed",
          success: true,
          token: token,
        });
      } else {
        res.status(400);
  
        throw new Error("Invalid Credentials");
      }
    } catch (err) {
      res.status(400);
  
      throw new Error(err ? err.message : "Something went wrong");
    }
  });

// You don't handle logout from backend in Microservices

module.exports = {
  sendOTP,
  validateOTP,
  createUser,
  login,
  sendGuestOTP,
  validateGuestOTP
};