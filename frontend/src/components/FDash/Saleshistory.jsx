import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { formatDate } from "../../lib/utils.js";
import { useAuthContext } from "../../hooks/useAuthContext";

function Saleshistory() {
  const [salesRecords, setSalesRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.token) {
      fetchSalesRecords();
    }
  }, [user]);

  // --------------------
  // FETCH MY SALES (JWT)
  // --------------------
  const fetchSalesRecords = async () => {
    setLoading(true);

    try {
      const response = await api.get("/tsales", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const records = (response.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setSalesRecords(records);
      setFilteredRecords(records);
      calculateTotalSales(records);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      setSalesRecords([]);
      setFilteredRecords([]);
      setTotalSales(0);
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // TOTAL CALC
  // --------------------
  const calculateTotalSales = (records) => {
    const total = records.reduce(
      (sum, rec) => sum + (parseFloat(rec.netRevenue) || 0),
      0
    );
    setTotalSales(total);
  };

  // --------------------
  // PRESET FILTERS
  // --------------------
  const applyPresetFilter = (type) => {
    const now = new Date();
    let start;

    if (type === "week") {
      start = new Date();
      start.setDate(now.getDate() - 7);
    }

    if (type === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (type === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    }

    const filtered = salesRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= now;
    });

    setFilteredRecords(filtered);
    calculateTotalSales(filtered);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);
  };

  // --------------------
  // CUSTOM FILTER
  // --------------------
  const filterRecords = () => {
    if (!startDate && !endDate) {
      setFilteredRecords(salesRecords);
      calculateTotalSales(salesRecords);
      return;
    }

    const filtered = salesRecords.filter((record) => {
      const recordDate = new Date(record.date);

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return recordDate >= start && recordDate <= end;
      }

      if (startDate) return recordDate >= new Date(startDate);

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return recordDate <= end;
      }

      return true;
    });

    setFilteredRecords(filtered);
    calculateTotalSales(filtered);
  };

  // --------------------
  // RESET
  // --------------------
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredRecords(salesRecords);
    calculateTotalSales(salesRecords);
  };

  return (
    <>
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium text-gray-700 mb-3">
          Filter Sales
        </h2>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => applyPresetFilter("week")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            This Week
          </button>

          <button
            onClick={() => applyPresetFilter("month")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            This Month
          </button>

          <button
            onClick={() => applyPresetFilter("year")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            This Year
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={filterRecords}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={salesRecords.length === 0}
            >
              Apply
            </button>

            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={salesRecords.length === 0}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-center p-8">Loading...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="max-h-100 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-gray-700 text-sm uppercase">
                <tr>
                  {[
                    "Date",
                    "Units Sold",
                    "Total Revenue",
                    "Total Discounts",
                    "Units Bought",
                    "Total Expenditure",
                    "Net Revenue",
                    "Remarks"
                  ].map((header, index) => (
                    <th key={index} className="py-3 px-4 text-left border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {filteredRecords.map((record, index) => {
                  const net = Number(record.netRevenue) || 0;
                  const netClass =
                    net < 0
                      ? "text-red-600"
                      : net > 0
                      ? "text-green-600"
                      : "text-gray-600";

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {formatDate(record.date)}
                      </td>
                      <td className="py-3 px-4">
                        {record.totalUnits}
                      </td>
                      <td className="py-3 px-4">
                        {record.totalRevenue}
                      </td>
                      <td className="py-3 px-4">
                        {record.totalDiscounts}
                      </td>
                      <td className="py-3 px-4">
                        {record.unitsbought}
                      </td>
                      <td className="py-3 px-4">
                        {record.totalexpenditure}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${netClass}`}
                      >
                        ₹{net.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-500 italic">
                        {record.remarks || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center p-8">
            No sales records found
          </p>
        )}
      </div>

      {/* Total Revenue */}
      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm mt-6">
        <span className="text-lg font-medium text-gray-700">
          Total Revenue Generated:
        </span>
        <input
          type="text"
          value={`₹${totalSales.toLocaleString()}`}
          readOnly
          className="p-2 border border-gray-300 rounded-lg w-48 bg-gray-100 text-gray-700 text-center"
        />
      </div>
    </>
  );
}

export default Saleshistory;
