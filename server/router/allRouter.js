const express = require("express");
const router = express.Router();

const {allFunction} = require("../controller/controller");
router.get("/data", allFunction);


// http://localhost:5000/prices
module.exports = router;
