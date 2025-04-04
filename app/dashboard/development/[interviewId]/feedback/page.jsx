"use client";
import { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { DeveMCQAnswer } from '@/utils/schema';
import { Volume2 } from 'lucide-react';

const FeedbackPage = ({ params }) => {
  const { interviewId } = params; // Extract the interview ID from the params
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    fetchFeedback();
  }, [interviewId]);

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported');
    }
  };

  const fetchFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(DeveMCQAnswer)
        .where(eq(DeveMCQAnswer.interviewIdRef, interviewId))
        .orderBy(DeveMCQAnswer.createdOn, 'asc');

      if (result.length === 0) {
        setError("No feedback data found for this interview.");
        return;
      }

      setFeedbackData(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("An error occurred while fetching feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleNext = () => {
    if (currentQuestionIndex < feedbackData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentFeedback = feedbackData[currentQuestionIndex];
  const isCorrect = currentFeedback?.userAnswers === currentFeedback?.correctAnswers;

  return (
    <>

    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-900'>Feedback</h2>
      <h3 className='font-bold text-2xl'>Question #{currentQuestionIndex + 1}</h3>
      
      <div className={`p-4 my-3 border rounded ${isCorrect ? 'bg-blue-100' : 'bg-red-100'}`}>
        <h4 className='font-semibold'>Question:</h4>
        <p>{currentFeedback?.questions}</p>

        <h4 className='font-semibold'>Your Answer:</h4>
        <p>{currentFeedback?.userAnswers || 'No answer provided'}</p>

        <h4 className='font-semibold'>Correct Answer:</h4>
        <p>{currentFeedback?.correctAnswers}</p>

        <h4 className='font-semibold'>Explanation:</h4>
        <p>
          {isCorrect
            ? 'Your answer is correct!'
            : `Your answer is incorrect. The correct answer is "${currentFeedback?.correctAnswers}".`}
        </p>
        <Volume2 onClick={() => textToSpeech(`The correct answer is ${currentFeedback?.correctAnswers}`)} className='cursor-pointer' />
      </div>

      <div className='flex justify-between mt-5'>
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${currentQuestionIndex === 0 ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === feedbackData.length - 1}
          className={`px-4 py-2 rounded ${currentQuestionIndex === feedbackData.length - 1 ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div>

      <div className='mt-5'>
        <h4 className='font-semibold'>Your Score:</h4>
        <p>
          {feedbackData.filter(item => item.userAnswers === item.correctAnswers).length} / {feedbackData.length}
        </p>
      </div>
    </div>
    </>
  );
};

export default FeedbackPage;
