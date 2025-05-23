"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Interview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({

    experience: "",
    dsaTopics: "",
    level: "",
    language: "",
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
      alert("Login first")
      router.push("/sign-in")
      setLoading(false);
      return;
  }

    const inputPrompt = `
    Generate 3 DSA interview leetcode  questions with answers based on the following details:
    
    
    - Years of Experience: ${formData.experience}
    - DSA Topics: ${formData.dsaTopics}
    - Proficiency Level: ${formData.level}
    - Preferred Programming Language: ${formData.language}
    
    Each question should include:
    1. The question itself.
    2. Two input examples, each containing:
       - "input": a test case in a relevant format
       - "output": the expected result for that input
    
    The response should be a **valid JSON object** structured as follows:
    
    {
      "questions": [
        {
          "question": "Your DSA question here",
          "input_examples": [
            { "input": "test case 1", "output": "expected result 1" },
            { "input": "test case 2", "output": "expected result 2" }
          ]
        },
        {
          "question": "Another DSA question",
          "input_examples": [
            { "input": "test case 1", "output": "expected result 1" },
            { "input": "test case 2", "output": "expected result 2" }
          ]
        },
        {
          "question": "Third DSA question",
          "input_examples": [
            { "input": "test case 1", "output": "expected result 1" },
            { "input": "test case 2", "output": "expected result 2" }
          ]
        }
      ]
    }
    
    **IMPORTANT:**  
    - Return only the JSON object, without any additional text, explanations, or markdown formatting.
    - Ensure the JSON is well-formed and parsable.
    `;
    
    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();

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
        setResponse(jsonResponse);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Invalid JSON Format",
          description: "The response could not be parsed. Please try again.",
          status: "error",
        });
        return;
      }

      const result0 = await db
        .insert(Interview)
        .values({
          interviewId: uuidv4(),
          jsoninterResp: JSON.stringify(jsonResponse),
          name: user.primaryEmailAddress.emailAddress,
          experience: formData.experience,
          dsaTopics: formData.dsaTopics,
          level: formData.level,
          language: formData.language,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdOn: new Date(),
        })
        .returning({ interviewId: Interview.interviewId });

      console.log(result0); // Log DB insertion result

      toast({
        title: "Success",
        description: "DSA Interview Questions Generated Successfully. Please wait...",
        status: "success",
      });

      setTimeout(() => {
        router.push("/dashboard/dsa/" + result0[0]?.interviewId + "/start");
      }, 4000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

    <div className="max-w-md w-full mx-auto p-4 md:p-8 text-gray-200 rounded-md  bg-gray-900 dark:bg-gray-800 shadow-[0px_0px_48px_-6px_#ff24e1b3]">
      <h2 className="font-bold text-2xl text-gray-800 dark:text-white mb-4">
        Welcome to ACEPREP
      </h2>
      <p className="text-gray-200 text-sm dark:text-gray-300 mb-6">
        DSA Question - Select an interesting topic to start your session.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
      

        <div>
          <label className="block text-gray-200 dark:text-gray-200 mb-1">
            Language
          </label>
          <input
            placeholder="e.g., HTML, JS, Node.js"
            name="language"
            type="text"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-200 dark:text-gray-200 mb-1">
            DSA Topics
          </label>
          <input
            placeholder="e.g., Array, String, Time Complexity"
            name="dsaTopics"
            onChange={handleChange}
            type="text"
            required
            className="w-full p-2 border rounded-md bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-200 dark:text-gray-200 mb-1">
            Experience (in years)
          </label>
          <input
            placeholder="e.g., 2"
            name="experience"
            type="number"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-200 dark:text-gray-200 mb-1 bg-gray-900">
            Your Proficiency Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-gray-900"
          >
            <option value="" disabled>
              Select your level
            </option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-purple-600 rounded-md hover:bg-purple-200"
          disabled={loading}
        >
          {loading ? "Generating..." : "Submit and Start Session"}
        </button>
      </form>

      {loading && (
        <div className="mt-5 flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-blue-500 font-medium">Generating DSA Questions...</p>
        </div>
      )}
    </div>
    
    </div>
  );
};

export default Page;
