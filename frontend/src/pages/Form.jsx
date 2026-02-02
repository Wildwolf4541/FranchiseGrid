import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../lib/axios";

const Form = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    businessName: "",
    siteLocation: "",
    areaDimensions: "",
    floor: "",
    city: "",
    state: "",
    pinCode: "",
    ownershipStatus: "",
  });

  function doUpdate(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await api.post(
        "/application",
        formData
      );

      toast.success(resp.data.msg || "Application submitted!");

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        businessName: "",
        siteLocation: "",
        areaDimensions: "",
        floor: "",
        city: "",
        state: "",
        pinCode: "",
        ownershipStatus: "",
      });

    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Failed to submit application: " + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-linear-to-r from-gray-900 to-black px-5">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-end w-full max-w-3xl mb-2">
        <h3 className="text-white">Dark Mode: &nbsp;</h3>
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal-600 relative after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      {/* Form Container */}
      <div className={`w-full max-w-3xl p-6 sm:p-10 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-blue-500">
          Franchise Application 2026
        </h1>

        <form className="w-full mt-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="text-2xl font-semibold text-orange-500">Personal Information</div>

            <input name="name" value={formData.name} onChange={doUpdate} placeholder="Enter your Name" required className={inputClass(darkMode)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <input name="email" value={formData.email} onChange={doUpdate} placeholder="Enter your email" required className={inputClass(darkMode)} />
              <input name="mobile" value={formData.mobile} onChange={doUpdate} placeholder="Enter your Mobile Number" required className={inputClass(darkMode)} />
            </div>

            <input name="address" value={formData.address} onChange={doUpdate} placeholder="Enter your Residential Address" required className={inputClass(darkMode)} />

            <hr />

            <div className="text-2xl font-semibold text-orange-500">Business Information</div>

            <input name="businessName" value={formData.businessName} onChange={doUpdate} placeholder="Business Name" className={inputClass(darkMode)} />
            <input name="siteLocation" value={formData.siteLocation} onChange={doUpdate} placeholder="Site Location" className={inputClass(darkMode)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <input name="areaDimensions" value={formData.areaDimensions} onChange={doUpdate} placeholder="Area (sq. feet)" className={inputClass(darkMode)} />
              <input name="floor" value={formData.floor} onChange={doUpdate} placeholder="Floor" className={inputClass(darkMode)} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                name="city"
                value={formData.city}
                onChange={doUpdate}
                placeholder="City"
                className={inputClass(darkMode)}
              />

              <input
                name="state"
                value={formData.state}
                onChange={doUpdate}
                placeholder="State"
                className={inputClass(darkMode)}
              />
            </div>

            <input
              name="pinCode"
              value={formData.pinCode}
              onChange={doUpdate}
              placeholder="Pin Code"
              className={inputClass(darkMode)}
            />

            <div className="text-lg font-semibold text-orange-500">Ownership Status</div>
            <div className="flex gap-4">
              {["Owned", "Rented"].map((status) => (
                <label key={status} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="ownershipStatus"
                    value={status}
                    checked={formData.ownershipStatus === status}
                    onChange={doUpdate}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2 text-gray-300">{status}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 tracking-wide font-semibold bg-linear-to-r from-blue-500 to-teal-500 text-white w-full py-4 rounded-lg hover:scale-105 transition-all shadow-lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <p className="text-xs text-center text-gray-400">Terms and Conditions Applied.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shared Input Styling
const inputClass = (darkMode) =>
  `w-full px-5 py-3 rounded-lg placeholder-gray-500 text-sm focus:outline-none transition-all ${darkMode
    ? "bg-gray-700 text-white focus:ring-teal-500"
    : "bg-gray-200 text-black focus:ring-blue-500"
  }`;

export default Form;
