const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/project";

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
