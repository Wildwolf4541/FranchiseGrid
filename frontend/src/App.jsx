import React from "react";
import { Routes, Route, Navigate } from "react-router";

import Landingpage from "./pages/LandingPage";
import Form from "./pages/Form";
import MainLogin from "./pages/Mainlogin";

import Applications from "./pages/Admin/Applications";
import AppCards from "./pages/Admin/AppCards";

import FranchiseRoute from "./components/FDash/FranchiseRoute";
import MainDash from "./pages/MainDash";
import Todaysales from "./components/FDash/Todaysales";
import Saleshistory from "./components/FDash/Saleshistory";
import Employees from "./components/FDash/Employees";
import Settings from "./components/FDash/Settings";

import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/form" element={<Form />} />

        {/* Login */}
        <Route
          path="/mainlogin"
          element={!user ? <MainLogin /> : <Navigate to="/dash" />}
        />

        {/* Admin (unchanged) */}
        <Route path="/display" element={<Applications />} />
        <Route path="/card" element={<AppCards />} />

        {/* Franchise Dashboard (OUTLET + AUTH) */}
        <Route
          path="/dash"
          element={user ? <FranchiseRoute /> : <Navigate to="/mainlogin" />}
        >
          <Route index element={<MainDash />} />
          <Route path="sales" element={<Todaysales />} />
          <Route path="history" element={<Saleshistory />} />
          <Route path="employees" element={<Employees />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
