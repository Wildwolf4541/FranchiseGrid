import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    Efname: { type: String, required: true, trim: true },
    Eemail: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    Emobile: { type: String, trim: true },
    Eaddress: { type: String, trim: true },
    Eposition: { type: String, trim: true },
    Edepartment: { type: String, trim: true },

    user_id:{
      type: String, 
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
