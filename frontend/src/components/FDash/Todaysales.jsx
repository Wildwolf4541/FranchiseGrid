import { useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../hooks/useAuthContext";

function Todaysales({ username }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext(); // 🔥 get JWT from context

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    totalUnits: "",
    totalRevenue: "",
    totalDiscounts: "",
    netRevenue: 0,
    unitsbought: "",
    totalexpenditure: "",
    remarks: ""
  });

  // Auto calculate net revenue
  const calculateNetRevenue = (data) => {
    return (
      (parseFloat(data.totalRevenue) || 0) -
      (parseFloat(data.totalDiscounts) || 0) -
      (parseFloat(data.totalexpenditure) || 0)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      updated.netRevenue = calculateNetRevenue(updated);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.totalUnits || !formData.totalRevenue) {
      toast.error("Units sold and total revenue are required!");
      return;
    }

    if (!user?.token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const resp = await api.post("/tsales", formData, {
        headers: {
          Authorization: `Bearer ${user.token}` // 🔥 always send JWT
        }
      });

      toast.success(resp.data?.msg || "Sales record saved!");

      setFormData((prev) => ({
        ...prev,
        totalUnits: "",
        totalRevenue: "",
        totalDiscounts: "",
        unitsbought: "",
        totalexpenditure: "",
        netRevenue: 0,
        remarks: ""
      }));
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to save record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-200 shadow-md rounded-lg max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">
        Today's Sales {username && `— ${username}`}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          { label: "Date", type: "date", name: "date", readOnly: false },
          {
            label: "Number of Units Sold",
            type: "number",
            name: "totalUnits"
          },
          {
            label: "Today's Total Revenue",
            type: "number",
            name: "totalRevenue"
          },
          {
            label: "Discount Given (Amount)",
            type: "number",
            name: "totalDiscounts"
          },
          {
            label: "Number of Units Bought",
            type: "number",
            name: "unitsbought"
          },
          {
            label: "Total Expenditure",
            type: "number",
            name: "totalexpenditure"
          },
          {
            label: "Net Revenue",
            type: "number",
            name: "netRevenue",
            readOnly: true
          }
        ].map(({ label, type, name, readOnly = false }) => (
          <div key={name}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              readOnly={readOnly}
              className={`border rounded-lg p-2 w-full ${
                readOnly ? "bg-gray-100 text-gray-700" : "bg-white"
              }`}
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 w-full disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Todaysales;
