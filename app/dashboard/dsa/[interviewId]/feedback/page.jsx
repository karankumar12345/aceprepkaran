"use client";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { Answer } from "@/utils/schema";

const Page = ({ params }) => {
    const interviewId = params["interviewId"];
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const getFeedback = async () => {
            setLoading(true);
            try {
                const result = await db
                    .select()
                    .from(Answer)
                    .where(eq(Answer.interviewId, interviewId));

                if (result.length > 0) {
                    console.log("Feedback fetched successfully:", result);
                    setFeedbackData(result);
                    console.log(result[0].correctAnswer)

                } else {
                    setError("No feedback found for this interview ID.");
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback.");
            } finally {
                setLoading(false);
            }
        };
        getFeedback();
    }, [interviewId]);

    const handleSelect = (index) => {
        setShowFeedback((prev) => selectedQuestionIndex !== index || !prev);
        setSelectedQuestionIndex(index);
    };

    const renderCodeLineByLine = (codeArray) => {
        if (!Array.isArray(codeArray)) {
            return <div>Invalid code format</div>;
        }
    
        return codeArray.map((code, idx) => {
            if (typeof code !== "string") {
                return <div key={idx}>Invalid code format</div>;
            }
            return code.split("\n").map((line, lineIdx) => (
                <div key={`${idx}-${lineIdx}`} className=" p-1 rounded my-1">
                    {line}
                </div>
            ));
        });
    };
    
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-10 min-h-screen bg-gray-900 text-gray-200">
            <h2 className="text-3xl font-bold text-green-900">Congratulations!</h2>
            <h2 className="font-bold text-2xl">Here is Your Interview Feedback</h2>

            {feedbackData.length > 0 ? (
                <div>
                    <h3>Find Below Interview Questions with Correct Answers:</h3>
                    {feedbackData.map((feedback, index) => {
                        let correctAnswer = {};
                        try {
                            correctAnswer = feedback.correctAnswer
                                ? JSON.parse(feedback.correctAnswer)
                                : {};
                        } catch (e) {
                            console.error("Error parsing correctAnswer:", e);
                        }

                        const isActive = selectedQuestionIndex === index && showFeedback;

                        return (
                            <div key={index} className="my-4">
                                <h4 className="font-bold">{feedback.question}</h4>
                                <h5 className="text-primary text-lg my-1">
                                    Your Overall Rating: {feedback.rating || "N/A"}
                                </h5>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleSelect(index)}
                                >
                                    {isActive ? "Hide Details" : "View Details"}
                                </button>

                                {isActive && (
                                    <div className="mt-3 p-3 border rounded">
                                        <h5 className="font-semibold">Select Code Type:</h5>
                                        <select
                                            className="my-2 p-1 border rounded bg-gray-900"
                                            value={feedback.codeType || "optimized"}
                                            onChange={(e) =>
                                                setFeedbackData((prev) =>
                                                    prev.map((item, idx) =>
                                                        idx === index
                                                            ? { ...item, codeType: e.target.value }
                                                            : item
                                                    )
                                                )
                                            }
                                        >
                                            <option value="bruteForce">Brute Force</option>
                                            <option value="optimized">Optimized</option>
                                        </select>

                                        <h5 className="font-semibold mt-2">Correct Answer:</h5>
                                        {feedback.codeType === "bruteForce"
                                            ? renderCodeLineByLine(correctAnswer.bruteForce)
                                            : renderCodeLineByLine(correctAnswer.optimized)}

                                        <h5 className="font-semibold mt-4">Your Answer:</h5>
                                        <div className=" p-2 rounded">
                                            {feedback.userAnswer || "No answer provided."}
                                        </div>

                                        <h5 className="font-semibold mt-4">Feedback:</h5>
                                        <p>{feedback.feedback || "No feedback available."}</p>

                                        <h5 className="font-semibold mt-4">Code Feedback:</h5>
                                        <div className=" p-2 rounded">
                                            {feedback.codeFeedback || "No code feedback provided."}
                                        </div>

                                        <h5 className="font-semibold mt-4">Your Code:</h5>
                                        {renderCodeLineByLine(feedback.userAnswerCode)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No feedback data found.</p>
            )}
        </div>
    );
};

export default Page;
