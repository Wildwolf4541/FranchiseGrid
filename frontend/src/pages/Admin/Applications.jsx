import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import AppCards from "./AppCards";
import { toast } from "react-hot-toast";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/application");
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch applications");
    }
  };

  const applyFilter = (status) => {
    setStatusFilter(status);

    if (status === "all") {
      setFilteredApplications(applications);
    } else {
      const s = parseInt(status);
      setFilteredApplications(
        applications.filter((app) => app.status === s)
      );
    }

    setIsFilterOpen(false);
  };

  const handleAccept = async (id) => {
    try {
      const response = await api.put(`/application/${id}/status`, {
        status: 1,
      });

      if (response.data.status) {
        toast.success("Application accepted");
        updateApplicationStatus(id, 1);
      }
    } catch (error) {
      toast.error("Failed to accept application");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.delete(`/application/${id}`);

      if (response.data.status) {
        toast.success("Application rejected");
        setApplications((prev) =>
          prev.filter((app) => app._id !== id)
        );
        setFilteredApplications((prev) =>
          prev.filter((app) => app._id !== id)
        );
      }
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  const handleFranchise = async (id, username, password) => {
    try {
      const response = await api.put(
        `/application/${id}/franchise-status`,
        { status: 2 }
      );

      if (response.data.status) {
        toast.success("Franchise granted");
        updateApplicationStatus(id, 2);
      }
    } catch (error) {
      toast.error("Failed to grant franchise");
    }
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, status: newStatus } : app
      )
    );

    setFilteredApplications((prev) =>
      prev
        .map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
        .filter(
          (app) =>
            statusFilter === "all" ||
            app.status === parseInt(statusFilter)
        )
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Accepted";
      case "2":
        return "Franchised";
      default:
        return "All Applications";
    }
  };

  return (
    <div className="bg-gray-900 py-6 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-bold text-white mb-6">
        Applications Dashboard
      </h2>

      <div className="w-full max-w-7xl mb-4 flex justify-end px-4 relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Filter: {getStatusText(statusFilter)}
        </button>

        {isFilterOpen && (
          <div className="absolute right-4 top-12 bg-white rounded-lg shadow-xl w-48">
            {["all", "0", "1", "2"].map((s) => (
              <div
                key={s}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => applyFilter(s)}
              >
                {getStatusText(s)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-7xl">
        <div className="flex flex-wrap justify-center gap-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((obj) => (
              <AppCards
                key={obj._id}
                obj={obj}
                handleAccept={() => handleAccept(obj._id)}
                handleReject={() => handleReject(obj._id)}
                handleFranchise={(username, password) =>
                  handleFranchise(obj._id, username, password)
                }
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg p-10">
              No applications found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Applications;
