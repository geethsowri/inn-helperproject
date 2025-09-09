const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String },
    values: [{ type: String }]
})

module.exports = modelSchema;