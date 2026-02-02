import mongoose from "mongoose";
import bcrypt from "bcrypt"
import validator from "validator"

const loginSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
);

// Signup static ()
loginSchema.static.signup = async function(username,password){
  const exists = await this.findOne({username})

  if(!username||!password) throw Error("All fields are required");
  if(exists) throw Error("Username Already exists");
  if(!validator.isStrongPassword(password)) throw Error("Password is not strong enough");

  const salt= await bcrypt.genSalt(10)
  const hash= await bcrypt.hash(password,salt)
  const user= await this.create({username,password:hash}) // create the user

  return user
}

// Login static ()
loginSchema.static.login = async function(username,password){
  if(!username||!password) throw Error("All fields must be filled");
    
    const user= await this.findOne({username})

    if(!user) throw Error("User not found. Signup to create account.");

    const match = await bcrypt.compare(password,user.password)

    if(!match) throw Error("Invalid Password");

    return user
}

const Login = mongoose.model("Login", loginSchema);
export default Login;
