const mongoose = require('mongoose');
const modelSchema = require('./model')

const listingSchema = new mongoose.Schema({
    emp_id: {type: String, required: true},
    fields: [modelSchema]
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;