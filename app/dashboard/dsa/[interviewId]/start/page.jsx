"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/utils/db";
import { Answer, Interview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Question from "./_components/Question";
import RecordAnswer from "./_components/RecordAnswer";

const Page = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState({});
  const [userCode, setUserCode] = useState({});
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interviewId;

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    fetchInterviewDetails();
  }, [params.interviewId]); // Only fetch when interviewId changes

  const fetchInterviewDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(Interview)
        .where(eq(Interview.interviewId, interviewId));

        console.log(result)
    

      const jsonInterviewResp = JSON.parse(result[0].jsoninterResp);
      setInterviewDetails(jsonInterviewResp);
      console.log(interviewDetails)
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

  const handleFeedbackChange = (value) => {
    setFeedback((prev) => ({ ...prev, [activeQuestionIndex]: value }));
  };

  const handleRatingChange = (value) => {
    setRating((prev) => ({ ...prev, [activeQuestionIndex]: value }));
  };

  const handleCodeChange = (code) => {
    setUserCode((prev) => ({ ...prev, [activeQuestionIndex]: code }));
  };

  const handleNext = () => {
    setActiveQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, interviewDetails.length - 1)
    );
  };

  const handlePrev = () => {
    setActiveQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSubmit = async () => {
    
    router.push(`/dashboard/dsa/${interviewId}/feedback`);
  };

  return (
    <div className="scroll-smooth">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 my-3">
          <Question
            questions={interviewDetails}
            activeQuestionIndex={activeQuestionIndex}
            selectedOption={selectedOptions[activeQuestionIndex]}
            feedback={feedback[activeQuestionIndex] || ""}
            rating={rating[activeQuestionIndex] || ""}
            userCode={userCode[activeQuestionIndex] || ""}
            onOptionSelect={handleOptionSelect}
            onFeedbackChange={handleFeedbackChange}
            onRatingChange={handleRatingChange}
            onCodeChange={handleCodeChange}
          />

          <RecordAnswer
            activeQuestionIndex={activeQuestionIndex}
            mockInterviewQuestion={interviewDetails}
            interviewId={params.interviewId}
          />

          <div className="mt-5 flex space-x-3">
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
