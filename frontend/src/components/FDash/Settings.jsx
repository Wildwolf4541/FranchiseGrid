import React, { useState } from "react";
import api from "../../lib/axios";
import { useAuthContext } from "../../hooks/useAuthContext";

function Settings({ email }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useAuthContext(); // 🔥 get JWT

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    if (!user?.token) {
      setErrors({ submit: "Session expired. Please log in again." });
      return;
    }

    setIsSubmitting(true);

    try {
      const resp = await api.put(
        "/login/update",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}` // 🔥 send JWT
          }
        }
      );

      if (resp.data?.msg) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setErrors({});
      } else {
        setErrors({ submit: resp.data?.msg || "Password update failed" });
      }
    } catch (error) {
      console.error("Update password error:", error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.msg || "Failed to change password"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Change Password
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Password changed successfully!
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {["currentPassword", "newPassword", "confirmPassword"].map(
          (field, idx) => (
            <div className="mb-4" key={idx}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {field === "currentPassword"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
              </label>

              <input
                type="password"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors[field]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors[field] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[field]}
                </p>
              )}
            </div>
          )
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
