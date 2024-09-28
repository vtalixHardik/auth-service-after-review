const express = require("express");
const router = express.Router();
const passport = require("passport");
const AppleStrategy = require("passport-appleid").Strategy;
const jwt = require("jsonwebtoken");
const path = require("path");

const config = require("./config");

const User = require("../models/User");

// Register
passport.use(
    new AppleStrategy(
        {// the keys below are fetched from config.json, in that we get from the apple developer portal
            clientID: config.client_id,// "com.gotechmakers.auth.client"
            callbackURL: config.redirect_uri,// "https://apple-auth.gotechmakers.com/auth/apple/callback"
            teamId: config.team_id,// "APPLE_TEAM_ID"
            keyIdentifier: config.key_identifier,// "RBXXXXXXXX"
            privateKeyPath: path.join(__dirname, "./AuthKey_RBXXXXXXXX.p8")//
        },
        async function(accessToken, refreshToken, profile, done) {
          console.log("Profile is: ", profile);
          let user = profile;
          return done(null, user);
        }
));
// Register End

// login
// test user: 
router.get(
    '/', 
    passport.authenticate('apple', {scope: "email"}));

router.get(
    '/callback', 
    passport.authenticate('apple', { 
        failureRedirect: '/login',
        session: false, 
    }), 
    (req, res) => {
        let user = req.user;
        console.log("useris ", user);
        
        // Generate JWT for new user
        const token =  jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "10m",
        });
        console.log("Callback hit");
        
        // Successful authentication, redirect home.
        // res.status(200).json({
        //     token: token
        // });
        res.redirect("/success");
});


module.exports = router;