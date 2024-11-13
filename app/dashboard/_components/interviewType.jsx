// pages/OptionsPage.jsx
"use client"
import React from 'react';
import Link from 'next/link';

const OptionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-yellow-600 text-5xl mb-6">Which Type of Interview Do You Want?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/DsaInput">
          <button className="bg-green-500 text-white text-2xl py-4 rounded hover:bg-green-600 w-full">
            DSA Questions
          </button>
        </Link>
        <Link href="/dashboard/DSAMCQ">
          <button className="bg-blue-500 text-white text-2xl py-4 rounded hover:bg-blue-600 w-full">
            DSA MCQ
          </button>
        </Link>
        <Link href="/dashboard/Development">
          <button className="bg-purple-500 text-white text-2xl py-4 rounded hover:bg-purple-600 w-full">
            Development
          </button>
        </Link>
        <Link href="/dashboard/DevelopmentMCQ">
          <button className="bg-red-500 text-white text-2xl py-4 rounded hover:bg-red-600 w-full">
            Development MCQ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OptionsPage;
