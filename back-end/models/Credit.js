const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  numCompteur: {
    type: Number,
    required: true,
  },
  montantPaye: {
    type: Number,
    default: 0,
  },
  datePaiement: {
    type: Date,
    default: Date.now,
  },
  companyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Credit", CreditSchema);
