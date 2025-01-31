const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
    numFacture : {
        type : String,
        required : true,
    },
    dateFacture : {
        type : Date,
        required : true,
    },
    datePainement : {
        type : Date,
        required : true
    },
    numCompteur : {
        type : Number,
        required : true
    },
    numClient : {
        type : Number,
        // required : true
    },
    valeurCompteurPreleve : {
        type : Number,
        required : true
    },
    painementStatus : {
        type : String
    },
    totalFacture : {
        type : Number,
        default : 0
    },
    dateGenerationFacture : {
        type : Date,
        default : new Date(),
    },
    companyId : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Facture", FactureSchema);
