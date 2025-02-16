const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
    dateFacture : {
        type : Date,
        required : true,
    },
    datePainement : {
        type : Date,
    },
    numCompteur : {
        type : Number,
        required : true
    },
    numClient : {
        type : Number,
    },
    valeurCompteurPreleve : {
        type : Number,
        required : true
    },
    lastCompteurPrelevement : {
        type : Number,
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
        default : Date.now,
    },
    companyId : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Facture", FactureSchema);
