const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    numClient : {
        type : Number,
        required : true,
        default : 0
    },
    nameClient : {
        type : String,
        required : true,
    },
    cin : {
        type : String,
        required : true,
    },
    birthDate : {
        type : Date,
        required : true
    },
    tele : {
        type : String,
        required : true,
    },
    adresse : {
        type : String,
    },
    dateRegisterClient : {
        type : Date,
        default : Date.now,
    },
    companyId : {
        type : String,
        required : true
    },
    modified_at : {
        type : Date,
    },
});

module.exports = mongoose.model("Client", ClientSchema);
