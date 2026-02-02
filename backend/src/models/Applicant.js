import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    businessName: { type: String, trim: true },
    siteLocation: { type: String, trim: true },
    areaDimensions: { type: String, trim: true },
    floor: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pinCode: { type: String, trim: true },
    ownershipStatus: { type: String, enum: ["Owned", "Rented", ""], default: "" },
    status: { type: Number, default: 0 } // 0 = pending, 1 = accepted, 2 = franchise
  },
  { timestamps: true, versionKey: false }
);

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
