"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import { chatSession } from '@/utils/GeminiAIModal';
import { db } from '@/utils/db';
import { DsaMcq } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';

const page = () => {
    const [formData, setFormData] = useState({
        name: "",
        language: "",
        level: "",
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const { user } = useUser();
    const router = useRouter();

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
            setLoading(false);
            return;
        }


        const inputPrompt = `Generate exactly 20 DSA MCQs with answers based on the following details:
        {
            "Name": "${formData.name}",
            "Language": "${formData.language}",
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
          ]
        }
        IMPORTANT: Please return a valid JSON response with no extra text or markdown.`;

        const result=await chatSession.sendMessage(inputPrompt);
        const responseText=await result.response.text();


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

        const result0 = await db.insert(DsaMcq).values({
            DSAMCQId: uuidv4(),
            jsondsaResp: JSON.stringify(jsonResponse),
            name: formData.name,
            language: formData.language,
            difficulty: formData.level,
            category: formData.category,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date(),
        }).returning({ DSAMCQId: DsaMcq.DSAMCQId });



        console.log("Result 0:", result0);
        router.push("/dashboard/dsamcq/" + result0[0]?.DSAMCQId+"/start");
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="p-4 sm:p-6 lg:p-10 bg-gray-200 rounded-lg shadow-lg max-w-lg w-full h-1/2">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome to AcePrep</h1>
                <h2 className="font-bold text-lg sm:text-xl mb-4 sm:mb-5 text-center">DSA MCQ</h2>
                <form onSubmit={handleSubmit}>
    <div className="flex flex-col items-center">
        <label className="text-gray-600 font-medium">Enter Your Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Karan Kumar" required className="w-full p-2 border rounded-md mt-2" />
    </div>
    <div className="flex flex-col items-center">
        <label className='text-gray-500 font-medium'>Your Proficient Level</label>
        <select
            name="level"
            onChange={handleChange}
            value={formData.level}
            required
            className='w-full p-2 border rounded-md mt-2'
        >
            <option value="" disabled>Select Your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
        </select>
    </div>

    <div className="flex flex-col items-center">
        <label className='text-gray-600 font-medium'>Enter Topic Name</label>
        <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Array, String, etc."
            required
            className="w-full p-2 border rounded-md mt-2"
        />
    </div>

    <div className="flex flex-col items-center">
        <label className="text-gray-700 font-medium">Programming Language</label>
        <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="C++, Java, Python, etc."
            required
            className="w-full p-2 border rounded-md mt-2"
        />
    </div>

    <div>
        <button
            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-transform duration-300 py-2 rounded-md mt-5"
            type="submit"
            disabled={loading}
        >
            {loading ? "Generating..." : "Submit and Start MCQ Session"}
        </button>
    </div>
</form>


                {loading && (
                    <div className="mt-5 flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="text-blue-500 font-medium">Generating MCQ questions...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default page;
