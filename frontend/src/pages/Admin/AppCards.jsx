import React from "react";
import emailjs from "@emailjs/browser";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

function AppCards({ obj, handleAccept, handleReject, handleFranchise }) {
  const generatePassword = () => {
    const length = 10;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  function doAccept() {
    const templateParams = {
      to_name: obj.name,
      to_email: obj.email,
      message: `Your application for ${obj.businessName} has been accepted.`,
    };

    emailjs.send(
      "service_franchise2",
      "template_y5dddn9",
      templateParams,
      "c8qkaIC0xwieuAiAG"
    ).then(
      () => {
        toast.success("Email sent successfully!");
        handleAccept();
      },
      () => {
        toast.error("Failed to send email.");
      }
    );
  }

  function doReject() {
    handleReject();
  }

  function doFranchise() {
    const username = obj.email;
    const password = generatePassword();

    const templateParams = {
      to_name: obj.name,
      to_email: obj.email,
      message: `Congratulations! You have been successfully granted your own franchise.

Your login credentials:
Username: ${username}
Password: ${password}

Please keep these credentials secure.`,
    };

    emailjs.send(
      "service_franchise2",
      "template_y5dddn9",
      templateParams,
      "c8qkaIC0xwieuAiAG"
    ).then(
      async () => {
        toast.success("Email with login credentials sent!");
        handleFranchise(username, password);
        await SaveLoginInfo(username, password);
      },
      () => {
        toast.error("Failed to send credentials email.");
      }
    );
  }

  async function SaveLoginInfo(username, password) {
    try {
      const resp = await api.post("/login", {
        username,
        password,
      });

      toast.success(resp.data.msg || "Login info saved");
    } catch (error) {
      console.error("Error saving login info:", error);
      toast.error(error.response?.data?.msg || "Failed to save login info");
    }
  }

  return (
    <div className="bg-gray-800 w-88 rounded-2xl shadow-xl p-5 transform hover:scale-105 transition duration-300">
      <h3 className="text-2xl font-semibold text-orange-400 text-center mb-2">
        {obj.name}
      </h3>

      <div className="mb-3 space-y-2 text-gray-300">
        <p><b>Email:</b> {obj.email}</p>
        <p><b>Contact No:</b> {obj.mobile}</p>
        <p><b>Address:</b> {obj.address}</p>
      </div>

      <hr className="border-gray-600 mb-1" />

      <h3 className="text-xl font-semibold text-white text-center mb-1">
        Business Details
      </h3>

      <hr className="border-gray-600 mb-3" />

      <div className="mb-5 space-y-2 text-gray-300">
        <p><b>Business Name:</b> {obj.businessName}</p>
        <p><b>Site Location:</b> {obj.siteLocation}</p>

        <div className="flex justify-between">
          <p><b>Area:</b> {obj.areaDimensions} sq.ft</p>
          <p><b>Floor:</b> {obj.floor}</p>
        </div>

        <div className="flex justify-between">
          <p><b>City:</b> {obj.city}</p>
          <p><b>State:</b> {obj.state}</p>
        </div>

        <p><b>Pin Code:</b> {obj.pinCode}</p>
        <p><b>Ownership Status:</b> {obj.ownershipStatus}</p>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={doAccept}
        >
          Accept
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={doReject}
        >
          Reject
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={doFranchise}
        >
          Franchise
        </button>
      </div>
    </div>
  );
}

export default AppCards;
