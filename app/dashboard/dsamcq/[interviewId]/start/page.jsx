"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/utils/db";
import { DsaMcq, DSAMCQAnswer } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";
import DSAMCQ from "./_componets/DSAMCQ";


const Page = ({ params }) => {
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    GetInterviewDetails();
  }, [params]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(DsaMcq)
        .where(eq(DsaMcq.DSAMCQId, params["interviewId"]));

      if (result.length > 0) {
        const jsonInterviewResp = JSON.parse(result[0].jsondsaResp);
        setInterviewDetails(jsonInterviewResp.questions); // Ensure you set questions directly
      } else {
        setError("No interview details found.");
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
  const handleSubmit = async () => {
    const interviewId = params.interviewId;
    const userEmail = user?.primaryEmailAddress?.emailAddress || "";

    console.log("Interview ID:", interviewId);
    console.log("Selected Options Before Submission:", selectedOptions);

 
    try {
        // Iterate over all interview questions and update or insert each answer
        await Promise.all(
            interviewDetails.map(async (question, index) => {
                const userAnswer = selectedOptions[index] || null; // Use null if no answer is selected

                console.log("Processing question:", question.question);
                console.log("User answer:", userAnswer);

                // Check if an entry already exists for this answer
                const existingAnswer = await db
                    .select()
                    .from(DSAMCQAnswer)
                    .where(
                        and(
                            eq(DSAMCQAnswer.interviewIdRef, interviewId),
                            eq(DSAMCQAnswer.question, question.question),
                            eq(DSAMCQAnswer.userEmail, userEmail)
                        )
                    );

                console.log("Existing answer found:", existingAnswer);

                if (existingAnswer.length > 0) {
                    // Update the existing entry if found
                    await db
                        .update(DSAMCQAnswer)
                        .set({
                          userAnswer: userAnswer, // Update user answer
                          correctAnswer: question.correctAnswer, // Correct answer from question
                          createdOn: new Date(), // Update timestamp
                        })
                        .where(
                            and(
                                eq(DSAMCQAnswer.interviewIdRef, interviewId),
                                eq(DSAMCQAnswer.question, question.question),
                                eq(DSAMCQAnswer.userEmail, userEmail)
                            )
                        );
                    console.log("Updated answer for question:", question.question);
                } else {
                    // Insert a new entry if none exists
                    await db.insert(DSAMCQAnswer).values({
                      DSAMCQId:uuidv4(),
                        interviewIdRef: interviewId,
                        question: question.question,
                        correctAnswer: question.correctAnswer,
                        userAnswer,
                        userEmail,
                        createdBy: userEmail,
                        createdOn: new Date(),
                    });
                    console.log("Inserted new answer for question:", question.question);
                }
            })
        );

        console.log("All answers submitted successfully.");
        // Redirecting after a delay for better user experience
        setTimeout(() => {
            router.push(`/dashboard/dsamcq/${interviewId}/feedback`);
        }, 2000);
    } catch (error) {
        console.error("Error submitting answers:", error);
        alert("Failed to submit answers: " + error.message);
    }
};

  
  const handleNext = () => {
    if (activeQuestionIndex < interviewDetails.length - 1) {
      setActiveQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="scroll-smooth shadow-[0px_0px_48px_-6px_#ff24e1b3] min-h-screen bg-gray-900 text-gray-200">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 my-3">
          <DSAMCQ
            questions={interviewDetails}
            activeQuestionIndex={activeQuestionIndex}
            selectedOption={selectedOptions[activeQuestionIndex]}
            onOptionSelect={handleOptionSelect}
          />
          <div className="mt-5 flex space-x-3 justify-around">
            <button
              onClick={handlePrev}
              disabled={activeQuestionIndex === 0}
              className={`px-4 py-2 rounded shadow-lg transition duration-300 
                  ${activeQuestionIndex === 0 ? 'bg-gray-300 text-gray-500 hover:scale-[1.4] rounded-ful' : 'bg-blue-600 text-white l hover:bg-blue-700 hover:scale-[1.4] rounded-full'}`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={activeQuestionIndex === interviewDetails.length - 1}
              className={`px-4 py-2 rounded shadow-lg transition duration-300 
                  ${activeQuestionIndex === interviewDetails.length - 1 ? 'bg-gray-300 text-gray-500 ' : 'bg-blue-600 text-white '}`}
            >
              Next
            </button>
            {activeQuestionIndex === interviewDetails.length - 1 && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-green-500 text-white rounded shadow-lg hover:bg-green-600 transition duration-300"
              >
                Submit All Answers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

// DSAMCQ Component
