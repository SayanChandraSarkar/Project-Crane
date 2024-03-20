const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  shockAbsorber: { type: Number, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  spare: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      // Add more fields as needed for each spare part
    },
  ],
  series: { type: String, required: true },
  originalPrice: { type: String, required: true },
  currency: { type: String, required: true },

  AdditionalAccessories: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],

  // front: { type: Number, required: true},
  // rear: { type: Number, required: true},
  // foot: { type: Number, required: true},
  // section: { type: String, required: true },
  // type: { type: String, required: true },
});

const Crane = new model("Crane", contactSchema);

module.exports = Crane;
