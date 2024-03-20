// priceRouter.js

const express = require("express");
const router = express.Router();
const { fetchPrice } = require("../controller/controller");

router.get("/:modelName", fetchPrice);
//  http://localhost:5000/prices/modelname

module.exports = router;
