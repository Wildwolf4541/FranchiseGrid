import Login from "../models/Login.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================
// REGISTER (FRANCHISE CREATE)
// ===================
import validator from "validator";

const saveLoginInfo = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ msg: "Password not strong enough" });
    }

    const existing = await Login.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Login.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({ msg: "User created", id: newUser._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// ===================
// LOGIN
// ===================
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      status: true,
      msg: "Login successful",
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: false, msg: "Server error" });
  }
};

// ===================
// UPDATE PASSWORD (RESET / CHANGE)
// ===================
const updateLoginInfo = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await Login.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ msg: "Current password incorrect" });

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ msg: "Weak new password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

export { saveLoginInfo, loginUser, updateLoginInfo };
