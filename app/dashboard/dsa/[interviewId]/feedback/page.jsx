"use client";
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { Answer } from '@/utils/schema';

const Page = ({ params }) => {
    const interviewId = params["interviewId"];
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [codeType, setCodeType] = useState("optimized");

    useEffect(() => {
        const getFeedback = async () => {
            setLoading(true);

            try {
                const result = await db
                    .select()
                    .from(Answer)
                    .where(eq(Answer.interviewId, interviewId));

                console.log("Interview ID:", interviewId);
                console.log("Feedback Data:", result);

                if (result.length > 0) {
                    setFeedbackData(result);
                } else {
                    setError("No feedback found for this interview ID.");
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setError("Failed to fetch feedback.");
            } finally {
                setLoading(false);
            }
        };

        getFeedback();
    }, [interviewId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleSelect = (index) => {
        if (selectedQuestionIndex === index) {
            setShowFeedback(!showFeedback);
        } else {
            setSelectedQuestionIndex(index);
            setShowFeedback(true);
        }
    };

    const renderCodeLineByLine = (code) => {
        if (!code || typeof code !== 'string') return <p>No code available.</p>;
        return code.split('\n').map((line, index) => (
            <div key={index} className='bg-gray-100 p-1 rounded my-1'>{line}</div>
        ));
    };

    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold text-green-900'>Congratulations!</h2>
            <h2 className='font-bold text-2xl'>Here is Your Interview Feedback</h2>

            {feedbackData.length > 0 && (
                <div>
                
                    <h2>Find Below Interview Questions with Correct Answers:</h2>

                    <div>
                        {feedbackData.map((feedback, index) => {
                            let correctAnswer = {};
                            try {
                                correctAnswer = feedback.correctAnswer ? JSON.parse(feedback.correctAnswer) : {};
                            } catch (e) {
                                console.error("Error parsing correctAnswer:", e);
                            }

                            return (
                                <div key={index} className='my-3'>
                                    <h3 className='font-bold'>{feedback.question}</h3>
                                    <h4 className='text-primary text-lg my-1'>
                                        Your Overall Rating: {feedback.rating || "N/A"}
                                    </h4>
                                    <button 
                                        className='bg-blue-500 text-white px-2 py-1 rounded' 
                                        onClick={() => handleSelect(index)}
                                    >
                                        Select
                                    </button>

                                    {selectedQuestionIndex === index && showFeedback && (
                                        <div className='mt-2'>
                                            <h4 className='font-semibold'>Select Code Type:</h4>
                                            <select
                                                className='my-2 p-1 border rounded'
                                                value={codeType}
                                                onChange={(e) => setCodeType(e.target.value)}
                                            >
                                                <option value="brute_force">Brute Force</option>
                                                <option value="optimized">Optimized</option>
                                            </select>

                                            <h4 className='font-semibold'>Correct Answer:</h4>
                                            <div className='bg-gray-100 p-2 rounded'>
                                                {codeType === "brute_force" ? (
                                                    correctAnswer.brute_force ? (
                                                        renderCodeLineByLine(correctAnswer.brute_force.code)
                                                    ) : (
                                                        <p>No brute force code available.</p>
                                                    )
                                                ) : (
                                                    correctAnswer.optimized ? (
                                                        renderCodeLineByLine(correctAnswer.optimized.code)
                                                    ) : (
                                                        <p>No optimized code available.</p>
                                                    )
                                                )}


                                            </div>

                                            <h4 className='font-semibold'>Your Answer:</h4>
                                            <div className='bg-gray-100 p-2 rounded'>{feedback.userAnswer || "No answer provided."}</div>
                                            <h2 className='text-primary text-lg my-3'>
                        Your Overall Rating: {feedbackData.rating}
                    </h2>
                                            <h4 className='font-semibold'>Feedback:</h4>
                                            <p>{feedback.feedback || "No feedback available."}</p>
                                            <h4 className='font-semibold'>Your Code Feedback</h4>
                                            <div className='bg-gray-100 p-2 rounded'>{feedback.codeFeedback || "No code feedback provided."}</div>

                                            <h4 className='font-semibold'>Your Code:</h4>
                                            {feedback.userAnswerCode ? (
                                                renderCodeLineByLine(feedback.userAnswerCode)
                                            ) : (
                                                <p>No code available.</p>
                                            )}
                                            
                                            <div className='mt-3'>
                                                <h4 className='font-semibold'>Suggested Improvement:</h4>
                                                <p>
                                                    The user could explain why the string is not a palindrome, 
                                                    highlighting the differences between the first and second half of the string.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
