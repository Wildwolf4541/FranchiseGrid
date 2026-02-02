import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const FirstSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-950 px-6 text-white">
      <div className="max-w-5xl w-full text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-teal-400">Transform</span> Your Career with Our  
          <span className="text-blue-400"> Elite</span> Franchise Network
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Step into entrepreneurship with an award-winning franchise program, backed by industry-leading systems and a passionate support community.
        </motion.p>
        
        <motion.div 
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link 
            to='/Form' 
            className="bg-linear-to-r from-teal-500 to-blue-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Apply For Franchise
          </Link>
          <Link 
            to='/Mainlogin' 
            className="bg-linear-to-r from-teal-500 to-blue-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Franchise Login
          </Link>
        </motion.div>

        <motion.div 
          className="mt-10 flex justify-center gap-32 bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">750+</p>
            <p className="text-gray-300 text-sm">Global Partners</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">97%</p>
            <p className="text-gray-300 text-sm">Retention Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">365</p>
            <p className="text-gray-300 text-sm">Days of Guidance</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FirstSection;
