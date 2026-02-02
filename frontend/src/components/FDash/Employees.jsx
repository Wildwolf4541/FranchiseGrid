import { useEffect, useState } from "react";
import { X, Mail, Phone, MapPin, Briefcase, Building, Trash2 } from "lucide-react";
import api from "../../lib/axios"; // 🔥 use shared axios
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../hooks/useAuthContext"; // 🔥 get JWT

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, dispatch } = useAuthContext(); // 🔥 global auth

  const [newEmployee, setNewEmployee] = useState({
    Efname: "",
    Eemail: "",
    Emobile: "",
    Eaddress: "",
    Eposition: "",
    Edepartment: ""
  });

  // ==============================
  // FETCH EMPLOYEES
  // ==============================
  useEffect(() => {
    if (user?.token) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employees", {
        headers: {
          Authorization: `Bearer ${user.token}` // 🔥 send JWT
        }
      });

      setEmployees(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        dispatch({ type: "LOGOUT" });
      }

      toast.error("Failed to load employees");
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INPUT HANDLER
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // ==============================
  // ADD EMPLOYEE
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      const res = await api.post("/employees", newEmployee, {
        headers: {
          Authorization: `Bearer ${user.token}` // 🔥 send JWT
        }
      });

      setEmployees((prev) => [res.data.data, ...prev]);
      setIsModalOpen(false);

      toast.success("Employee added successfully");

      setNewEmployee({
        Efname: "",
        Eemail: "",
        Emobile: "",
        Eaddress: "",
        Eposition: "",
        Edepartment: ""
      });
    } catch (err) {
      console.error("Add Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        dispatch({ type: "LOGOUT" });
      }

      toast.error(err.response?.data?.msg || "Failed to add employee");
    }
  };

  // ==============================
  // DELETE EMPLOYEE (TOAST CONFIRM)
  // ==============================
  const handleDelete = (id, name) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            Remove <b>{name}</b>?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => confirmDelete(t.id, id)}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const confirmDelete = async (toastId, id) => {
    try {
      if (!user?.token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      await api.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}` // 🔥 send JWT
        }
      });

      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== id)
      );

      toast.dismiss(toastId);
      toast.success("Employee removed");
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        dispatch({ type: "LOGOUT" });
      }

      toast.error("Failed to remove employee");
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div>
      {/* Header */}
      <div className="p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Employees</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md"
        >
          + Add Employee
        </button>
      </div>

      {/* Status */}
      {loading && <p className="text-gray-500 p-4">Loading employees...</p>}

      <div className="p-6 rounded-lg bg-gray-100 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition relative"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(emp._id, emp.Efname)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                title="Remove Employee"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="text-xl font-bold text-orange-400 text-center">
                {emp.Efname}
              </h3>

              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {emp.Eemail}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  {emp.Emobile || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  {emp.Eaddress || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                  {emp.Eposition || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  {emp.Edepartment || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Employee</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Full Name", name: "Efname", type: "text" },
                { label: "Email", name: "Eemail", type: "email" },
                { label: "Mobile", name: "Emobile", type: "text" },
                { label: "Address", name: "Eaddress", type: "text" },
                { label: "Position", name: "Eposition", type: "text" }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={newEmployee[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-gray-700"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select
                  name="Edepartment"
                  value={newEmployee.Edepartment}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-gray-700"
                >
                  <option value="">Select Department</option>
                  {["Sales", "Marketing", "Engineering", "HR"].map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
