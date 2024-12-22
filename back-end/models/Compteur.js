const mongoose = require('mongoose');

const CompteurSchema = new mongoose.Schema({
    numCompteur : {
        type : Number,
        required : true,
    },
    startPoint : {
        type : Number,
        required : true,
        default : 0
    },
    useDate : {
        type : Date,
        required : true,
    },
    credit : {
        type : Number,
    },
    numClient : {
        type : Number,
        required : true
    },
    companyId : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Compteur", CompteurSchema);
