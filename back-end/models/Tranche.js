const mongoose = require("mongoose");

const TrancheSchema = new mongoose.Schema({
  // numTranche : {
  //     type : Number,
  //     required : true,
  // },
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
  companyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tranche", TrancheSchema);
