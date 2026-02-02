import express from "express";
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  updateFranchiseStatus,
  rejectApplication,
} from "../controllers/applicantController.js";

const router = express.Router();

// --------------------
// ROUTES
// --------------------

// GET all applications
router.get("/", getAllApplications);

// GET specific application by ID
router.get("/:id", getApplicationById);

// CREATE new application
router.post("/", createApplication);

// UPDATE application status (admin accept/reject)
router.put("/:id/status", updateApplicationStatus);

// UPDATE franchise status
router.put("/:id/franchise-status", updateFranchiseStatus);

// DELETE / REJECT application
router.delete("/:id", rejectApplication);

export default router;
