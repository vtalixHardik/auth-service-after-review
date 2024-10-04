const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Dr", "other"],
      trim: true
    },
    full_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      trime: true
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    address: {
      // address will store the object of it which will include the city,  state, country, zip
      type: Object,
      // we will define the object  inside the address object here
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      zip: {
        type: String,
      },
    },
    date_of_birth: {
      type: Date,
    },
    age: {
      type: Number,
    },
    about: {
      type: String,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "consultant", "admin"],
      default: "patient",
      required: true
    },
    profile_picture_url: {
      type: String,
      default: null, // default value is null,will be changed later
    },
    account_status: {
      type: String,
      enum: ["active", "banned", "suspend", "inactive", "deleted"],
      default: "active",
    },
    languages: {
      type: [String],
    },
    search_history: {
      type: [String],
    },
    google_id: {
      type: String,
    },
    // we will add the fields here which will be used to store the user's location
    location: {
      type: Object,
      // we will define the object  inside the location object here
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    passwordResetToken: {
      type: String,
    },
    passwordTokenExpires: {
      type: Date,
    },
    is2FactorEnabled: {
      type: Boolean,
      default: false,
    },
    last_login: {
      type: Date,
    },
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