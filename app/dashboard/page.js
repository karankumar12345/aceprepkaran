// app/dashboard/page.jsx
"use client"; // Add this line to make the component a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { FaPlus } from 'react-icons/fa';
import HomePage from '@/components/HomePage';
import InterviewList from './_components/AllInterview';
import OptionsPage from './_components/interviewType';

function Dashboard() {
  const router = useRouter(); // Initialize the useRouter hook

  const handleAddInterview = () => {
 router.push('/dashboard/interviewtype');
  };

  return (
    <div className=" mt-10 p-10 h- flex flex-col">
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <button
          onClick={handleAddInterview}
          className="absolute top-20 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
            <FaPlus className="text-lg" /> {/* Plus icon */}
          
        </button>
      <h2 className='text-gray-500'>Create and Start Your AI Mockup Interview</h2>

      <div className="bg-gray-100 rounded-lg shadow-md p-4 flex-1 h-1/2 md:h-full relative">
        
<InterviewList/>
        {/* Add New Interview Button */}
     
      </div>

    </div>
  );
}

export default Dashboard;
