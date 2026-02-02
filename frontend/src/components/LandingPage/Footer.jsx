import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaStore } from "react-icons/fa"; // ✅ Import a suitable icon

const Footer = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-linear-to-r from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        >
          {/* Brand Column */}
          <motion.div className="space-y-4" variants={fadeIn}>

            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500 flex items-center">
              <FaStore className="mr-2 text-teal-400" size={32} />
              Franchise<span className="text-teal-400">Grid</span>
            </div>

            <p className="text-gray-400 text-sm">
              Unlock your franchise's full potential with powerful tools and expert guidance.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" className="p-3 bg-white/10 rounded-full hover:bg-teal-400 hover:scale-110 transition duration-300">
                <FaFacebookF className="text-white w-5 h-5 hover:text-black" />
              </a>
              <a href="https://twitter.com" className="p-3 bg-white/10 rounded-full hover:bg-teal-400 hover:scale-110 transition duration-300">
                <FaTwitter className="text-white w-5 h-5 hover:text-black" />
              </a>
              <a href="https://instagram.com" className="p-3 bg-white/10 rounded-full hover:bg-teal-400 hover:scale-110 transition duration-300">
                <FaInstagram className="text-white w-5 h-5 hover:text-black" />
              </a>
              <a href="https://linkedin.com" className="p-3 bg-white/10 rounded-full hover:bg-teal-400 hover:scale-110 transition duration-300">
                <FaLinkedinIn className="text-white w-5 h-5 hover:text-black" />
              </a>
              <a href="https://youtube.com" className="p-3 bg-white/10 rounded-full hover:bg-teal-400 hover:scale-110 transition duration-300">
                <FaYoutube className="text-white w-5 h-5 hover:text-black" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-teal-400 transition">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition">Why Choose Us?</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-teal-400 transition">Meet Our Team</a></li>
              <li><a href="" className="text-gray-400 hover:text-teal-400 transition">Apply For Franchise</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition">Help & Support</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition">Franchise Handbook</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition">Blog & Insights</Link></li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MdLocationOn className="text-teal-400 w-5 h-5 mr-2" />
                <span className="text-gray-400 text-sm">115-D, Leela Bhavan, Patiala, India</span>
              </li>
              <li className="flex items-start">
                <MdPhone className="text-teal-400 w-5 h-5 mr-2" />
                <span className="text-gray-400 text-sm">+91 78886-79712</span>
              </li>
              <li className="flex items-start">
                <MdEmail className="text-teal-400 w-5 h-5 mr-2" />
                <span className="text-gray-400 text-sm">support@franchisegrid.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-white/5 py-4 mt-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} FranchiseGrid. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-teal-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-teal-400 transition">Terms & Conditions</Link>
            <Link to="/accessibility" className="text-gray-400 text-sm hover:text-teal-400 transition">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
