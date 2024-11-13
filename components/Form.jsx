"use client";
import React,{useState} from "react";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Toast } from "./ui/toast";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { DevelopmentMCQ } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";


export function SignupFormDemo() {
    const {toast} =useToast()
    const [formData,setFormData]=useState({
      name:"",
      Languages:"",
      level:"",

    category:""
    })
    const [loading,setLoading]=useState(false)
    const [response,setResponse]=useState(null)
    const {user} =useUser();
    const router =useRouter();

    const handleChange=(e)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value
      })
    }   

  const handleSubmit =async (e) => {
    e.preventDefault();
    setLoading(true)
    const inputPrompt = `Generate exactly 20 DEVELOPMENT MCQs with answers based on the following details:
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
        // Include 19 more question objects
      ]
    }
    
    IMPORTANT: Please return a valid JSON response with no extra text or markdown.`;
    try {
        const result=await chatSession.sendMessage(inputPrompt);
        const responseText=await result.response.text();
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
        toast("Invalid JSON Format ")
        
      }
      const result0 = await db.insert(DevelopmentMCQ).values({
        DevelopmentMCQId : uuidv4(),
        jsondevmcqResp: JSON.stringify(jsonResponse),
        name: formData.name,
        language: formData.language,
        level: formData.level,
        category: formData.category,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
      }).returning({  DevelopmentMCQId: DevelopmentMCQ.DevelopmentMCQId });
     
      console.log(result0); // Log DB insertion result
   
      router.push("/dashboard/development/" + result0[0]?.DevelopmentMCQId+"/start");
    } catch (error) {
        setLoading(false)
        toast("Something went wrong")
        
    }finally {
      setLoading(false); // Stop loading
    }

  
  };
  return (
    (<div
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to ACEPREP
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
      Development MCQ Question - Select Intersting Topic 
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Your Name </Label>
            <Input onChange={handleChange} placeholder="Karan Kumar"  name="name"  type="text" required />
          </LabelInputContainer>
  
        </div>
        <LabelInputContainer className="mb-4">
          <Label >Language</Label>
          <Input placeholder="eg HTML JS Node js " type="text"   name="language"  required onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label >Your Proficiency Level</Label>
          <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md mt-2"
            >
              <option value="" disabled>Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
        </LabelInputContainer>
   
        <LabelInputContainer className="mb-8">
          <Label >Category</Label>
          <Input  placeholder="eg frontend backend mern stack"  name="category" onChange={handleChange}  type="text" required />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit" disabled={loading}>
            {loading ? "Generating..." : "Submit and Start MCQ Session"}
          <BottomGradient />
        </button>

     
      </form>

      {loading&& (
        <div className="mt-5 flex items-center justify-center space-x-2">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                 <p className="text-blue-500 font-medium">Generating MCQs...</p>
        </div>
      )}
    </div>)
  );
}

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>)
  );
};
