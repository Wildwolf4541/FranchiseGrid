import express from "express";
import {
  saveLoginInfo, loginUser, updateLoginInfo
} from "../controllers/loginController.js";

import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", saveLoginInfo);       // Create franchise login
router.post("/login", loginUser);     // Login
router.put("/update", AuthMiddleware, updateLoginInfo); // Reset / change password

export default router;
