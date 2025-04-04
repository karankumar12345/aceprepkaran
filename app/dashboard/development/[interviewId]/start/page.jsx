"use client";
import { useState, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Question from "./_components/Question";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/utils/db";
import { DevelopmentMCQ, DeveMCQAnswer } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

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
    GetInterviewDetails();
  }, [params]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db
        .select()
        .from(DevelopmentMCQ)
        .where(eq(DevelopmentMCQ.DevelopmentMCQId, params.interviewId));

      if (result.length > 0) {
        try {
          const jsonInterviewResp = JSON.parse(result[0].jsondevmcqResp);
          setInterviewDetails(jsonInterviewResp.questions);
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
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const interviewId = params.interviewId;
    const userEmail = user?.primaryEmailAddress?.emailAddress || "";

    try {
      await Promise.all(
        interviewDetails.map(async (question, index) => {
          const userAnswer = selectedOptions[index] || "";

          const existingAnswer = await db
            .select()
            .from(DeveMCQAnswer)
            .where(
              and(
                eq(DeveMCQAnswer.interviewIdRef, interviewId),
                eq(DeveMCQAnswer.questions, question.question),
                eq(DeveMCQAnswer.userEmail, userEmail)
              )
            );

          if (existingAnswer.length > 0) {
            await db
              .update(DeveMCQAnswer)
              .set({
                userAnswers: userAnswer,
                correctAnswers: question.correctAnswer,
                createdOn: new Date(),
              })
              .where(
                and(
                  eq(DeveMCQAnswer.interviewIdRef, interviewId),
                  eq(DeveMCQAnswer.questions, question.question),
                  eq(DeveMCQAnswer.userEmail, userEmail)
                )
              );
          } else {
            await db.insert(DeveMCQAnswer).values({
              DevelopmentMCQId: uuidv4(),
              interviewIdRef: interviewId,
              questions: question.question,
              correctAnswers: question.correctAnswer,
              userAnswers: userAnswer,
              userEmail,
              createdBy: userEmail,
              createdOn: new Date(),
            });
          }
        })
      );

      setTimeout(() => {
        router.push(`/dashboard/development/${interviewId}/feedback`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers: " + error.message);
    }
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
            onOptionSelect={handleOptionSelect}
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
