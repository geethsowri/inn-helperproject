import mongoose, { Schema, Document } from "mongoose";

export interface IHelper extends Document {
  name: string;
  workName: string;
  employeeId: string;
  identificationCard: string;
  employeeCode: string;
  gender: string;
  languages: string[];
  mobile: string;
  email: string;
  kycDocument: string;
  serviceType: string;
  organization: string;
  joinedOn: Date;
}

const HelperSchema: Schema = new Schema({
  name: { type: String, required: true },
  workName: { type: String, required: true },
  employeeId: String,
  identificationCard: String,
  employeeCode: String,
  gender: String,
  languages: [String],
  mobile: String,
  email: String,
  kycDocument: String,
  serviceType: String,
  organization: String,
  joinedOn: Date,
});

export default mongoose.model<IHelper>("Helper", HelperSchema);