const mongoose = require("mongoose");

const RevenuSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  dateRevenu: {
    type: Date,
    default: Date.now,
  },
  montant: {
    type: Number,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Revenu", RevenuSchema);
