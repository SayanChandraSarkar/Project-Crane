const express = require("express");
const router = express.Router();
const { quotationData } = require("../controller/contact-controller");

router.get("/quotation/:id", quotationData);

module.exports = router;
