const mongoose = require("mongoose");

// // Define a schema
const allSchema = new mongoose.Schema({
  modelName: String,
  kineticEnergy: Number,
  potentialEnergy: Number,
  totalEnergyPerStroke: Number,
  energyPerHour: Number,
  emassMin: Number,
  vd: Number,
});

// Create a model based on the schema
const Model = mongoose.model("Data", allSchema);

module.exports = Model;
