import Tsales from "../models/Tsales.js";
import Employee from "../models/Employee.js";

// ==========================
// DASHBOARD STATS
// ==========================
export const getDashboardStats = async (req, res) => {
  try {
    // Tsales.user_id is stored as String in the schema
    const userId = req.user._id.toString();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const endOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Today's sales for logged-in user only
    const todaySales = await Tsales.aggregate([
      {
        $match: {
          user_id: userId,
          date: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netRevenue" }
        }
      }
    ]);

    // Current month's sales for logged-in user only
    const monthlySales = await Tsales.aggregate([
      {
        $match: {
          user_id: userId,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netRevenue" }
        }
      }
    ]);

    // Previous month's sales for logged-in user only
    const lastMonthSales = await Tsales.aggregate([
      {
        $match: {
          user_id: userId,
          date: {
            $gte: startOfLastMonth,
            $lte: endOfLastMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netRevenue" }
        }
      }
    ]);

    const currentMonthTotal = monthlySales[0]?.total || 0;
    const lastMonthTotal = lastMonthSales[0]?.total || 0;

    const growthRate =
      lastMonthTotal === 0
        ? 100
        : Number(
            (
              ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) *
              100
            ).toFixed(2)
          );

    // Kept unchanged because Employee model ownership was not provided
    const employees = await Employee.countDocuments();

    res.status(200).json({
      dailySales: todaySales[0]?.total || 0,
      monthlyRevenue: currentMonthTotal,
      growthRate,
      employees
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==========================
// REVENUE GRAPH DATA
// ==========================
export const getRevenueGraph = async (req, res) => {
  try {
    // Tsales.user_id is stored as String in the schema
    const userId = req.user._id.toString();

    const data = await Tsales.aggregate([
      // Only records belonging to logged-in user
      {
        $match: {
          user_id: userId
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$netRevenue" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const formatted = data.map((item) => ({
      name: `${item._id.month}/${item._id.year}`,
      revenue: item.total || 0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Revenue graph error:", error.message);
    res.status(500).json({ msg: "Graph error" });
  }
};