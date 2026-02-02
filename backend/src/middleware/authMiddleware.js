import jwt from "jsonwebtoken";
import UserM from "../models/Login.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await UserM.findById(decoded.id).select("_id username");

    if (!req.user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    next(); // 🔥 LET REQUEST CONTINUE
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

export default AuthMiddleware;
