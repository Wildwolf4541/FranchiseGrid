import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router";
import { FaStore } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#1e2939] px-6 py-4 shadow-md border-b border-gray-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center text-2xl font-bold text-white">
          <FaStore className="mr-2 text-teal-400" size={26} />
          <span className="text-teal-400">Franchise</span>
          <span className="ml-1 text-blue-400">Grid</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center space-x-8 lg:flex">
          <a
            href="#home"
            className="text-lg text-gray-300 transition hover:text-teal-400"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-lg text-gray-300 transition hover:text-teal-400"
          >
            Services
          </a>
          <a
            href="#team"
            className="text-lg text-gray-300 transition hover:text-teal-400"
          >
            Team
          </a>
          <a
            href="#footer"
            className="text-lg text-gray-300 transition hover:text-teal-400"
          >
            Support
          </a>

          <Link
            to="/Mainlogin"
            className="rounded-full bg-linear-to-r from-blue-500 to-teal-500 px-5 py-2 font-semibold text-white shadow-md transition hover:scale-105"
          >
            Franchise Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-3xl text-white lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 flex flex-col space-y-4 rounded-lg bg-gray-900 p-4 lg:hidden">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 transition hover:text-teal-400"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 transition hover:text-teal-400"
          >
            Services
          </a>
          <a
            href="#team"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 transition hover:text-teal-400"
          >
            Team
          </a>
          <a
            href="#footer"
            onClick={() => setIsOpen(false)}
            className="text-gray-300 transition hover:text-teal-400"
          >
            Support
          </a>

          <Link
            to="/Mainlogin"
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-linear-to-r from-blue-500 to-teal-500 px-4 py-2 text-center font-semibold text-white shadow-md transition hover:scale-105"
          >
            Franchise Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
