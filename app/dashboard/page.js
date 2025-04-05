// app/dashboard/page.jsx
"use client"; // Add this line to make the component a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { FaPlus } from 'react-icons/fa';
import HomePage from '@/components/HomePage';
import InterviewList from './_components/AllInterview';
import OptionsPage from './_components/interviewType';
import Link from 'next/link';
import { Code, Laptop2, ListChecks, Terminal } from 'lucide-react';

function Dashboard() {
  const router = useRouter(); // Initialize the useRouter hook
  
  const handleAddInterview = () => {
 router.push('/dashboard/interviewtype');
  };

  return (
    <div className=" mt-10 p-10 min-h-screen w-full flex flex-col bg-gray-900 text-gray-300">
      <h2 className='font-bold text-2xl flex items-center justify-center text-center'>Dashboard</h2>
      <button 
          onClick={handleAddInterview}
          className="absolute top-20 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
            <FaPlus className="text-lg" /> {/* Plus icon */}
          
        </button>

      <h2 className='text-gray-100 mt-[10px] flex items-center justify-center'>Create and Start Your AI Mockup Interview</h2>
      <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        What type of interview do you want?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
        <Link
          href="/dashboard/dsa"
          className="flex items-center gap-4 p-4 bg-blue-100 rounded-2xl hover:bg-blue-200 transition duration-300 shadow-md"
        >
          <Code className="w-6 h-6 text-blue-700" />
          <span className="text-lg font-medium">DSA Interview</span>
        </Link>

        <Link
          href="/dashboard/dsamcq"
          className="flex items-center gap-4 p-4 bg-green-100 rounded-2xl hover:bg-green-200 transition duration-300 shadow-md"
        >
          <ListChecks className="w-6 h-6 text-green-700" />
          <span className="text-lg font-medium">DSA MCQ</span>
        </Link>

        <Link
          href="/dashboard/development"
          className="flex items-center gap-4 p-4 bg-yellow-100 rounded-2xl hover:bg-yellow-200 transition duration-300 shadow-md"
        >
          <Laptop2 className="w-6 h-6 text-yellow-700" />
          <span className="text-lg font-medium">Development MCQ</span>
        </Link>

        <Link
          href="/dashboard/development-mcq"
          className="flex items-center gap-4 p-4 bg-purple-100 rounded-2xl hover:bg-purple-200 transition duration-300 shadow-md"
        >
          <Terminal className="w-6 h-6 text-purple-700" />
          <span className="text-lg font-medium">Development Interview</span>
        </Link>
      </div>
    </div>

      <div className=" rounded-lg shadow-md p-4 flex-1 h-1/2 md:h-full relative">
        

<InterviewList/>
    
      </div>
   
    </div>
  );
}

export default Dashboard;
