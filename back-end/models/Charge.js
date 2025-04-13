const mongoose = require("mongoose");

const ChargeSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  dateGeneration: {
    type: Date,
    default: Date.now,
  },
  datePaiment: {
    type: Date,
    required: true,
  },
  responsable: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Charge", ChargeSchema);
