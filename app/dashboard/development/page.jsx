
"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { chatSession } from '@/utils/GeminiAIModal';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';

 
const Page = () => {
 
    const [formData, setFormData] = useState({
        jobPosition: "",
        jobDesc: "",
        level: "",
      
        language: "",
    });
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    console.log(user)
    const router = useRouter();
    console.log(user)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!user || !user.primaryEmailAddress) {
            console.log("User not found");
            alert("Login first")
            setLoading(false);
            return;
        }

        const inputPrompt = `Generate exactly 5 Development questions with answers based on the following details:
        {
            
            "Language": "${formData.language}",
            "Proficiency Level": "${formData.level}",
            "Job Position": "${formData.jobPosition}",
            "Job Description": "${formData.jobDesc}"
        }
        Each question should be formatted as follows:
        {
          "questions": [
            {
              "question": "The question text here.",
              "correctAnswer": "The correct answer here.",
              "explanation": {
                "reason": "Explanation for the correct answer."
              }
            }
          ]
        }
        IMPORTANT: Please return a valid JSON response with no extra text or markdown.`;

        const result = await chatSession.sendMessage(inputPrompt);
        const responseText = await result.response.text();

        const clearRespo = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/##/g, "")
            .replace(/- /g, "")
            .trim();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(clearRespo);
            console.log("Parsed JSON Response", jsonResponse);
        } catch (error) {
            console.error("Invalid JSON format:", error);
            setLoading(false);
            return;
        }

        const result0 = await db.insert(MockInterview).values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(jsonResponse),
            name: user.primaryEmailAddress.emailAddress,
            jobPosition: formData.jobPosition,
            jobDesc: formData.jobDesc,
            language: formData.language,
            level: formData.level,
            difficulty: formData.level,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date(),
        }).returning({ mockId: MockInterview.mockId });

        console.log("Result 0:", result0);
        console.log(result0[0]?.mockId)
        router.push("/dashboard/developmentmcq/" + result0[0]?.mockId + "/start");
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center ">
            <div className="p-4 sm:p-6 lg:p-10 bg-gray-900 rounded-lg border border-spacing-2 border-red-100 shadow-[0px_0px_48px_-6px_#ff24e1b3] max-w-lg w-full h-1/2">
                <h1 className="text-3xl font-bold text-gray-200 mb-4 text-center">Welcome to AcePrep</h1>
                <h2 className="font-bold text-lg sm:text-xl mb-4 sm:mb-5 text-center text-gray-200">Development Questions</h2>
                <form onSubmit={handleSubmit}>
              
                    <div className="flex flex-col items-center mb-5">
                        <label className="text-gray-300 font-medium">Job Description</label>
                        <input type="text" name="jobDesc" value={formData.jobDesc} onChange={handleChange} placeholder="Describe the job role" required className="w-full p-2 border rounded-md mt-2 bg-gray-800 text-white" />
                    </div>
                    <div className="flex flex-col items-center mb-5">
                        <label className="text-gray-300 font-medium">Job Position</label>
                        <input type="text" name="jobPosition" value={formData.jobPosition} onChange={handleChange} placeholder="e.g., Software Engineer" required className="w-full p-2 border rounded-md mt-2 bg-gray-800 text-white" />
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
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            placeholder="C++, Java, Python, etc."
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
    );
}

export default Page;
