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
import { chatSession } from "../../utils/GeminiAIModal";
import { db } from "../../utils/db";
import { DevelopmentMCQ, Interview } from "../../utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";


export function DsaForm() {
    const {toast} =useToast()
    const [formData,setFormData]=useState({
      name:"",
      experience: "",
      dsaTopics: "",
      level: "",
      language: "",
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
    const inputPrompt = `Generate 3 DSA interview questions with answers based on the following details:
  Name: ${formData.name}
  Years of Experience: ${formData.experience}
  DSA Topics: ${formData.dsaTopics}
  Proficiency Level: ${formData.level}
  Language: ${formData.language}. 
  Each question should include:
  1. The question itself.
  2. Two input examples (input and expected output).
  3. Code solutions (brute force and optimized) in JSON format. 
  IMPORTANT: Please return a valid JSON response, without any extra text or markdown.`;
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
      const result0 = await db.insert(Interview).values({
        interviewId: uuidv4(),
        jsoninterResp: JSON.stringify(jsonResponse),
        name: formData.name,
        experience: formData.experience,
        dsaTopics: formData.dsaTopics,
        level: formData.level,
        language: formData.language,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdOn: new Date(),
      }).returning({ interviewId: Interview.interviewId });
     
      console.log(result0); // Log DB insertion result

      toast("DSA Interview Questions Generated Successfully wait for sec to start")
       setTimeout(() => {
        router.push("/dashboard/dsa/" + result0[0]?.interviewId+"/start");
       }, 4000);
     
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
      DSA Question - Select Intersting Topic 
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

   
        <LabelInputContainer className="mb-8">
          <Label >DSA TOPIC</Label>
          <Input  placeholder="Array string Time and space"  name="dsaTopics" onChange={handleChange}  type="text" required />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label >Experience</Label>
          <Input  placeholder="How many times to do "  name="experience" onChange={handleChange}  type="number" required />
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
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit" disabled={loading}>
            {loading ? "Generating..." : "Submit and Start  Session"}
          <BottomGradient />
        </button>

     
      </form>

      {loading&& (
        <div className="mt-5 flex items-center justify-center space-x-2">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                 <p className="text-blue-500 font-medium">Generating DSA Question...</p>
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
