const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const GuestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },
    lastLogin: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guest", GuestSchema);
