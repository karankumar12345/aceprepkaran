"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterviewAnswer, MockInterview } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import Question from "./_components/Question";
import RecordAnswer from "./_components/RecordAnswer"; // Importing RecordAnswer

const Page = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    fetchInterviewDetails();
  }, [params]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params["interviewId"]));

      if (result.length > 0) {
        try {
          const jsonInterviewResp = JSON.parse(result[0].jsonMockResp);
          setInterviewDetails(jsonInterviewResp.questions);
          console.log("Interview Details:", jsonInterviewResp.questions);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
          setError("Invalid interview data format.");
        }
      } else {
        setError("No interview data found.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Error fetching interview details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOptions((prev) => ({ ...prev, [activeQuestionIndex]: option }));
  };

  const handleNext = () => {
    setActiveQuestionIndex((prevIndex) => Math.min(prevIndex + 1, interviewDetails.length - 1));
  };

  const resetText=()=>{
    
  }
  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
   router.push(`/dashboard/development/${params.interviewId}/feedback`);
  };

  return (
    <div className="scroll-smooth mt-[100px] min-h-screen bg-gray-900">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 my-3  text-gray-200 bg-gray-900">
          <Question
            questions={interviewDetails}
            activeQuestionIndex={activeQuestionIndex}
            onOptionSelect={handleOptionSelect} // Pass option select handler
          />
          <RecordAnswer
            activeQuestionIndex={activeQuestionIndex}
            mockInterviewQuestion={interviewDetails}
            interviewId={params.interviewId}
          />
          <div className="mt-5 flex space-x-3 text-gray-200">
            <Button onClick={handlePrev} disabled={activeQuestionIndex === 0}>
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={activeQuestionIndex === interviewDetails.length - 1}
            >
              Next
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={activeQuestionIndex !== interviewDetails.length - 1}
            >
              Submit All Answers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
