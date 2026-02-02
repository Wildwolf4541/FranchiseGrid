import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fileuploader from "express-fileupload";

import applicantRoutes from "./routes/applicantRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import tsalesRoutes from "./routes/tsalesRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// --------------------
// MIDDLEWARE
// --------------------
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileuploader());

// --------------------
// ROUTES
// --------------------
app.use("/api/application", applicantRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tsales", tsalesRoutes);
app.use("/api/dashboard",dashboardRoutes)

// --------------------
// FRONTEND SERVE
// --------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

// --------------------
// START SERVER
// --------------------
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});

// https://franchisegrid.onrender.com