const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      minlength: 10,
      maxlength: 16,
    },
    otp: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false
    },
    expiry: {
      type: Date,
    },
  },
  {
    timestamps: true, // created_At, and uopdated_At
  }
);

module.exports = mongoose.model("OTP", OTPSchema);
