import Applicant from "../models/Applicant.js";

// --------------------
// GET all applications
// --------------------
const getAllApplications = async (req, res) => {
  try {
    const applications = await Applicant.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// --------------------
// GET application by ID
// --------------------
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Applicant.findById(id);

    if (!application) {
      return res
        .status(404)
        .json({ message: `Application with id: ${id} not found` });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// --------------------
// CREATE application
// --------------------
const createApplication = async (req, res) => {
  try {
    const newApplication = new Applicant(req.body);
    const savedApplication = await newApplication.save();

    res.status(201).json({
      status: true,
      msg: "Your application has been sent successfully",
      data: savedApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      status: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// --------------------
// UPDATE status (Admin Accept / Reject)
// --------------------
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expects: 0 = rejected, 1 = accepted

    const updatedApplication = await Applicant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res
        .status(404)
        .json({ message: `Application with id: ${id} not found` });
    }

    res.status(200).json({
      status: true,
      msg: "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      status: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// --------------------
// UPDATE franchise status
// --------------------
const updateFranchiseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedApplication = await Applicant.findByIdAndUpdate(
      id,
      { status: 2 }, // 2 = franchise granted
      { new: true }
    );

    if (!updatedApplication) {
      return res
        .status(404)
        .json({ message: `Application with id: ${id} not found` });
    }

    res.status(200).json({
      status: true,
      msg: "Franchise granted successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating franchise status:", error);
    res.status(500).json({
      status: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// --------------------
// DELETE / REJECT application
// --------------------
const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApplication = await Applicant.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res
        .status(404)
        .json({ message: `Application with id: ${id} not found` });
    }

    res.status(200).json({
      status: true,
      msg: `Application with id: ${id} rejected successfully`,
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({
      status: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

export {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  updateFranchiseStatus,
  rejectApplication,
};
