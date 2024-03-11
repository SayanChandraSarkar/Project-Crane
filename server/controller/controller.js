const Model = require("../models/model");
const PriceModel = require("../models/accesories");

const allFunction = async (req, res) => {
  try {
    // Filter data from MongoDB based on the provided criteria
    const response = await Model.find();

    console.log(response);
    if (!response) {
      res.status(404).json({ message: "No data found" });
      return;
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchPrice = async (req, res) => {
  const modelName = req.params.modelName;
  try {
    // Filter data from MongoDB based on the provided criteria
    const price = await PriceModel.findOne({ Model: modelName });
    console.log('price',price);

    if (!price) {
      return res.status(404).json({ message: "Price not found" });
    }
    return res.status(200).json({ price: price });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { allFunction, fetchPrice };
/*
{
  "_id": {
    "$oid": "65eb2359273b45d7414f8c75"
  },
  "series": "ED",
  "SERIAL NO": 205,
  "Model": "ED 3.0 x 28",
  "Stroke": 700,
  "nmperstroke": 115300,
  "nmperhr": 2630100,
  "SFMIN": 800,
  "SFMAX": 2895,
  "WEIGHT IN GMS": 0,
  "Price": 10000
}

*/