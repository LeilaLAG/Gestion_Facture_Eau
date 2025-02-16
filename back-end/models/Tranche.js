const mongoose = require("mongoose");

const TrancheSchema = new mongoose.Schema({
  nameTranche: {
    type: String,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  maxTonnage: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  companyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tranche", TrancheSchema);
