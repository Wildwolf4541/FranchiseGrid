import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.use(authMiddleware)
// GET all employees
router.get("/", getAllEmployees);

// GET specific employee
router.get("/:id", getEmployeeById);

// CREATE employee
router.post("/", createEmployee);

// DELETE employee
router.delete("/:id", deleteEmployee);

export default router;
