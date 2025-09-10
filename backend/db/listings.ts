import mongoose from 'mongoose'
import modelSchema from './model';

const listingSchema = new mongoose.Schema({
    emp_id: { type: String, required: true },
    fields: [modelSchema]
})

const Listing = mongoose.model("Listening", listingSchema);
export default Listing;