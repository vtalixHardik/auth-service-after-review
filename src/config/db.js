const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to Db");
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    isConnected = connection.connections[0].readyState;
    console.log("New Database Connection established");
  } catch (error) {
    console.error("Error connecting to database", error);
    throw error;
  }
};

module.exports = connectDB;
