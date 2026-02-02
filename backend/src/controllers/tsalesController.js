import Tsales from "../models/Tsales.js";

// --------------------
// GET MY RECORDS (LATEST FIRST)
// --------------------
const getAllRecords = async (req, res) => {
  try {
    const records = await Tsales.find({
      user_id: req.user._id // 🔥 FIXED
    }).sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------
// CREATE RECORD
// --------------------
const createRecord = async (req, res) => {
  try {
    const record = await Tsales.create({
      ...req.body,
      date: new Date(req.body.date), // ensure Date
      user_id: req.user._id // 🔥 FIXED
    });

    res.status(201).json({
      status: true,
      msg: "Sales record saved",
      data: record
    });
  } catch (error) {
    console.error("Create error:", error);

    // Duplicate day check (if you enable unique index later)
    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        msg: "Sales already submitted for today"
      });
    }

    res.status(500).json({
      status: false,
      msg: "Server error"
    });
  }
};

// --------------------
// DELETE RECORD
// --------------------
const deleteRecord = async (req, res) => {
  try {
    const deleted = await Tsales.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id // 🔥 FIXED
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        msg: "Record not found"
      });
    }

    res.status(200).json({
      status: true,
      msg: "Record deleted"
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      status: false,
      msg: "Server error"
    });
  }
};

export { getAllRecords, createRecord, deleteRecord };
