"use client";
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterviewAnswer } from '@/utils/schema';

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
          console.log("karan")
          console.log(interviewId)
            try {
                const result = await db
                    .select()
                    .from(MockInterviewAnswer)
                    .where(eq(MockInterviewAnswer.interviewId, interviewId));
                
                console.log("Query Result:", result); // Add this to log the full query result
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
    console.log(feedbackData)

    return (
        <div className='p-10 bg-gray-900 text-gray-200 min-h-screen '>
            <h2 className='text-3xl font-bold text-green-900'>Congratulations!</h2>
            <h2 className='font-bold text-2xl'>Here is Your Interview Feedback</h2>

            {feedbackData.length > 0 && (
                <div>
                    {/* Overall Rating Display */}
                    <h2 className='text-primary text-lg my-3'>
                        Your Overall Rating: {feedbackData.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbackData.length || "N/A"}
                    </h2>
                    <h2>Find Below Interview Questions with Correct Answers:</h2>

                    <div>
                        {feedbackData.map((feedback, index) => {
                       

                            return (
                                <div key={index} className='my-3'>
                                    <h3 className='font-bold'>{feedback.question}</h3>
                                    <button 
                                        className='bg-blue-500 text-white px-2 py-1 rounded' 
                                        onClick={() => handleSelect(index)}
                                    >
                                        Select
                                    </button>

                                    {selectedQuestionIndex === index && showFeedback && (
                                        <div className='mt-2'>
                                            <h4 className='font-semibold'>Your Answer:</h4>
                                            <div className='bg-gray-900 p-2 rounded'>{feedback.userAnswer || "No answer provided."}</div>

                                            <h4 className='font-semibold'>Feedback:</h4>
                                            <p>{feedback.feedback || "No feedback available."}</p>

                                            
                                            <div className='mt-3'>
                                                <h4 className='font-semibold'> correct Answer :</h4>
                                                <p>
                                                   {feedback.correctAnswer}
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
