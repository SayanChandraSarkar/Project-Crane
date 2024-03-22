const mongoose = require("mongoose");

const URI =
  "mongodb+srv://5TechG:mf25SkkgywK4YY6n@cranebuffer.o1p5ttz.mongodb.net/cranebuffer";

const connectDb = async () => {
  try {
    await mongoose.connect(URI);

    console.log("Connection Successful to database");
  } catch (error) {
    console.error("Database connection is failed");
    process.exit(0);
  }
};

module.exports = connectDb;

// const { MongoClient } = require("mongodb");

// // MongoDB connection URI
// const uri =
//   "mongodb+srv://5TechG:5TechG%40123@cranebuffer.o1p5ttz.mongodb.net/cranebuffer?retryWrites=true&w=majority";

// // Function to connect to MongoDB
// async function connectDb() {
//   const client = new MongoClient(uri, {});
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB Atlas");
//     return client;
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     throw err;
//   }
// }

// module.exports = connectDb;
