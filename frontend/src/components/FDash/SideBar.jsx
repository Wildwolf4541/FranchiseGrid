import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Home, TrendingUp, Users, History, Settings, LogOut, Menu } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { dispatch } = useAuthContext(); // 🔥 global logout

  const username =
    JSON.parse(localStorage.getItem("user"))?.username || "Guest";

  // Better active route matcher
  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const navItems = [
    { id: "maindash", label: "Dashboard", icon: <Home size={20} />, path: "/dash" },
    { id: "todaysales", label: "Today's Sale", icon: <TrendingUp size={20} />, path: "/dash/sales" },
    { id: "saleshistory", label: "Sales History", icon: <History size={20} />, path: "/dash/history" },
    { id: "employees", label: "Employees", icon: <Users size={20} />, path: "/dash/employees" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, path: "/dash/settings" },
  ];

  const handleLogout = () => {
    // 🔥 Clear only auth, not entire storage
    localStorage.removeItem("user");

    // 🔥 Update global auth state
    dispatch({ type: "LOGOUT" });

    // 🔥 Redirect to login
    navigate("/mainlogin", { replace: true });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Username Display */}
        <div className="bg-gray-800 p-4 text-center font-semibold">
          Username: {username}
        </div>

        <hr className="border-gray-700" />

        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)} // auto close on mobile
                className={`w-full p-3 rounded-md transition-colors duration-200 flex items-center ${
                  isActive(item.path)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-blue-400"
                }`}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full p-3 rounded-md bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideBar;
