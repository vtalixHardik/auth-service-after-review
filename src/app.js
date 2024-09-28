require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const PORT = process.env.PORT || 8000;

// const db = require("./src/config/db");
const db = require("./config/db");
const connectDB = require("./config/db");
// const { errorHandler, notFound } = require("./src/middlewares/errorHandler");
const { errorHandler, notFound } = require("./api/v1/middlewares/errorHandler");

connectDB();

app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/success", (req, res) => {
  res.send("Root Route");
});

app.get("/failure", (req, res) => {
  res.send("failure Route");
});

// app.use("/api/v1", require("./src/routes/index"));
app.use("/api/v1", require("./api/v1/routes/index"));
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});

module.exports = app;
