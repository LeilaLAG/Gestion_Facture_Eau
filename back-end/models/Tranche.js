const mongoose = require('mongoose');

const TrancheSchema = new mongoose.Schema({
    numTranche : {
        type : Number,
        required : true,
    },
    prix : {
        type : Number,
        required : true,
    },
    maxTonage : {
        type : Number,
        required : true,
    },
    companyId : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Tranche", TrancheSchema);
