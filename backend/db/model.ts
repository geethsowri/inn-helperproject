import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String },
    values: [{ type: String }]
})

export default modelSchema;