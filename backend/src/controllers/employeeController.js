import Employee from "../models/Employee.js";

// --------------------
// GET all employees (ONLY MY FRANCHISE)
// --------------------
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      user_id: req.user._id.toString() // 🔥 scope to logged-in user
    }).sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// --------------------
// GET employee by ID (ONLY IF MINE)
// --------------------
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      _id: id,
      user_id: req.user._id.toString() // 🔥 ownership check
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

// --------------------
// CREATE employee (ASSIGN OWNER)
// --------------------
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      user_id: req.user._id.toString() // 🔥 attach franchise owner
    });

    res.status(201).json({
      status: true,
      msg: "Employee added successfully",
      data: employee
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        msg: "Employee email already exists"
      });
    }

    res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};

// --------------------
// DELETE employee (ONLY IF MINE)
// --------------------
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Employee.findOneAndDelete({
      _id: id,
      user_id: req.user._id.toString() // 🔥 ownership check
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        msg: "Employee not found"
      });
    }

    res.status(200).json({
      status: true,
      msg: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      status: false,
      msg: "Internal server error"
    });
  }
};

export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee
};
