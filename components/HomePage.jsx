// HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      {/* Header Section */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-bold">Welcome to Our Website</h1>
        <p className="mt-4 text-lg">Your journey to success starts here!</p>
      </motion.header>

      {/* Main Content Section */}
      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-3xl font-semibold">Discover Amazing Features</h2>
        <p className="mt-2 text-center max-w-md">
          Explore our platform and unlock a world of opportunities tailored just for you.
        </p>

        {/* Buttons Section */}
        <div className="mt-8 flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-white text-blue-500 px-6 py-2 rounded-lg shadow-lg transition-transform"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-transparent border border-white px-6 py-2 rounded-lg transition-transform"
          >
            Learn More
          </motion.button>
        </div>
      </motion.main>

      {/* Footer Section */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-0 w-full text-center p-4"
      >
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
      </motion.footer>
    </div>
  );
};

export default HomePage;
