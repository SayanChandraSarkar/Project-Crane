const mongoose = require("mongoose");

const URI =
  "mongodb+srv://5techgteam:sHAQhurBYxQKID5I@cranebuffer.qpd8gt0.mongodb.net/?retryWrites=true&w=majority&appName=cranebuffer";

const connectDb = async () => {
  try {
    await mongoose.connect(URI);

    console.log("connection successfly to database");
  } catch (error) {
    console.error("database connection is failed");
    process.exit(0);
  }
};

module.exports = connectDb;
