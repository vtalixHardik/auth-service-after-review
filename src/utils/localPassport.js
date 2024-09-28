const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User'); // Replace with your User model

// Custom Passport Local Strategy, which will get triggered after route gets hit
passport.use(new LocalStrategy({
  usernameField: 'identifier',  // 'identifier' will be used for both email or phone
  passwordField: 'password'
}, async (identifier, password, done) => {
  try {
    let user;

    // Check if the identifier is an email (you can use a regex or simple string check)
    if (identifier.includes('@')) {
      // Find user by email
      user = await User.findOne({ email: identifier });
    } else {
      // Find user by phone
      user = await User.findOne({ phone: identifier });
    }

    // If no user is found, return an error
    if (!user) {
      return done(null, false, { message: 'Incorrect email or phone.' });
    }

    // Validate the password
    const isMatch = await user.comparePassword(password);  // Assuming comparePassword is a method in your User model
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    // If authentication succeeds, return the user
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Login Route: Accepts either email or phone in the 'identifier' field
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    // will get triggered after passport.use Strategy
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user,
      });
    }

    // If authentication is successful, generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  })(req, res, next);
});

module.exports = router;