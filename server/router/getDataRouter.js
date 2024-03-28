const express = require("express");
const router = express.Router();
const { quotationData } = require("../controller/contact-controller");
const { getContactData } = require("../controller/contact-controller");

router.get("/quotation/:id", quotationData);
router.get("/getData", getContactData);

module.exports = router;
