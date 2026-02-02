import Tsales from "../models/Tsales.js";
import Employee from "../models/Employee.js";

// ==========================
// DASHBOARD STATS
// ==========================
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

    const todaySales = await Tsales.aggregate([
      { $match: { date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$netRevenue" } } }
    ]);

    const monthlySales = await Tsales.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$netRevenue" } } }
    ]);

    const lastMonthSales = await Tsales.aggregate([
      { $match: { date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$netRevenue" } } }
    ]);

    const currentMonthTotal = monthlySales[0]?.total || 0;
    const lastMonthTotal = lastMonthSales[0]?.total || 0;

    const growthRate = lastMonthTotal === 0 ? 100 : (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(2);
    const employees = await Employee.countDocuments();

    res.status(200).json({
      dailySales: todaySales[0]?.total || 0,
      monthlyRevenue: currentMonthTotal,
      growthRate,
      employees
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ==========================
// REVENUE GRAPH DATA (Fixed Sorting)
// ==========================
export const getRevenueGraph = async (req, res) => {
  try {
    const data = await Tsales.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$netRevenue" }
        }
      },
      // Backend sorting: Year first, then Month
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formatted = data.map(item => ({
      name: `${item._id.month}/${item._id.year}`,
      revenue: item.total || 0
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ msg: "Graph error" });
  }
};