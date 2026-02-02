import express from "express";
import {
  getAllRecords,
  createRecord,
  deleteRecord
} from "../controllers/tsalesController.js";

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.use(authMiddleware)

// Franchise protected routes
router.get("/", getAllRecords);
router.post("/", createRecord);
router.delete("/:id", deleteRecord);

export default router;
