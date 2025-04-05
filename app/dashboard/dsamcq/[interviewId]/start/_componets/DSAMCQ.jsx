import { Volume2 } from "lucide-react";
import React from "react";

const DSAMCQ = ({ questions, activeQuestionIndex, selectedOption, onOptionSelect }) => {

  const texttospeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported');
    }
  };

  if (!questions || questions.length === 0) {
    return <p className="text-gray-500">No questions available.</p>;
  }

  const currentQuestion = questions[activeQuestionIndex]; // Correctly reference the current question

  return (
    <div className="p-5 border rounded-lg ">
      <h2 className="text-lg font-semibold mb-3">Question #{activeQuestionIndex + 1}</h2>
      <h2 className="text-lg font-semibold mb-3">{currentQuestion.question}</h2>
      <Volume2 onClick={() => texttospeech(currentQuestion.question)} className='cursor-pointer' />
      <div className="mb-5">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionSelect(option)}
            className={`block w-full text-left p-3 mb-2 rounded transition bg-gray-900 duration-300 border  
              ${selectedOption === option ? 'bg-blue-900 text-white hover:scale-[1.1]' : 'bg-gray-600 text-white hover:scale-[1.1] hover:bg-blue-100'}`}
          >
            {option}
          </button>
        ))}
        <Volume2 onClick={() => texttospeech(currentQuestion.options.join(", "))} className='cursor-pointer' />
      </div>
    </div>
  );
};

export default DSAMCQ;
