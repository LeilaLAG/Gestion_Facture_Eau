const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true
    },
});

module.exports = mongoose.model("Company", CompanySchema);
