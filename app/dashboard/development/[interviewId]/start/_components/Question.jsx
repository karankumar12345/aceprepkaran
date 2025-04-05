import React from 'react';
import { Volume2 } from 'lucide-react';

const Question = ({ questions, activeQuestionIndex, selectedOption, onOptionSelect }) => {
  const texttospeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported');
    }
  };

  if (!questions || questions?.length === 0) {
    return <p className="text-gray-200">No questions available.</p>;
  }

  const currentQuestion = questions[activeQuestionIndex]; // Correctly reference the current question

  return (
    <div className="p-5 border rounded-lg bg-gray-900 text-gray-100">
      <h2 className="text-lg font-semibold mb-3">Question #{activeQuestionIndex + 1}</h2>
      <h2 className="text-lg font-semibold mb-3">{currentQuestion?.question}</h2>
      <Volume2 onClick={() => texttospeech(currentQuestion?.question)} className='cursor-pointer' />
    
    </div>
  );
};

export default Question;
