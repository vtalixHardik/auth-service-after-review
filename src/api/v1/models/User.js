const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Dr", "other"],
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\+\d{1,4}\d{6,14}$/, "Please fill a valid phone number"],
      trim: true,
      minlength: 10,
      maxlength: 14,
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    address: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      zipcode: { type: String, trim: true },
      street: { type: String, trim: true },
    },
    about: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["patient", "therapist", "admin", "consultant"],
      default: "patient",
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dnu2n1uz0/image/upload/v1721911080/profile_pictures/66a21f318b36454ee92f5eba_1721911079353.png",
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
      required: true,
    },
    languages: {
      type: [String],
    },
    searchHistory: {
      type: [String],
    },
    google_id: {
      type: String,
      unique: true,
    },
    apple_id: {
      type: String,
      unique: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

// adding hashed password using bcrypt
UserSchema.pre("save", async function (next) {
  const user = this;
  // if not saving password
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// compare password for login using bcrypt
UserSchema.methods.isPasswordMatched = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("Password is not defined");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// generating token for password regeneration
UserSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
