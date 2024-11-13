"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { db } from "../../utils/db";
import { MockInterview } from "../../utils/schema"; // Make sure this path is correct
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export function MockInterviewForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDesc: "",
    level: "",
    name: "",
    language: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await db.insert(MockInterview).values({
        id: uuidv4(), // Assuming you want to set a unique ID here
        jsonMockResp: JSON.stringify({}), // Assuming you can start with an empty JSON or modify as needed
        jobPosition: formData.jobPosition,
        jobDesc: formData.jobDesc,
        level: formData.level,
        name: formData.name,
        language: formData.language,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdOn: new Date(),
        mockId: uuidv4(), // Create a new mockId or whatever logic you need
      }).returning({ id: MockInterview.id });
      
      console.log(result); // Log the result for debugging
      toast("Mock Interview Created Successfully!");
      setTimeout(() => {
        router.push("/dashboard/mock-interview/" + result[0]?.id); // Redirect to the newly created interview page
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Failed to create Mock Interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-4 rounded-lg shadow-md bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Create Mock Interview</h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="jobPosition">Job Position</Label>
          <Input
            id="jobPosition"
            name="jobPosition"
            type="text"
            required
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="jobDesc">Job Description</Label>
          <Input
            id="jobDesc"
            name="jobDesc"
            type="text"
            required
            onChange={handleChange}
            placeholder="Describe the job position"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="level">Proficiency Level</Label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select your level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="mb-4">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="language">Preferred Language</Label>
          <Input
            id="language"
            name="language"
            type="text"
            required
            onChange={handleChange}
            placeholder="e.g. JavaScript, Python"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded-md p-2 w-full mt-4"
        >
          {loading ? "Creating..." : "Create Mock Interview"}
        </button>
      </form>
    </div>
  );
}
