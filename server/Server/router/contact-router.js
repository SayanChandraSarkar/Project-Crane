const express = require("express");
const router = express.Router();
const { contactData } = require("../controller/contact-controller");

router.post("/contact", contactData);

module.exports = router;
