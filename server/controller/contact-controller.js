const Crane = require("../models/contact-model");

const contactData = async (req, res) => {
  try {
    const response = req.body;
    const createdContact = await Crane.create(response);

    return res
      .status(200)
      .send({ msg: "Message sent Successfully", createdContact });
  } catch (error) {
    return res.status(500).json({ msg: "Message not delivered" });
  }
};

const quotationData = async (req, res) => {
  try {
    const contactId = req.params.id;
    const user = await Crane.findById(contactId);

    if (!user) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    return res
      .status(200)
      .json({ msg: "Quotation data retrieved successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
module.exports = { contactData, quotationData };
