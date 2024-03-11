const Crane = require("../models/contact-model");

const contactForm = async (req, res) => {
  try {
    const response = req.body;

    const createdContact = await Crane.create(response);

    // Send success response
    return res
      .status(200)
      .send({ msg: "Message sent Successfully", createdContact });
  } catch (error) {
    return res.status(500).json({ msg: "Message not delivered" });
  }
};

module.exports = contactForm;
