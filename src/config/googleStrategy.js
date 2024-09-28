const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

// const User = require("../models/User");
const User = require("../api/v1/models/User");
const { generateToken } = require("./jwtToken");

// Register
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      //   console.log("profile is ", profile);

      // Extract email from profile
      const email = profile.emails[0].value;

      if (!email) {
        throw new Error("Login failed");
      }

      const newUser = {
        google_id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0].value,
        // add more info
      };
      console.log(typeof profile.id);

      try {
        // check if user already exist
        let user = await User.findOne({ google_id: profile.id });
        // console.log(typeof(user.google_id));

        console.log("checking if user already exist");

        // Not getting hit even after user is there
        if (user) {
          console.log("Not generating new user");

          // hits callback where token is generated
          return cb(null, user);
        } else {
          console.log("Generating new user");

          // Build a new User, this doesn't push the user into DB
          user = new User(newUser);

          // Update new user
          await user.save();

          return cb(null, user);
        }
      } catch (err) {
        console.log("error is ", err);
      }
    }
  )
);
// Register End

// Login
// test user: hardiksingh467@gmail.com
router.get(
  "/", // http://localhost:3000/api/v1/auth/google
  passport.authenticate("google", { scope: ["email", "profile"] }),
  () => {
    console.log("authentication");
  }
);

router.get(
  "/callback", // http://localhost:3000/api/v1/auth/google/callback
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  async (req, res) => {
    let user = req.user;
    console.log("user is ", user);

    // Generate JWT for new user
    const token = generateToken(user.id);
    console.log("Callback hit");

    // Successful authentication, redirect home.
    res.status(200).json({
      token: token,
    });
    // res.redirect("/success");
  }
);

// logout
router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("error while logout ", error);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
