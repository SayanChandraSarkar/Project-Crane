const mongoose = require("mongoose");

// // Define a schema
const accesorieSchema = new mongoose.Schema({
  Model: String,
  Price: String,
});

// Create a model based on the schema
const PriceModel = mongoose.model("Accessorie", accesorieSchema);

module.exports = PriceModel;
