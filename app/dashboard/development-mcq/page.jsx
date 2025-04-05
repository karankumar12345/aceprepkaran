"use client"

import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAIModal';
import { DevelopmentMCQ } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const page = () => {
  const [formData,setFormData]=useState({
    languages:"",
    level:"",
    category:"",
    questions:""

  })
  const [loading,setLoading]=useState(false);
  const [response,setResponse]=useState(null);
  const {user}=useUser();
  const router=useRouter();

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};
const handleSubmit =async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!user || !user.primaryEmailAddress) {
      console.log("User not found");
      alert("Login first")
      router.push("sign-in")
      setLoading(false);
      return;
  }
    const inputPrompt = `Generate exactly ${formData.questions} DEVELOPMENT MCQs with answers based on the following details:
    {
       
        "Language": "${formData.languages}",
        "Proficiency Level": "${formData.level}",
        "Category": "${formData.category}"
    }
    Each question should be formatted as follows:
    {
      "questions": [
        {
          "question": "The question text here.",
          "options": [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4"
          ],
          "correctAnswer": "The correct answer here.",
          "explanation": {
            "reason": "Explanation for the correct answer."
          }
        }
       ${formData.questions} more questions
      ]
    }
    
    IMPORTANT: Please return a valid JSON response with no extra text or markdown.`;
    try {
      console.log("karan")
        const result=await chatSession.sendMessage(inputPrompt);
        const responseText=await result.response.text();
        console.log(responseText)
          // Clean up the response
      const cleanResponse = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/##/g, "")
      .replace(/- /g, "")
      .trim();
      let jsonResponse;

      try {
        jsonResponse = JSON.parse(cleanResponse);
        console.log("Parsed JSON Response", jsonResponse);
        setResponse(jsonResponse)
       
        
      } catch (error) {
        setLoading(false)
        console.log("Invalid JSON Format ")
        
      }
      const result0 = await db.insert(DevelopmentMCQ).values({
        DevelopmentMCQId : uuidv4(),
        jsondevmcqResp: JSON.stringify(jsonResponse),
        name: user.primaryEmailAddress.emailAddress,
        language: formData.languages,
        level: formData.level,
        category: formData.category,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
      }).returning({  DevelopmentMCQId: DevelopmentMCQ.DevelopmentMCQId });
     
      console.log(result0); // Log DB insertion result
   
      router.push("/dashboard/development-mcq/" + result0[0]?.DevelopmentMCQId+"/start");
    } catch (error) {
        setLoading(false)
        console.log("Something went wrong")
        
    }finally {
      setLoading(false); // Stop loading
    }

  
  };
  return (
    <div className='flex  items-center justify-center min-h-screen'>
      <div className='p-4 sm:p-6 lg:p-10 bg-gray-900 rounded-lg border border-spacing-2 border-red-100 shadow-[0px_0px_48px_-6px_#ff24e1b3] max-w-lg w-full h-1/2' >
      <h1 className="text-3xl font-bold text-gray-200 mb-4 text-center">Welcome to AcePrep</h1>
      <h2 className="font-bold text-lg sm:text-xl mb-4 sm:mb-5 text-center text-gray-200">Development Questions</h2>
      <form onSubmit={handleSubmit}>
  
                    <div className="flex flex-col items-center mb-5">
                        <label className="text-gray-300 font-medium">Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Software Engineer" required className="w-full p-2 border rounded-md mt-2 bg-gray-800 text-white" />
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <label className='text-gray-100 font-medium'>Your Proficiency Level</label>
                        <select
                            name="level"
                            onChange={handleChange}
                            value={formData.level}
                            required
                            className='w-full text-white p-2 border rounded-md mt-2 mb-5 bg-gray-800'
                        >
                            <option value=""  disabled>Select Your level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <label className="text-gray-200 font-medium">Programming Language</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            placeholder="C++, Java, Python, etc."
                            required
                            className="w-full p-2 text-white border rounded-md mt-2 bg-gray-800"
                        />
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <label className="text-gray-200 font-medium">No Of Question </label>
                        <input
                            type="text"
                            name="questions"
                            value={formData.questions}
                            onChange={handleChange}
                            placeholder="1 2 3 etc"
                            required
                            className="w-full p-2 text-white border rounded-md mt-2 bg-gray-800"
                        />
                    </div>
                    <div>
                        <button
                            className="w-full bg-blue-500 text-white hover:bg-blue-300 transition-transform duration-300 py-2 rounded-md mt-5"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Submit and Start Question Session"}
                        </button>
                    </div>
                </form>
                {loading && (
                    <div className="mt-5 flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-blue-500 font-medium">Generating questions...</p>
                    </div>
                )}
            </div>
        </div>
  )
}

export default page
